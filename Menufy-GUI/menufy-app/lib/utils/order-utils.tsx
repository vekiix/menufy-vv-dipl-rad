import { Badge } from "@/components/ui/badge"
import { Receipt, Clock, Truck, CreditCard } from "lucide-react"
import { Order, OrderStatus } from "@/lib/models/Orders"

/**
 * Get the status badge component for an order
 */
export const getOrderStatusBadge = (order: Order) => {
  switch (order.status) {
    case "ORDERED":
      return <Badge className="bg-orange-100 text-orange-800">Ordered</Badge>
    case "IN_PROGRESS":
      return <Badge className="bg-yellow-100 text-yellow-800">Preparing</Badge>
    case "DELIVERED":
      return <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
    case "PAID":
      return <Badge className="bg-green-100 text-green-800">Paid</Badge>
    case "REJECTED":
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
    default:
      return <Badge variant="secondary">{order.status}</Badge>
  }
}

/**
 * Get the status badge for order history (with slightly different styling)
 */
export const getOrderHistoryStatusBadge = (order: Order) => {
  switch (order.status) {
    case "ORDERED":
      return <Badge className="bg-orange-100 text-white-800">Ordered</Badge>
    case "IN_PROGRESS":
      return <Badge className="bg-yellow-100 text-gray-800">Accepted</Badge>
    case "DELIVERED":
      return <Badge className="bg-blue-100 text-white-800">Delivered</Badge>
    case "PAID":
      return <Badge className="bg-green-100 text-gray-800">Paid</Badge>
    case "REJECTED":
      return <Badge className="bg-red-100 text-gray-800">Rejected</Badge>
    default:
      return <Badge variant="secondary">{order.status}</Badge>
  }
}

/**
 * Get the status badge for active orders (management view)
 */
export const getActiveOrderStatusBadge = (order: Order) => {
  switch (order.status) {
    case "IN_PROGRESS":
      return <Badge className="bg-blue-100 text-blue-800">Preparing</Badge>
    case "DELIVERED":
      return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
    case "PAID":
      return <Badge className="bg-gray-100 text-gray-800">Paid</Badge>
    default:
      return <Badge variant="secondary">{order.status}</Badge>
  }
}

/**
 * Get the border color class for order status
 */
export const getOrderStatusColor = (order: Order): string => {
  switch (order.status) {
    case "ORDERED":
      return "border-l-orange-500"
    case "IN_PROGRESS":
      return "border-l-yellow-500"
    case "DELIVERED":
      return "border-l-blue-500"
    case "PAID":
      return "border-l-green-500"
    case "REJECTED":
      return "border-l-red-500"
    default:
      return "border-l-gray-500"
  }
}

/**
 * Get the status icon for an order
 */
export const getOrderStatusIcon = (order: Order, size: "sm" | "md" = "md") => {
  const sizeClass = size === "sm" ? "h-3 w-3" : "h-4 w-4"
  
  switch (order.status) {
    case "ORDERED":
      return <Receipt className={`${sizeClass} text-orange-600`} />
    case "IN_PROGRESS":
      return <Clock className={`${sizeClass} text-yellow-600`} />
    case "DELIVERED":
      return <Truck className={`${sizeClass} text-blue-600`} />
    case "PAID":
      return <CreditCard className={`${sizeClass} text-green-600`} />
    case "REJECTED":
      return <Receipt className={`${sizeClass} text-red-600`} />
    default:
      return <Receipt className={`${sizeClass} text-gray-600`} />
  }
}

/**
 * Group order items by name and sum quantities
 */
export const groupOrderItems = (order: Order) => {
  return order.lines.reduce(
    (acc, line) => {
      const existingItem = acc.find((item) => item.name === line.item.name)
      if (existingItem) {
        existingItem.quantity += line.quantity
      } else {
        acc.push({
          name: line.item.name,
          price: line.item.price,
          quantity: line.quantity,
        })
      }
      return acc
    },
    [] as { name: string; price: number; quantity: number }[],
  )
}

/**
 * Calculate total items in an order
 */
export const getTotalOrderItems = (order: Order): number => {
  return order.lines.reduce((total, line) => total + line.quantity, 0)
}

/**
 * Get human-readable status title for grouping
 */
export const getOrderStatusTitle = (status: string): string => {
  switch (status) {
    case "ORDERED":
      return "Pending Orders"
    case "IN_PROGRESS":
      return "Being Prepared"
    case "DELIVERED":
      return "Delivered, Ready to Pay"
    case "PAID":
      return "Completed Orders"
    case "REJECTED":
      return "Rejected Orders"
    default:
      return status
  }
}

/**
 * Get time since order was created
 */
export const getTimeSinceOrder = (createdAt: string): string => {
  const now = new Date()
  const orderTime = new Date(createdAt)
  const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) {
    return "Just now"
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days}d ago`
  }
}

/**
 * Order status priority for sorting/display
 */
export const ORDER_STATUS_PRIORITY = ["ORDERED", "IN_PROGRESS", "DELIVERED", "PAID", "REJECTED"] as const

/**
 * Sort orders by status priority and creation date
 */
export const sortOrdersByStatusAndDate = (orders: Order[]): Order[] => {
  return orders.sort((a, b) => {
    // First sort by status priority
    const aStatusIndex = ORDER_STATUS_PRIORITY.indexOf(a.status as OrderStatus)
    const bStatusIndex = ORDER_STATUS_PRIORITY.indexOf(b.status as OrderStatus)
    
    if (aStatusIndex !== bStatusIndex) {
      return aStatusIndex - bStatusIndex
    }
    
    // Then sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}
