"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { X, Utensils, RefreshCw } from "lucide-react"
import { formatDateTime, formatPrice } from "@/lib/utils/utils"
import { Payment } from "@/lib/models/Payment"
import { getPaymentInfo } from "@/lib/services/payment-service"
import { Order } from "@/lib/models/Orders"

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) {
  const [payment, setPayment] = useState<Payment>()
  const [isLoadingPayment, setIsLoadingPayment] = useState(false)

  const fetchPayment = async () => {
    if (!order?.transactionToken) return
    
    setIsLoadingPayment(true)
    try {
      const payment = await getPaymentInfo(order.transactionToken)
      setPayment(payment)
    } catch (err) {
      console.error("Failed to fetch payment:", err)
    } finally {
      setIsLoadingPayment(false)
    }
  }

  useEffect(() => {
    if (isOpen && order) {
      fetchPayment()
    } else {
      // Clear payment state when modal closes or order changes
      setPayment(undefined)
      setIsLoadingPayment(false)
    }
  }, [isOpen, order])

  if (!order) return null

  // Group items by name and sum quantities
  const groupedItems = order.lines.reduce(
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

  const getStatusBadge = () => {
    switch (order.status) {
      case "ORDERED":
        return <Badge className="bg-orange-100 text-orange-800">Ordered</Badge>
      case "IN_PROGRESS":
        return <Badge className="bg-blue-100 text-blue-800">Accepted</Badge>
      case "DELIVERED":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case "PAID":
        return <Badge className="bg-gray-100 text-gray-800">Paid</Badge>
      default:
        return <Badge variant="secondary">{order.status}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between sm:hidden mb-4">
          <DialogTitle className="text-lg font-semibold">Order Details</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop Header */}
        <DialogHeader className="hidden sm:block">
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                  {order.tableId.slice(-2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">#{order.id}</h3>
                <p className="text-sm text-gray-500">Table #{order.tableId}</p>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge()}
              <div className="text-lg font-bold text-gray-900 mt-1">{formatPrice(order.totalPrice)}</div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
            <div className="space-y-3">
              {groupedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        <Utensils className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                    <div className="text-sm text-gray-500">{formatPrice(item.price)} each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Order Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Order Placed</div>
                  <div className="text-xs text-gray-500">{formatDateTime(order.createdAt)}</div>
                </div>
              </div>

              {order.status !== "ORDERED" && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Order Accepted</div>
                    <div className="text-xs text-gray-500">Order was accepted and prepared</div>
                  </div>
                </div>
              )}

              {order.deliveredAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Order Delivered</div>
                    <div className="text-xs text-gray-500">{formatDateTime(order.deliveredAt)}</div>
                  </div>
                </div>
              )}

              {order.paidAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Payment Completed</div>
                    <div className="text-xs text-gray-500">{formatDateTime(order.paidAt)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(order.totalPrice * 0.75)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">{formatPrice(order.totalPrice * 0.25)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>

          {/* Transaction Info */}
          {isLoadingPayment ? (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-3">Transaction Details</div>
              <div className="flex flex-col items-center justify-center space-y-3 py-4">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 text-gray-600 animate-spin" />
                  <span className="text-sm text-gray-600">Loading payment information...</span>
                </div>
                <div className="space-y-2 w-full max-w-xs">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
            </div>
          ) : payment ? (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-900 mb-1">Transaction Details</div>
              <div className="text-xs text-blue-700">Payment ID: {payment.id}</div>
              <div className="text-xs text-blue-700">Order ID: {payment.orderId}</div>
              <div className="text-xs text-blue-700">Company ID: {payment.companyId}</div>
              <div className="text-xs text-blue-700">Status: {payment.status}</div>
              <div className="text-xs text-blue-700">Amount: {payment.paymentAmount.toFixed(2)} €</div>
              <div className="text-xs text-blue-700">Payment Type: {payment.paymentType}</div>
              <div className="text-xs text-blue-700">Created At: {new Date(payment.createdAt).toLocaleString()}</div>
              {payment.paidAt && (
                <div className="text-xs text-blue-700">Paid At: {new Date(payment.paidAt).toLocaleString()}</div>
              )}
              <div className="text-xs text-blue-700">Merchant Transaction: {JSON.stringify(payment.merchantTransaction)}</div>
            </div>
          ) : (
            <div className="p-3 bg-red-50 rounded-lg"> 
              <div className="text-sm font-medium text-red-900 mb-1 flex justify-center items-center">Payment details don&#39;t exist</div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 