"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { acceptPendingOrder, deliverActiveOrder, getActiveOrders, getPendingOrders, markOrderAsPaid, rejectPendingOrder } from "@/lib/services/order-service"
import { useToast } from "../providers/toast-provider"
import { formatPrice, formatTime } from "@/lib/utils/utils"
import SockJS from "sockjs-client"
import Stomp from 'stompjs';
import { useApp } from "@/components/providers/app-provider"
import { WSOrderMessage } from "@/lib/res/WSOrderMessage"
import { DataStatusView } from "@/components/ui/data-status-view"
import { PendingOrderCard } from "./pending-order-card";
import { TableOrdersSection } from "./table-orders-section";
import { Order, TableWithOrders } from "@/lib/models/Orders"


export function OrdersManagementPage() {

  const { showToast } = useToast();
  const { session, status } = useApp();

  const fetchPendingOrders = async () => {
    try{
      const pOrders = await getPendingOrders() || [];
      setPendingOrders(pOrders);
    }catch(error)
    {
      showToast(`There was a problem while fetching pending orders.${error}`, "error")
    }
  }
  const fetchActiveOrders = async () => {
    try{
      const aOrders = await getActiveOrders();
      setActiveOrdersTables(aOrders);
    }catch(error)
    {
      showToast(`There was a problem while fetching active orders.${error}`, "error")
    }
  }

  const establishConnectionWithWS = () => {
    const socket = new SockJS(process.env.API_WS_URL || 'http://localhost:9002/ws');
        // STOMP client over SockJS
        const stompClient = Stomp.over(socket);
    
        // Optional: Disable console logging if not needed
        stompClient.debug = () => {};
        const headers = { Authorization: "Bearer " + session?.accessToken };
        // Connect to STOMP broker
        stompClient.connect(
          headers,
          () => {
            // Subscribe to messages
            setIsConnected(true);
            stompClient.subscribe('/topic/messages', (messageOutput) => {
                const newMessage : WSOrderMessage = JSON.parse(messageOutput.body);
                if(newMessage && newMessage.companyId === session?.user?.companyId && 
                    (newMessage.newOrderStatus === "ORDERED" || newMessage.newOrderStatus === "PAID") ){
                    showToast(`Order with ID:${newMessage.orderId} has changed status to ${newMessage.newOrderStatus}`, "info");
                    if(newMessage.newOrderStatus === "ORDERED"){
                      fetchPendingOrders()
                    }
                    if(newMessage.newOrderStatus === "PAID"){
                      fetchActiveOrders()
                    }
                }
            });
          },
          async (error) => {
            setIsConnected(false);
            showToast(`There was a problem while establishing connection with WS. ${error}`, "error")
            await new Promise(resolve => setTimeout(resolve, 10000));
            establishConnectionWithWS();
          }
        )
  }

  useEffect(() => {
    // Only fetch data if session is authenticated (not loading or unauthenticated)
    if (status === 'authenticated' && session) {
      fetchPendingOrders()
      fetchActiveOrders()
      establishConnectionWithWS();
    }
  },[session])

  const [pendingOrders, setPendingOrders] = useState<Order[]>([])
  const [activeOrdersTables, setActiveOrdersTables] = useState<TableWithOrders[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isEditing, setIsEditing] = useState(false)



  // Order management functions
  const handleAcceptOrder = async (orderId: string) => {

    try{
      setIsEditing(true);
      const tables = await acceptPendingOrder(orderId);
      setActiveOrdersTables(tables);
      setPendingOrders(pendingOrders.filter((o) => o.id !== orderId))
      showToast(`Order ${orderId} has succefuly been ACCEPTED`, "success")
    }
    catch(err){
      showToast(`There was a problem while accepting an order. ${err}`, "error")
    }
      setIsEditing(false);

  }

  const handleRejectOrder = async (orderId: string) => {
    try{
      setIsEditing(true);

      const tables = await rejectPendingOrder(orderId);
      setActiveOrdersTables(tables);
      setPendingOrders(pendingOrders.filter((o) => o.id !== orderId))
      showToast(`Order ${orderId} has succefuly been REJECTED`, "success")
    }
    catch(err){
      showToast(`There was a problem while rejecting an order. ${err}`, "error")
    }
      setIsEditing(false);

  }

  const handleMarkAsDelivered = async (orderId: string) => {
    try{
      setIsEditing(true);

      const tables = await deliverActiveOrder(orderId);
      setActiveOrdersTables(tables);
      showToast(`Order ${orderId} has succefuly been marked as DELIVERED.`, "success")
    }
    catch(err){
      showToast(`There was a problem while marking an order as delivered. ${err}`, "error")
    }
      setIsEditing(false);

  }

  const handleMarkAsPaid = async (orderId: string) => {
        try{
      setIsEditing(true);

      const tables = await markOrderAsPaid(orderId);
      setActiveOrdersTables(tables);
      showToast(`Order ${orderId} has succefuly been marked as PAID.`, "success")
    }
    catch(err){
      showToast(`There was a problem while marking an order as paid. ${err}`, "error")
    }
    setIsEditing(false);

  }

  // Get statistics
  const totalActiveOrders = activeOrdersTables.reduce((total, table) => total + table.activeOrders.length, 0)

  return (
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-sm text-gray-600 mt-1">Monitor and manage restaurant orders in real-time</p>
              </div>

              {/* Statistics */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="text-center pr-2 sm:pr-4">
                  {isConnected ? <div className="w-3 h-3 bg-green-500 rounded-full"></div>:<div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-orange-600">{pendingOrders.length}</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">{totalActiveOrders}</div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-green-600">{formatPrice(activeOrdersTables.reduce(
    (total, table) => total + table.activeOrders.reduce((tableTotal, order) => tableTotal + order.totalPrice, 0),
    0,
  ))}</div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Content */}
          {/* Mobile and Tablet: Tabbed Interface */}
          <div className="flex-1 lg:hidden">
            <Tabs defaultValue="pending" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
                <TabsTrigger value="pending" className="flex items-center space-x-1 sm:space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Pending ({pendingOrders.length})</span>
                </TabsTrigger>
                <TabsTrigger value="active" className="flex items-center space-x-1 sm:space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Active ({totalActiveOrders})</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Pending Orders Tab */}
              <TabsContent value="pending" className="flex-1 m-0">
                <div className="h-full bg-white flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                        Pending Orders
                      </h2>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {pendingOrders.length}
                      </Badge>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                      {pendingOrders.length === 0 ? (
                        <div className="text-center py-8">
                          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No pending orders</h3>
                          <p className="mt-1 text-sm text-gray-500">New orders will appear here.</p>
                        </div>
                      ) : (
                        pendingOrders.map((order) => (
                          <PendingOrderCard
                            isEditing={isEditing}
                            key={order.id}
                            tableName={activeOrdersTables.find(t => t.uid === order.tableId)?.name || ""}
                            order={order}
                            onAccept={() => handleAcceptOrder(order.id)}
                            onReject={() => handleRejectOrder(order.id)}
                            formatPrice={formatPrice}
                            formatTime={formatTime}
                          />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* Active Orders Tab */}
              <TabsContent value="active" className="flex-1 m-0">
                <div className="h-full bg-gray-50 flex flex-col">
                  <div className="p-4 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                        Active Orders by Table
                      </h2>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {totalActiveOrders}
                      </Badge>
                    </div>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      <DataStatusView 
                        isLoading={false} 
                        hasData={activeOrdersTables.length > 0}
                        loadingTitle="Loading active orders..."
                        loadingMessage="Please wait while we fetch your active orders."
                        errorTitle="No active orders"
                        errorMessage="No orders are currently being prepared or delivered."
                        errorIcon={CheckCircle}
                      />
                      
                      {activeOrdersTables.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeOrdersTables.map((table) => (
                            table.activeOrders.length > 0 && <TableOrdersSection
                              isEditing={isEditing}
                              key={table.uid}
                              table={table}
                              onMarkAsDelivered={handleMarkAsDelivered}
                              onMarkAsPaid={handleMarkAsPaid}
                              formatPrice={formatPrice}
                              formatTime={formatTime}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop: Side-by-side Layout */}
          <div className="hidden lg:flex flex-1 pl-4 overflow-hidden">
            <div className="w-1/4 border-r border-gray-200 bg-white flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                    Pending Orders
                  </h2>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {pendingOrders.length}
                  </Badge>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {pendingOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No pending orders</h3>
                      <p className="mt-1 text-sm text-gray-500">New orders will appear here.</p>
                    </div>
                  ) : (
                    pendingOrders.map((order) => (
                      <PendingOrderCard
                        isEditing={isEditing}
                        key={order.id}
                        tableName={activeOrdersTables.find(t => t.uid === order.tableId)?.name || ""}
                        order={order}
                        onAccept={() => handleAcceptOrder(order.id)}
                        onReject={() => handleRejectOrder(order.id)}
                        formatPrice={formatPrice}
                        formatTime={formatTime}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Active Orders - 3/4 of screen on desktop */}
            <div className="w-3/4 bg-gray-50 flex flex-col">
              <div className="p-4 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                    Active Orders by Table
                  </h2>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {totalActiveOrders}
                  </Badge>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4">
                  <DataStatusView 
                    isLoading={false} 
                    hasData={activeOrdersTables.length > 0}
                    loadingTitle="Loading active orders..."
                    loadingMessage="Please wait while we fetch your active orders."
                    errorTitle="No active orders"
                    errorMessage="No orders are currently being prepared or delivered."
                    errorIcon={CheckCircle}
                  />
                  
                  {activeOrdersTables.length > 0 && (
                    <div className="grid xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                      {activeOrdersTables.map((table) => (
                        table.activeOrders.length > 0 && <TableOrdersSection
                          isEditing={isEditing}
                          key={table.uid}
                          table={table}
                          onMarkAsDelivered={handleMarkAsDelivered}
                          onMarkAsPaid={handleMarkAsPaid}
                          formatPrice={formatPrice}
                          formatTime={formatTime}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </main>
      </div>
  )
}
