"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Truck } from "lucide-react"
import { formatDate, formatTime, formatDateTime, formatPrice } from "@/lib/utils/utils"
import { 
  getOrderStatusBadge,
  getOrderStatusColor,
  getOrderStatusIcon,
  groupOrderItems,
  getTotalOrderItems
} from "@/lib/utils/order-utils"
import { Order } from "@/lib/models/Orders"
import { PaymentActions } from "./payment-actions"
import { useToast } from "../providers/toast-provider"

interface TableOrderCardProps {
  order: Order
  onClick?: () => void
}

export function TableOrderCard({ order, onClick }: TableOrderCardProps) {
  const groupedItems = groupOrderItems(order)
  const totalItems = getTotalOrderItems(order)

  const { showToast } = useToast()
  const shouldShowPayButton = () => {
    return !order.paidAt && order.transactionToken
  }

  return (
    <Card 
      className={`${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-shadow border-l-4 ${getOrderStatusColor(order)}`} 
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                {getOrderStatusIcon(order)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold">Order #{order.id.slice(-6)}</CardTitle>
              <p className="text-sm text-gray-500">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <div className="text-right">
            {getOrderStatusBadge(order)}
            <div className="text-xl font-bold text-gray-900 mt-1">{formatPrice(order.totalPrice)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Order Items Preview */}
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

        {/* Order Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Ordered on {formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{formatTime(order.createdAt)}</span>
            </div>
          </div>

          

          {/* Additional status information */}
          {(order.deliveredAt || order.paidAt) && (
            <>
            <Separator className="my-3" />
            
          {order.deliveredAt && (
              <div className="flex items-center text-sm text-blue-600 mb-2">
              <Truck className="h-4 w-4 mr-2" />
              <span>Delivered at {formatDateTime(order.deliveredAt)}</span>
            </div>
          )}

            </>
          )}

        </div>

        {/* Payment Section */}
        {shouldShowPayButton() && (
          <PaymentActions
            orderId={order.id}
            totalPrice={order.totalPrice}
            transactionToken={order.transactionToken!}
            onPaymentSuccess={() => {
              showToast("Payment processed successfully!", "success")
            }}
          />
        )}

        {/* Transaction Token Display (for non-payable orders) */}
        {order.transactionToken && !shouldShowPayButton() && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Transaction: {order.transactionToken}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
