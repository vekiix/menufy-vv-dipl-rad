'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { checkRouteProtection } from '@/lib/utils/route-protection';
import { useApp } from '@/components/providers/app-provider';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuardContent = ({ children }: RouteGuardProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, status } = useApp();

  useEffect(() => {
    // Don't redirect while loading
    if (status === 'loading') return;

    const { shouldRedirect, redirectTo } = checkRouteProtection(pathname, session, status, searchParams);
    
    if (shouldRedirect && redirectTo) {
      router.push(redirectTo);
    }
  }, [pathname, session, status, router, searchParams]);

  // Show loading spinner while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const RouteGuard = ({ children }: RouteGuardProps) => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RouteGuardContent>{children}</RouteGuardContent>
    </Suspense>
  );
};
