import { Users, Table, Menu, ShoppingCart, History, CreditCard, LogOut, Building, LucideIcon, CookingPot, ChefHat } from "lucide-react"
import { UserRole } from "../enum/UserRole"

export interface NavigationItem {
  title: string;
  mobile_title: string;
  role: UserRole;
  icon: LucideIcon;
  url: string;
  requiresAuth: boolean;
}

export const logoutIcon = LogOut;

const navigationItems: NavigationItem[] = [
  {
    title: "Manage Users",
    mobile_title: "Users",
    role: UserRole.Admin,
    icon: Users,
    url: "users",
    requiresAuth: true,
  },
  {
    title: "Manage Companies",
    mobile_title: "Companies",
    role: UserRole.Admin,
    icon: Building,
    url: "companies",
    requiresAuth: true,
  },
  {
    title: "Manage Tables",
    mobile_title: "Tables",
    role: UserRole.User,
    icon: Table,
    url: "tables",
    requiresAuth: true,
  },
  {
    title: "Manage Menus",
    mobile_title: "Menus",
    role: UserRole.User,
    icon: Menu,
    url: "menu",
    requiresAuth: true,
  },
  {
    title: "Active Orders",
    mobile_title: "Orders",
    role: UserRole.User,
    icon: ShoppingCart,
    url: "orders",
    requiresAuth: true,
  },
  {
    title: "Order History",
    mobile_title: "History",
    role: UserRole.User,
    icon: History,
    url: "order-history",
    requiresAuth: true,
  },
  {
    title: "Payment info",
    mobile_title: "Payments",
    role: UserRole.User,
    icon: CreditCard,
    url: "payment-info",
    requiresAuth: true,
  },
  {
    title: "Order",
    mobile_title: "Order",
    role: UserRole.Guest,
    icon: ChefHat,
    url: "create-order",
    requiresAuth: true,
  },
  {
    title: "Table Orders",
    mobile_title: "Table Orders",
    role: UserRole.Guest,
    icon: CookingPot,
    url: "table-orders",
    requiresAuth: true,
  }
]

export default navigationItems;
