"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ChevronDown, ChevronUp, RefreshCw, X } from "lucide-react"
import { formatPrice } from "@/lib/utils/utils"
import { Order } from "@/lib/models/Orders"

interface OrderHistoryHeaderProps {
  orders: Order[]
  searchTerm: string
  onSearchChange: (value: string) => void
  showFilters: boolean
  onToggleFilters: () => void
  isLoading: boolean
  onApplyFilters: () => void
  onClearFilters: () => void
}

export function OrderHistoryHeader({
  orders,
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  isLoading,
  onApplyFilters,
  onClearFilters
}: OrderHistoryHeaderProps) {
  const totalRevenue = orders.reduce((total, order) => total + order.totalPrice, 0)
  const averageOrder = orders.length > 0 ? totalRevenue / orders.length : 0

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            <p className="text-sm text-gray-600 mt-1">View and search through past orders</p>
          </div>

          {/* Statistics - Desktop */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
              <div className="text-xs text-gray-500">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</div>
              <div className="text-xs text-gray-500">Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{formatPrice(averageOrder)}</div>
              <div className="text-xs text-gray-500">Avg Order</div>
            </div>
          </div>
        </div>

        {/* Mobile Statistics */}
        <div className="grid grid-cols-3 gap-4 sm:hidden">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{orders.length}</div>
            <div className="text-xs text-gray-500">Orders</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{formatPrice(totalRevenue)}</div>
            <div className="text-xs text-gray-500">Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">{formatPrice(averageOrder)}</div>
            <div className="text-xs text-gray-500">Avg Order</div>
          </div>
        </div>

        {/* Filter Toggle Button - Mobile */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onToggleFilters}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </Button>
            <Button 
              onClick={onApplyFilters} 
              variant="default" 
              disabled={isLoading} 
              className="bg-blue-600 flex items-center space-x-2"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span>{isLoading ? "Searching..." : "Search"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 