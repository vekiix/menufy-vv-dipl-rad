"use client"

import { memo } from "react"
import { MobileNavItem } from "./navigation-item"
import { MobileLogoutButton } from "./logout-button"
import { useApp } from "../providers/app-provider"
import { usePathname } from "next/navigation"

const MobileBottomNavComponent = () => {
  const { filteredNavigationItems, session, logout } = useApp()
  const pathname = usePathname()

  // Don't show navigation if not authenticated
  if (!session?.user) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {filteredNavigationItems.map((item) => (
                  <MobileNavItem
                    key={item.title}
                    item={{
                      ...item,
                      isActive: ("/" + item.url) === pathname,
                    }}
                  />
                ))}
        
        {/* Logout Button */}
        <MobileLogoutButton onLogout={logout} />
      </div>
    </nav>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const MobileBottomNav = memo(MobileBottomNavComponent);
