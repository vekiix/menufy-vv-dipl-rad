"use client"

import React, { memo } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar"
import { UserIcon } from "lucide-react"
import { DesktopNavItem } from "./navigation-item"
import { DesktopLogoutButton } from "./logout-button"
import { NAVIGATION_CSS_VARS } from "@/lib/constants/navigation"
import { useApp } from "../providers/app-provider"
import { usePathname } from "next/navigation"

const AppSidebarComponent = () => {
  const { filteredNavigationItems, logout, session } = useApp()
  const pathname = usePathname()

  return (
    <div>
      <Sidebar
        collapsible="icon"
        className="hidden md:flex border-r-0"
        style={NAVIGATION_CSS_VARS}
      >
        <div className="flex h-full w-full flex-col bg-gray-900 text-white">
          <SidebarHeader className="border-gray-800 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-white">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {session?.user?.role}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {session?.user?.company}
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="flex flex-col justify-between h-full p-2">
            {/* Navigation Items */}
            <SidebarMenu>
              {filteredNavigationItems.map((item) => (
                <DesktopNavItem
                  key={item.title}
                  item={{
                    ...item,
                    isActive: ("/" + item.url) === pathname,
                  }}
                />
              ))}
            </SidebarMenu>

            {/* Logout */}
            <DesktopLogoutButton onLogout={logout} />
          </SidebarContent>
        </div>
        <SidebarRail />
      </Sidebar>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const AppSidebar = memo(AppSidebarComponent);
