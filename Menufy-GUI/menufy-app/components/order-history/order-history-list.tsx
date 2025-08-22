"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { History } from "lucide-react"
import { OrderHistoryCard } from "./order-history-card"
import { Table } from "@/lib/models/Table"
import { Order } from "@/lib/models/Orders"
import { DataStatusView } from "@/components/ui/data-status-view"

interface OrderHistoryListProps {
  orders: Order[]
  filteredOrders: Order[]
  tables: Table[]
  isLoading: boolean
  onOrderClick: (order: Order) => void
}

export function OrderHistoryList({
  orders,
  filteredOrders,
  tables,
  isLoading,
  onOrderClick
}: OrderHistoryListProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <DataStatusView 
            isLoading={isLoading} 
            hasData={orders.length > 0}
            loadingTitle="Loading orders..."
            loadingMessage="Please wait while we fetch your order history."
            errorTitle="No orders found"
            errorMessage="Try adjusting your filters or check back later for new orders."
            errorIcon={History}
          />
          
          {!isLoading && orders.length > 0 && (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderHistoryCard
                  key={order.id}
                  table={tables.find((table) => table.uid == order.tableId) || { uid: "", scanCount: 0 }}
                  order={order}
                  onClick={() => onOrderClick(order)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
} 