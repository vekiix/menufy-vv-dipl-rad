import { UserRole } from '@/lib/enum/UserRole';
import navigationItems from '@/lib/utils/navigation-items';
import { Session } from 'next-auth';

// Routes that are allowed without authentication
export const publicRoutes = ['/login', '/login/guest', '/', "/demo"];

// Default routes for each user role
export const defaultRoute: { [key in UserRole]?: string } = {
  [UserRole.User]: '/tables',
  [UserRole.Admin]: '/users',
  [UserRole.Guest]: '/create-order',
};

// Dynamically generate protected routes from navigationItems
export const protectedRoutes: { [key in UserRole]?: string[] } = navigationItems.reduce((acc, item) => {
  if (item.requiresAuth) {
    if (!acc[item.role]) {
      acc[item.role] = [];
    }
    acc[item.role]!.push('/' + item.url);
  }
  return acc;
}, {} as { [key in UserRole]?: string[] });

// Helper to get role from string
export const getRoleFromString = (roleString: string): UserRole | null => {
  switch (roleString.toLowerCase()) {
    case 'admin': return UserRole.Admin;
    case 'user': return UserRole.User;
    case 'guest': return UserRole.Guest;
    default: return null;
  }
};

// Check if a route is public (doesn't require authentication)
export const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.includes(pathname);
};

// Get the default route for a user role
export const getDefaultRouteForRole = (role: UserRole): string => {
  return defaultRoute[role] || '/tables';
};

// Check if user has access to a specific route
export const hasRouteAccess = (pathname: string, userRole: UserRole | null): boolean => {
  if (!userRole) return false;
  
  const allowedRoutes = protectedRoutes[userRole];
  if (!allowedRoutes) return false;
  
  return allowedRoutes.some(route => pathname.startsWith(route));
};

// Get the appropriate redirect route based on current path and user role
export const getRedirectRoute = (
  pathname: string, 
  userRole: UserRole | null, 
  isAuthenticated: boolean,
  searchParams?: URLSearchParams
): string | null => {
  // If it's a public route, no redirect needed
  if (isPublicRoute(pathname)) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return '/login';
  }

  // If authenticated and on login page, redirect to default route
  // BUT allow logout parameter to pass through
  if (pathname === '/login' && userRole) {
    const isLogout = searchParams?.get('logout');
    
    // Don't redirect if this is a logout redirect
    if (!isLogout) {
      return getDefaultRouteForRole(userRole);
    }
    return null; // Allow staying on login page for logout
  }

  // If user doesn't have access to current route, redirect to default
  if (userRole && !hasRouteAccess(pathname, userRole)) {
    return getDefaultRouteForRole(userRole);
  }

  // No redirect needed
  return null;
};

// Main route protection function
export const checkRouteProtection = (
  pathname: string,
  session: Session | null,
  status: 'loading' | 'authenticated' | 'unauthenticated',
  searchParams?: URLSearchParams
): { shouldRedirect: boolean; redirectTo: string | null } => {
  // Don't redirect while loading
  if (status === 'loading') {
    return { shouldRedirect: false, redirectTo: null };
  }

  const isAuthenticated = status === 'authenticated' && session !== null;
  const userRole = session?.user?.role ? getRoleFromString(session.user.role) : null;
  
  const redirectTo = getRedirectRoute(pathname, userRole, isAuthenticated, searchParams);
  
  return {
    shouldRedirect: redirectTo !== null,
    redirectTo
  };
};

// Hook for use in components
export const useRouteProtection = (pathname: string, session: Session, status: string) => {
  return checkRouteProtection(pathname, session, status as 'loading' | 'authenticated' | 'unauthenticated');
};


