"use client"

import { memo } from "react"
import { NavigationItem } from "@/lib/utils/navigation-items"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { NAVIGATION_CONSTANTS } from "@/lib/constants/navigation"

interface DesktopNavItemProps {
  item: NavigationItem & { isActive: boolean }
}

const DesktopNavItemComponent = ({ item }: DesktopNavItemProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton
      asChild
      isActive={item.isActive}
      tooltip={item.title}
      className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 data-[active=true]:bg-blue-600 data-[active=true]:text-white"
    >
      <a href={item.url} className="flex items-center space-x-3 p-3">
        <item.icon className="h-5 w-5 flex-shrink-0" />
        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
      </a>
    </SidebarMenuButton>
  </SidebarMenuItem>
)

interface MobileNavItemProps {
  item: NavigationItem & { isActive: boolean }
}

const MobileNavItemComponent = ({ item }: MobileNavItemProps) => (
  <a
    href={item.url}
    className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 ${
      item.isActive ? "text-blue-400" : "text-gray-400 hover:text-gray-200"
    }`}
    style={{ 
      minHeight: NAVIGATION_CONSTANTS.MOBILE.MIN_HEIGHT, 
      minWidth: NAVIGATION_CONSTANTS.MOBILE.MIN_WIDTH 
    }}
  >
    <item.icon className="h-5 w-5 mb-1" />
    <span className="text-xs font-medium truncate">{item.mobile_title}</span>
  </a>
)

export const DesktopNavItem = memo(DesktopNavItemComponent)
export const MobileNavItem = memo(MobileNavItemComponent)
