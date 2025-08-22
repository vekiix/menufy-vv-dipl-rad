"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChefHat, Minus } from "lucide-react"
import { MenuCategory } from "@/lib/models/MenuCategory"

interface MenuCategoryTableProps {
  categories: MenuCategory[]
  selectedCategories: string[]
  onSelectedCategoriesChange: (selected: string[]) => void
  onRemoveFromMenu: (categoryId: string) => void
}

export function MenuCategoryTable({
  categories,
  selectedCategories,
  onSelectedCategoriesChange,
  onRemoveFromMenu,
}: MenuCategoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(categories.length / itemsPerPage)

  const paginatedCategories = categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedCategoriesChange(paginatedCategories.map((category) => category.id))
    } else {
      onSelectedCategoriesChange([])
    }
  }

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    if (checked) {
      onSelectedCategoriesChange([...selectedCategories, categoryId])
    } else {
      onSelectedCategoriesChange(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const isAllSelected =
    paginatedCategories.length > 0 && paginatedCategories.every((category) => selectedCategories.includes(category.id))

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No categories in menu</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding categories to your menu.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Batch Actions */}
      {selectedCategories.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-900">{selectedCategories.length} category(ies) selected</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              Remove from Menu
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
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all categories"
                />
              </TableHead>
              <TableHead className="min-w-[200px]">Category</TableHead>
              <TableHead className="w-24 text-center">Items</TableHead>
              <TableHead className="w-32 text-center">Status</TableHead>
              <TableHead className="w-16 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow key={category.id} className="hover:bg-gray-50">
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleSelectCategory(category.id, checked as boolean)}
                    aria-label={`Select ${category.name}`}
                  />
                </TableCell>
                <TableCell className="min-w-[200px]">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={category.name} />
                      <AvatarFallback>
                        <ChefHat className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">{category.name}</div>
                      <div className="text-sm text-gray-500 font-mono truncate">{category.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="font-mono">
                    {category.items.length}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    In Menu
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveFromMenu(category.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {paginatedCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleSelectCategory(category.id, checked as boolean)}
                  aria-label={`Select ${category.name}`}
                />
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt={category.name} />
                  <AvatarFallback>
                    <ChefHat className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{category.name}</div>
                  <div className="text-sm text-gray-500 truncate font-mono">{category.id}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {category.items.length} items
                    </Badge>
                    <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                      In Menu
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveFromMenu(category.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, categories.length)}{" "}
            of {categories.length} results
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
