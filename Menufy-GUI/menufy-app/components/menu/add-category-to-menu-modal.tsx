"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, ChefHat } from "lucide-react"
import { MenuCategory } from "@/lib/models/MenuCategory"

interface AddCategoryToMenuModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (categoryIds: string[]) => void
  availableCategories: MenuCategory[]
  currentMenuCategoryIds: string[]
}

export function AddCategoryToMenuModal({
  isOpen,
  onClose,
  onSave,
  availableCategories,
  currentMenuCategoryIds,
}: AddCategoryToMenuModalProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Filter out categories already in menu
  const availableToAdd = availableCategories?.filter((cat) => !currentMenuCategoryIds.includes(cat.id)) ?? []

  const filteredCategories = availableToAdd?.filter((category) =>
    category?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  ) ?? []

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId])
    } else {
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== categoryId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategoryIds(filteredCategories.map((cat) => cat.id))
    } else {
      setSelectedCategoryIds([])
    }
  }

  const handleSave = () => {
    onSave(selectedCategoryIds)
    setSelectedCategoryIds([])
    setSearchTerm("")
  }

  const handleClose = () => {
    setSelectedCategoryIds([])
    setSearchTerm("")
    onClose()
  }

  const isAllSelected =
    filteredCategories.length > 0 && filteredCategories.every((cat) => selectedCategoryIds.includes(cat.id))

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <DialogTitle className="text-lg font-semibold">Add Categories to Menu</DialogTitle>
            <p className="text-sm text-gray-500">Select categories to add to your menu</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Select All */}
        {filteredCategories.length > 0 && (
          <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label="Select all categories" />
            <span className="text-sm font-medium">Select all ({filteredCategories.length} categories)</span>
          </div>
        )}

        {/* Categories List */}
        <div className="flex-1 overflow-auto space-y-2 mb-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories available</h3>
              <p className="mt-1 text-sm text-gray-500">
                {availableToAdd.length === 0
                  ? "All categories are already in the menu."
                  : "No categories match your search."}
              </p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  checked={selectedCategoryIds.includes(category.id)}
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
                  <div className="font-medium text-gray-900">{category.name}</div>
                  <div className="text-sm text-gray-500 font-mono">{category.id}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {category.items.length} items
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={selectedCategoryIds.length === 0}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            Add {selectedCategoryIds.length} Categories
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
