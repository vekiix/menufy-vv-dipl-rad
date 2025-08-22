"use client"

import { useEffect, useState } from "react"
import { Order } from "@/lib/models/Orders"
import { getOrdersForTable } from "@/lib/services/order-service"
import { TableOrderCard } from "./table-order-card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Receipt, Utensils } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getOrderStatusTitle, ORDER_STATUS_PRIORITY } from "@/lib/utils/order-utils"
import SockJS from "sockjs-client"
import Stomp from 'stompjs'
import { useApp } from "@/components/providers/app-provider"
import { WSOrderMessage } from "@/lib/res/WSOrderMessage"
import { useToast } from "@/components/providers/toast-provider"

export function TableOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  const { showToast } = useToast()
  const { session, status } = useApp()

  const fetchOrders = async () => {
    try {
      setError(null)
      const ordersData = await getOrdersForTable()
      setOrders(ordersData)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
      setError("Failed to load your orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  const handleRefresh = () => {
    fetchOrders()
  }

  const establishConnectionWithWS = () => {
    const socket = new SockJS(process.env.API_WS_URL || 'http://localhost:9002/ws')
    // STOMP client over SockJS
    const stompClient = Stomp.over(socket)
    
    // Optional: Disable console logging if not needed
    stompClient.debug = () => {}
    const headers = { Authorization: "Bearer " + session?.accessToken }
    // Connect to STOMP broker
    stompClient.connect(
      headers,
      () => {
        // Subscribe to messages
        setIsConnected(true)
        stompClient.subscribe('/topic/messages', (messageOutput) => {
          const newMessage: WSOrderMessage = JSON.parse(messageOutput.body)
          
          // Check if the message is relevant to this table's orders
          if (newMessage && newMessage.companyId === session?.user?.companyId) {
            // For table orders, we want to refresh on any status change that could affect the table
            // This includes PAID, DELIVERED, IN_PROGRESS, REJECTED status changes
            if (newMessage.newOrderStatus === "PAID" || 
                newMessage.newOrderStatus === "DELIVERED" || 
                newMessage.newOrderStatus === "IN_PROGRESS" ||
                newMessage.newOrderStatus === "REJECTED") {
              showToast(`Order ${newMessage.orderId.slice(-6)} status changed to ${newMessage.newOrderStatus}`, "info")
              fetchOrders()
            }
          }
        })
      },
      async (error) => {
        setIsConnected(false)
        await new Promise(resolve => setTimeout(resolve, 10000))
        showToast(`Connection with WS lost. ${error}`, "error")
        establishConnectionWithWS()
      }
    )
  }

  useEffect(() => {
    // Only fetch data and establish WS connection if session is authenticated
    if (status === 'authenticated' && session) {
      fetchOrders()
      establishConnectionWithWS()
    }
  }, [session])
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Orders</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Orders</h1>
          <p className="text-gray-600">Track your current and past orders</p>
        </div>
        
        <Card className="border-gray-200">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <Utensils className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-4 max-w-sm">
              You haven&39;t placed any orders yet. When you do, they&39;ll appear here so you can track their progress.
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <Receipt className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Group orders by status for better organization
  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.status]) {
      acc[order.status] = []
    }
    acc[order.status].push(order)
    return acc
  }, {} as Record<string, Order[]>)

  // Order status priority for display
  const sortedStatuses = ORDER_STATUS_PRIORITY.filter(status => groupedOrders[status]?.length > 0)

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Orders</h1>
          <p className="text-gray-600">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <Receipt className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Orders grouped by status */}
      <div className="space-y-8">
        {sortedStatuses.map((status) => (
          <div key={status}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {getOrderStatusTitle(status)} ({groupedOrders[status].length})
            </h2>
            <div className="space-y-4">
              {groupedOrders[status]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((order) => (
                  <TableOrderCard
                    key={order.id}
                    order={order}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
