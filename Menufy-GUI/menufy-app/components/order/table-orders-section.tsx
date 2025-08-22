import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import React from "react";
import type { TableWithOrders, Order } from "@/lib/models/Orders";
import { ActiveOrderCard } from "./active-order-card";

export function TableOrdersSection({
  table,
  isEditing,
  onMarkAsDelivered,
  onMarkAsPaid,
  formatPrice,
  formatTime,
}: {
  table: TableWithOrders
  isEditing: boolean
  onMarkAsDelivered: (orderId: string) => void
  onMarkAsPaid: (orderId: string) => void
  formatPrice: (price: number) => string
  formatTime: (dateString: string) => string
}) {
  const tableTotal = table.activeOrders.reduce((total: number, order: Order) => total + order.totalPrice, 0)

  return (
    <Card className="border-2 border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">{table.uid.slice(-2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{table.name}</CardTitle>
              <p className="text-sm text-gray-500">{table.activeOrders.length} active orders</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">{formatPrice(tableTotal)}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {table.activeOrders.map((order: Order) => (
            <ActiveOrderCard
              isEditing={isEditing}
              key={order.id}
              order={order}
              onMarkAsDelivered={() => onMarkAsDelivered(order.id)}
              onMarkAsPaid={() => onMarkAsPaid(order.id)}
              formatPrice={formatPrice}
              formatTime={formatTime}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 