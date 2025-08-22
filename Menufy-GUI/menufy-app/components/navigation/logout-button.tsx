"use client"

import { memo } from "react"
import { LogOutIcon } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { NAVIGATION_CONSTANTS } from "@/lib/constants/navigation"

interface DesktopLogoutButtonProps {
  onLogout: () => Promise<void>
}

const DesktopLogoutButtonComponent = ({ onLogout }: DesktopLogoutButtonProps) => (
  <div className="mt-4 p-2 border-t border-gray-700">
    <SidebarMenuButton
      asChild
      isActive={false}
      tooltip="Logout"
      className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
    >
      <button
        onClick={onLogout}
        className="flex items-center space-x-3 w-full text-red-400 hover:text-white hover:bg-red-600 rounded transition p-3"
      >
        <LogOutIcon className="h-5 w-5 flex-shrink-0" />
        <span className="group-data-[collapsible=icon]:hidden">Logout</span>
      </button>
    </SidebarMenuButton>
  </div>
)

interface MobileLogoutButtonProps {
  onLogout: () => Promise<void>
}

const MobileLogoutButtonComponent = ({ onLogout }: MobileLogoutButtonProps) => (
  <button
    onClick={onLogout}
    className="flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 text-red-400 hover:text-red-300 transition-colors"
    style={{ 
      minHeight: NAVIGATION_CONSTANTS.MOBILE.MIN_HEIGHT, 
      minWidth: NAVIGATION_CONSTANTS.MOBILE.MIN_WIDTH 
    }}
  >
    <LogOutIcon className="h-5 w-5 mb-1" />
    <span className="text-xs font-medium truncate">Logout</span>
  </button>
)

export const DesktopLogoutButton = memo(DesktopLogoutButtonComponent)
export const MobileLogoutButton = memo(MobileLogoutButtonComponent)
