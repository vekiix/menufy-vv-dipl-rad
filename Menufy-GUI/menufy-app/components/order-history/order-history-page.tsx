"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { FilterOrderRequest } from "@/lib/req/FilterOrdersRequest"
import { getOrdersFiltered } from "@/lib/services/order-service"
import { useToast } from "../providers/toast-provider"
import { getAllTables } from "@/lib/services/auth-service"
import { Table } from "@/lib/models/Table"
import { OrderHistoryHeader } from "./order-history-header"
import { FilterState, OrderHistoryFilters } from "./order-history-filters"
import { OrderHistoryList } from "./order-history-list"
import { Order } from "@/lib/models/Orders"
import { OrderDetailsModal } from "../order/order-details-modal"

export function OrderHistoryPage() {
  const [tables, setTables] = useState<Table[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)


  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    tableId: [],
    status: [],
  })

  const { showToast } = useToast()

  const filteredOrders = useMemo(() => 
    orders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.tableId && order.tableId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.transactionToken && order.transactionToken.toLowerCase().includes(searchTerm.toLowerCase())))
    ), [orders, searchTerm]
  )

  const fetchAllTables = useCallback(async () => {
    try {
      const tables = await getAllTables()
      setTables(tables)
    } catch (error) {
      showToast(`There was a problem while fetching tables. ${error}`, "error")
    }
  }, [showToast])

  const handleApplyFilters = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = {} as Record<string, string>
      const reqBody: FilterOrderRequest = {
        orderId: "",
        tableId: "",
        status: "",
      }

      if (filters.tableId) {
        reqBody.tableId = filters.tableId.join(';')
      }

      if (filters.status) {
        reqBody.status = filters.status.join(';')
      }

      const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, "0")
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const year = date.getFullYear()
        return `${day}.${month}.${year}`
      }

      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        params.from = formatDate(fromDate)
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999) // Include full day
        params.to = formatDate(toDate)
      }

      try {
        const filteredOrders = await getOrdersFiltered(params, reqBody)
        setOrders(filteredOrders)
      } catch (err) {
        showToast(`There was a problem while filtering orders. ${err}`, "error")
      }
    } catch (error) {
      showToast(`There was a problem while filtering orders. ${error}`, "error")
    } finally {
      setIsLoading(false)
    }
  }, [filters, showToast])

  useEffect(() => {
    handleApplyFilters()
    fetchAllTables()
  }, [])


  // Filter and search functions
  const handleFilterChange = useCallback((key: keyof FilterState, value: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])


  const handleClearFilters = useCallback(() => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      tableId: [],
      status: [],
    })
  }, [])

  const handleOrderClick = useCallback((order: Order) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
  }, [])

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <OrderHistoryHeader
          orders={orders}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={useCallback(() => setShowFilters(!showFilters), [showFilters])}
          isLoading={isLoading}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Filters Section */}
        {showFilters && (
          <OrderHistoryFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            tables={tables}
          />
        )}

        {/* Orders List */}
        <OrderHistoryList
          orders={orders}
          filteredOrders={filteredOrders}
          tables={tables}
          isLoading={isLoading}
          onOrderClick={handleOrderClick}
        />
      </main>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isOrderDetailsOpen}
        onClose={useCallback(() => {
          setIsOrderDetailsOpen(false)
          setSelectedOrder(null)
        }, [])}
        order={selectedOrder}
      />
    </div>
  )
}
