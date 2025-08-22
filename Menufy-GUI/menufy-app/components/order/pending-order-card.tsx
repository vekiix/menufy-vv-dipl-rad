import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Clock, Check, X } from "lucide-react";
import { groupOrderItems, getTimeSinceOrder } from "@/lib/utils/order-utils";
import React from "react";
import type { Order } from "@/lib/models/Orders";

export function PendingOrderCard({
  order,
  isEditing,
  tableName,
  onAccept,
  onReject,
  formatPrice,
  formatTime,
}: {
  order: Order
  isEditing: boolean
  tableName: string
  onAccept: () => void
  onReject: () => void
  formatPrice: (price: number) => string
  formatTime: (dateString: string) => string
}) {
  const groupedItems = groupOrderItems(order)

  return (
    <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-orange-100 text-orange-600 text-xs font-medium">
                {order.tableId.slice(-2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">{tableName}</CardTitle>
              <p className="text-xs text-gray-500">Order #{order.id.slice(-6)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">{formatPrice(order.totalPrice)}</div>
            <div className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {getTimeSinceOrder(order.createdAt)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          {groupedItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">
                {item.quantity}x {item.name}
              </span>
              <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <Separator className="my-3" />

        <div className="flex space-x-2">
          <Button disabled={isEditing} onClick={onAccept} size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
            <Check className="h-4 w-4 mr-1" />
            Accept
          </Button>
          <Button  disabled={isEditing} onClick={onReject} variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>

        <div className="mt-2 text-xs text-gray-500">Ordered at {formatTime(order.createdAt)}</div>
      </CardContent>
    </Card>
  )
} 