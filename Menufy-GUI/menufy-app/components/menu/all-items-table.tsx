"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Edit, Eye, Trash2, UtensilsCrossed } from "lucide-react"
import { MenuItem } from "@/lib/models/MenuItem"
import { MenuCategory } from "@/lib/models/MenuCategory"

interface AllItemsTableProps {
  items: MenuItem[]
  selectedItems: string[]
  onSelectedItemsChange: (selected: string[]) => void
  onEditItem: (item: MenuItem) => void
  onViewItem: (item: MenuItem) => void
  onDeleteItem: (itemId: string) => void
  allCategories: MenuCategory[]
}

export function AllItemsTable({
  items,
  selectedItems,
  onSelectedItemsChange,
  onEditItem,
  onViewItem,
  onDeleteItem,
  allCategories,
}: AllItemsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(items.length / itemsPerPage)

  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedItemsChange(paginatedItems.map((item) => item.id))
    } else {
      onSelectedItemsChange([])
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      onSelectedItemsChange([...selectedItems, itemId])
    } else {
      onSelectedItemsChange(selectedItems.filter((id) => id !== itemId))
    }
  }

  const isAllSelected = paginatedItems.length > 0 && paginatedItems.every((item) => selectedItems.includes(item.id))

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const getItemCategories = (itemId: string) => {
    return allCategories?.filter((category) => category.items.some((item) => item.id === itemId)) ?? []
  }

  return (
    <div className="space-y-4">
      {/* Batch Actions */}
      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-900">{selectedItems.length} item(s) selected</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Bulk Edit
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
              <TableHead className="w-12 text-center">
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label="Select all items" />
              </TableHead>
              <TableHead className="min-w-[250px]">Item</TableHead>
              <TableHead className="w-24 text-center">Portion</TableHead>
              <TableHead className="w-24 text-right">Price</TableHead>
              <TableHead className="w-48">Categories</TableHead>
              <TableHead className="w-16 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item) => {
              const itemCategories = getItemCategories(item.id)
              return (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      aria-label={`Select ${item.name}`}
                    />
                  </TableCell>
                  <TableCell className="min-w-[250px]">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={item.name} />
                        <AvatarFallback>
                          <UtensilsCrossed className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate">{item.name}</div>
                        <div className="text-sm text-gray-500 truncate">{item.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {item.portion}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-green-600">{formatPrice(item.price)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {itemCategories.length > 0 ? (
                        itemCategories.map((category) => (
                          <Badge key={category.id} variant="secondary" className="text-xs truncate">
                            {category.name}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          No categories
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewItem(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditItem(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteItem(item.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {paginatedItems.map((item) => {
          const itemCategories = getItemCategories(item.id)
          return (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    aria-label={`Select ${item.name}`}
                  />
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={item.name} />
                    <AvatarFallback>
                      <UtensilsCrossed className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{item.name}</div>
                    <div className="text-sm text-gray-500 truncate">{item.description}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {item.portion}
                      </Badge>
                      <span className="text-sm font-semibold text-green-600">{formatPrice(item.price)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {itemCategories.length > 0 ? (
                        itemCategories.map((category) => (
                          <Badge key={category.id} variant="secondary" className="text-xs">
                            {category.name}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          No categories
                        </Badge>
                      )}
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
                    <DropdownMenuItem onClick={() => onViewItem(item)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditItem(item)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteItem(item.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, items.length)} of{" "}
            {items.length} results
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
