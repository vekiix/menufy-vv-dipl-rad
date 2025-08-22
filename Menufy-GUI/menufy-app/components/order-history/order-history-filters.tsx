"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multiselect"
import { Table } from "@/lib/models/Table"

const statusOptions = [
  { label: "Ordered", value: "ORDERED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Paid", value: "PAID" },
  { label: "Rejected", value: "REJECTED" },
]

export interface FilterState {
  dateFrom: string
  dateTo: string
  tableId: string[]
  status: string[]
}

interface OrderHistoryFiltersProps {
  filters: FilterState
  onFilterChange: (key: keyof FilterState, value: string | string[]) => void
  tables: Table[]
}

export function OrderHistoryFilters({
  filters,
  onFilterChange,
  tables
}: OrderHistoryFiltersProps) {
  const getAllTableOptions = () => {
    return tables.map((table: Table) => ({
      label: table.tableName || "",
      value: table.uid
    }))
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Date From */}
        <div className="space-y-2">
          <Label htmlFor="dateFrom" className="text-sm font-medium text-gray-700">
            Datetime from
          </Label>
          <Input
            className="w-auto"
            id="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange("dateFrom", e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <Label htmlFor="dateTo" className="text-sm font-medium text-gray-700">
            Datetime to
          </Label>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange("dateTo", e.target.value)}
            className="w-auto"
          />
        </div>

        {/* Table ID */}
        <div className="space-y-2">
          <Label htmlFor="tableId" className="text-sm font-medium text-gray-700">
            Table ID
          </Label>
          <MultiSelect 
            id="tables"
            placeholder="Select tables..."
            selected={filters.tableId}
            options={getAllTableOptions()}
            onChange={(values) => onFilterChange("tableId", values)}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium text-gray-700">
            Status
          </Label>
          <MultiSelect 
            id="status"
            placeholder="Select status..."
            selected={filters.status}
            options={statusOptions}
            onChange={(values) => onFilterChange("status", values)}
          />
        </div>
      </div>
    </div>
  )
} 