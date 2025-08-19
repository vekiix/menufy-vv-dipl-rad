"use client"

import type React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/app/components/ui/sidebar"
import { Users, Table, Menu, ShoppingCart, History, CreditCard, Settings } from "lucide-react"

const navigationItems = [
  {
    title: "Manage Users",
    icon: Users,
    url: "#",
    isActive: true,
  },
  {
    title: "Manage Tables",
    icon: Table,
    url: "#",
    isActive: false,
  },
  {
    title: "Manage Menus",
    icon: Menu,
    url: "#",
    isActive: false,
  },
  {
    title: "Active Orders",
    icon: ShoppingCart,
    url: "#",
    isActive: false,
  },
  {
    title: "Order History",
    icon: History,
    url: "#",
    isActive: false,
  },
  {
    title: "Payments",
    icon: CreditCard,
    url: "#",
    isActive: false,
  },
]

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="hidden md:flex border-r-0"
      style={
        {
          "--sidebar-width": "240px",
          "--sidebar-width-icon": "60px",
        } as React.CSSProperties
      }
    >
      <div className="flex h-full w-full flex-col bg-gray-900 text-white">
        <SidebarHeader className="border-b border-gray-800 p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white group-data-[collapsible=icon]:hidden">Admin Panel</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 p-2">
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.title}>
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
            ))}
          </SidebarMenu>
        </SidebarContent>
      </div>
      <SidebarRail />
    </Sidebar>
  )
}
