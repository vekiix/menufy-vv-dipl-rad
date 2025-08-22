"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Edit, Eye, Trash2, Utensils } from "lucide-react"
import { Table as RestaurantTable } from "@/lib/models/Table"

interface TableTableProps {
  tables: RestaurantTable[]
  selectedTables: string[]
  onSelectedTablesChange: (selected: string[]) => void
  onEditTable: (table: RestaurantTable) => void
  onViewTable: (table: RestaurantTable) => void
  onDeleteTable: (tableUid: string) => void
  isOperationLoading?: boolean
}

export function TableTable({
  tables,
  selectedTables,
  onSelectedTablesChange,
  onEditTable,
  onViewTable,
  onDeleteTable,
  isOperationLoading = false,
}: TableTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(tables.length / itemsPerPage)

  const paginatedTables = tables.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedTablesChange(paginatedTables.map((table) => table.uid))
    } else {
      onSelectedTablesChange([])
    }
  }

  const handleSelectTable = (tableUid: string, checked: boolean) => {
    if (checked) {
      onSelectedTablesChange([...selectedTables, tableUid])
    } else {
      onSelectedTablesChange(selectedTables.filter((uid) => uid !== tableUid))
    }
  }

  const isAllSelected =
    paginatedTables.length > 0 && paginatedTables.every((table) => selectedTables.includes(table.uid))

  return (
    <div className="space-y-4">
      {/* Batch Actions */}
      {selectedTables.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-900">{selectedTables.length} table(s) selected</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={async () => {
              await Promise.all(selectedTables.map((table) => onDeleteTable(table)))
                  onSelectedTablesChange([])
              }}>
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label="Select all tables" />
              </TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Table Name</TableHead>
              <TableHead>Scans</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTables.map((table) => (
              <TableRow key={table.uid} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedTables.includes(table.uid)}
                    onCheckedChange={(checked) => handleSelectTable(table.uid, checked as boolean)}
                    aria-label={`Select ${table.uid}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={table.uid} />
                      <AvatarFallback>
                        <Utensils className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900 font-mono">{table.uid}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {table.tableName ? (
                    <span className="text-gray-900">{table.tableName}</span>
                  ) : (
                    <span className="text-gray-400 italic">No name</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono">
                    {table.scanCount}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        disabled={isOperationLoading}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => onViewTable(table)}
                        disabled={isOperationLoading}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onEditTable(table)}
                        disabled={isOperationLoading}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteTable(table.uid)} 
                        className="text-red-600"
                        disabled={isOperationLoading}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {paginatedTables.map((table) => (
          <div key={table.uid} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Checkbox
                  checked={selectedTables.includes(table.uid)}
                  onCheckedChange={(checked) => handleSelectTable(table.uid, checked as boolean)}
                  aria-label={`Select ${table.uid}`}
                />
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt={table.uid} />
                  <AvatarFallback>
                    <Utensils className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 font-mono truncate">{table.uid}</div>
                  <div className="text-sm text-gray-500 truncate">{table.tableName || "No name"}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {table.scanCount} scans
                    </Badge>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewTable(table)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditTable(table)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteTable(table.uid)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, tables.length)} of{" "}
            {tables.length} results
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
