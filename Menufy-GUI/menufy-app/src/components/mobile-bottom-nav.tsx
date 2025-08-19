"use client"

import { Users, Table, Menu, ShoppingCart, History, CreditCard } from "lucide-react"

const navigationItems = [
  {
    title: "Users",
    icon: Users,
    url: "#",
    isActive: true,
  },
  {
    title: "Tables",
    icon: Table,
    url: "#",
    isActive: false,
  },
  {
    title: "Menus",
    icon: Menu,
    url: "#",
    isActive: false,
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    url: "#",
    isActive: false,
  },
  {
    title: "History",
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

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => (
          <a
            key={item.title}
            href={item.url}
            className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 ${
              item.isActive ? "text-blue-400" : "text-gray-400 hover:text-gray-200"
            }`}
            style={{ minHeight: "48px", minWidth: "48px" }}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium truncate">{item.title}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}
