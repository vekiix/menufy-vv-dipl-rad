'use client';

import React, { createContext, useContext, useMemo, useEffect, useState, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { UserRole } from '@/lib/enum/UserRole';
import navigationItems, {NavigationItem} from '@/lib/utils/navigation-items';
import { getRoleFromString } from '@/lib/utils/route-protection';
import { cartStorageManager } from '@/lib/utils/cart-storage-manager';
import { Session } from 'next-auth';

interface AppContextType {
  // Navigation
  filteredNavigationItems: NavigationItem[];
  userRole: UserRole | null;
  isClient: boolean;
  // Session data
  session: Session | null;
  status: 'authenticated' | 'loading' | 'unauthenticated';
  // Authentication
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  // Set isClient on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Derive userRole from session
  const userRole = useMemo(() => {
    if (!session?.user?.role) return null;
    return getRoleFromString(session.user.role);
  }, [session?.user?.role]);

  // Filter navigation items
  const filteredNavigationItems = useMemo(() => {
    if (!isClient || status !== 'authenticated' || !session || userRole === null) return [];
    return navigationItems.filter(item => item.role === userRole && (!item.requiresAuth || session));
  }, [isClient, status, session, userRole]);

  // Authentication methods - memoize to prevent recreating on every render
  const login = useMemo(() => async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      
      // Use redirect: true - NextAuth will handle success/error redirects automatically
      await signIn('credentials', {
        username,
        password,
        redirect: true,
        callbackUrl: '/redirect'
      });
      
      return { success: true };
      
    } catch (error) {
      const errorMessage = `Login failed: ${error}`;
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useMemo(() => async (): Promise<void> => {
    try {
      // Clear cart from localStorage before signing out
      cartStorageManager.clearCartFromStorage();
      await signOut({ redirect: true, callbackUrl: '/redirect' });
    } catch (error) {
      // Still try to clear cart even if signOut fails
      cartStorageManager.clearCartFromStorage();
      window.location.assign('/redirect');
    }
  }, []);

  const value = useMemo(() => ({
    userRole,
    isClient,
    filteredNavigationItems,
    session,
    status,
    login,
    logout,
  }), [userRole, isClient, filteredNavigationItems, session, status, login, logout]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 