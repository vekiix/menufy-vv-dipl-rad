"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { publicRoutes } from "@/lib/utils/route-protection";

interface LayoutWithSidebarProps {
  children: React.ReactNode;
}

const LayoutWithSidebarComponent = ({ children }: LayoutWithSidebarProps) => {
  const pathname = usePathname();
  
  // Check if current route is a public route (login, landing page, etc.)
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // For public routes, render without sidebar layout
  // RouteGuard will handle redirects if user tries to access protected routes without auth
  if (isPublicRoute) {
    return <>{children}</>;
  }
  
  // For protected routes, use the sidebar layout
  // RouteGuard ensures only authenticated users can reach protected routes
  return (
    <SidebarProvider>
      {/* Desktop Sidebar */}
      <AppSidebar />
      
      {/* Main Content */}
      <SidebarInset>
        {children}
      </SidebarInset>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </SidebarProvider>
  );
};

// Memoize the component to prevent unnecessary re-renders
const LayoutWithSidebar = memo(LayoutWithSidebarComponent);

export default LayoutWithSidebar; 