"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock } from "lucide-react"
import { formatDate, formatTime, formatDateTime, formatPrice } from "@/lib/utils/utils"
import { 
  getOrderHistoryStatusBadge,
  getOrderStatusColor,
  groupOrderItems
} from "@/lib/utils/order-utils"
import { Table } from "@/lib/models/Table"
import { Order } from "@/lib/models/Orders"

interface OrderHistoryCardProps {
  order: Order
  table: Table
  onClick: () => void
}

export function OrderHistoryCard({
  order,
  table,
  onClick
}: OrderHistoryCardProps) {
  const groupedItems = groupOrderItems(order)

  return (
    <Card className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${getOrderStatusColor(order)}`} onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                {order.tableId.slice(-2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-medium">Order #<b>{order.id}</b></CardTitle>
              <p className="text-sm text-gray-500">Table #<b>{table.tableName ? table.tableName : order.tableId}</b></p>
            </div>
          </div>
          <div className="text-right">
            {getOrderHistoryStatusBadge(order)}
            <div className="text-lg font-bold text-gray-900 mt-1">{formatPrice(order.totalPrice)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Order Items Preview */}
        <div className="space-y-2 mb-4">
          {groupedItems.slice(0, 2).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">
                {item.quantity} x {item.name}
              </span>
              <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          {groupedItems.length > 2 && (
            <div className="text-sm text-gray-500">+{groupedItems.length - 2} more items</div>
          )}
        </div>

        <Separator className="my-3" />

        {/* Order Details */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatTime(order.createdAt)}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">{order.lines.reduce((total: number, line) => total + line.quantity, 0)} items</div>
        </div>

        {/* Payment and Delivery Info */}
        {(order.deliveredAt || order.paidAt) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-col space-y-1 text-xs text-gray-500">
              {order.createdAt && <div>Created: {formatDateTime(order.createdAt)}</div>}
              {order.deliveredAt && <div>Delivered: {formatDateTime(order.deliveredAt)}</div>}
              {order.paidAt && <div>Paid: {formatDateTime(order.paidAt)}</div>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 