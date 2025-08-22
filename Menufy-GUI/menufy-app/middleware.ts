import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { publicRoutes, getDefaultRouteForRole, getRoleFromString, hasRouteAccess } from '@/lib/utils/route-protection';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;
    
    // Get user role from token
    const userRole = token?.role ? getRoleFromString(token.role as string) : null;
    
    if(pathname === '/redirect') {
      console.log('🔄 [MIDDLEWARE] Handling /redirect route' + userRole);
      if(userRole !== null) {
        return NextResponse.redirect(new URL(getDefaultRouteForRole(userRole), req.url));
      } else {
        // If no token (user is logged out), redirect to login with logout parameter
        return NextResponse.redirect(new URL('/login?logout=true', req.url));
      }
    }

    // If authenticated and on login page, redirect to default route
    // BUT allow logout parameter to pass through
    if (pathname === '/login' && token && userRole) {
      const url = new URL(req.url);
      const isLogout = url.searchParams.get('logout');
      
      // Don't redirect if this is a logout redirect
      if (!isLogout) {
        const defaultRoute = getDefaultRouteForRole(userRole);
        return NextResponse.redirect(new URL(defaultRoute, req.url));
      }
    }

    // If authenticated and on guest login page, redirect to default route
    if (pathname === '/login/guest' && token && userRole) {
      const defaultRoute = getDefaultRouteForRole(userRole);
      return NextResponse.redirect(new URL(defaultRoute, req.url));
    }

    // Allow public routes for unauthenticated users
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // If no token and trying to access protected route, redirect to login
    if (!token && !publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Check if authenticated user has access to the current route
    if (token && userRole) {
      const hasAccess = hasRouteAccess(pathname, userRole);
      if (!hasAccess) {
        const defaultRoute = getDefaultRouteForRole(userRole);
        return NextResponse.redirect(new URL(defaultRoute, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow the middleware to run
        // We'll handle authorization logic inside the middleware function
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.png (logo file)
     * - *.svg, *.png, *.jpg, *.jpeg, *.gif, *.webp (static images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
