import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Truck, CreditCard, Timer } from "lucide-react";
import { 
  getActiveOrderStatusBadge,
  getOrderStatusColor,
  groupOrderItems,
  getTimeSinceOrder
} from "@/lib/utils/order-utils";
import React from "react";
import type { Order } from "@/lib/models/Orders";

export function ActiveOrderCard({
  order,
  isEditing,
  onMarkAsDelivered,
  onMarkAsPaid,
  formatPrice,
  formatTime,
}: {
  order: Order
  isEditing: boolean
  onMarkAsDelivered: () => void
  onMarkAsPaid: () => void
  formatPrice: (price: number) => string
  formatTime: (dateString: string) => string
}) {
  const groupedItems = groupOrderItems(order)

  const getActionButtons = () => {
    if (order.status === "IN_PROGRESS") {
      return (
        <Button disabled={isEditing} onClick={onMarkAsDelivered} size="sm" className="w-full bg-green-600 hover:bg-green-700">
          <Truck className="h-4 w-4 mr-1" />
          Mark as Delivered
        </Button>
      )
    }

    if (order.status === "DELIVERED") {
      return (
        <Button disabled={isEditing} onClick={onMarkAsPaid} size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
          <CreditCard className="h-4 w-4 mr-1" />
          Mark as Paid
        </Button>
      )
    }

    return null
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 border-l-4 ${getOrderStatusColor(order)}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-900">#{order.id}</div>
          <div className="flex items-center text-xs text-gray-500">
            <Timer className="w-3 h-3 mr-1" />
            {getTimeSinceOrder(order.createdAt)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getActiveOrderStatusBadge(order)}
          <div className="text-sm font-semibold text-gray-900">{formatPrice(order.totalPrice)}</div>
        </div>
      </div>

      <div className="space-y-1 mb-3">
        {groupedItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              {item.quantity} x {item.name}
            </span>
            <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {getActionButtons() && (
        <>
          <Separator className="my-3" />
          {getActionButtons()}
        </>
      )}

      <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
        <span>Ordered at {formatTime(order.createdAt)}</span>
        {order.deliveredAt && <span>Delivered at {formatTime(order.deliveredAt)}</span>}
      </div>
    </div>
  )
}
