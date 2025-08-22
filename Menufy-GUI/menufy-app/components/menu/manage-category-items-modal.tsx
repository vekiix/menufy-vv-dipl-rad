"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, UtensilsCrossed, Plus } from "lucide-react"
import { MenuCategory } from "@/lib/models/MenuCategory"
import { MenuItem } from "@/lib/models/MenuItem"
import { useToast } from "../providers/toast-provider"
import { addMenuItemToCategory, removeItemFromCategory } from "@/lib/services/menu-service"

interface ManageCategoryItemsModalProps {
  isOpen: boolean
  onClose: () => void
  category: MenuCategory
  availableItems: MenuItem[]
  onUpdateItems: (category: MenuCategory) => void
}

export function ManageCategoryItemsModal({
  isOpen,
  onClose,
  category,
  availableItems,
  onUpdateItems,
}: ManageCategoryItemsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(category.items.map((item) => item.id))
  const [searchTerm, setSearchTerm] = useState("")

  const { showToast } = useToast()
  const filteredItems = availableItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const handleSelectItem = async (itemId: string, checked: boolean) => {
  if (isUpdating) return; // Prevent double clicks

  setIsUpdating(true);
  try {
    // Always use the latest version of the category for each request
    const updatedCategory: MenuCategory = checked
      ? await addMenuItemToCategory(itemId, category.id)
      : await removeItemFromCategory(itemId, category.id);

    // Update selectedItemIds based on latest category state
    const newSelectedItemIds = updatedCategory.items.map((item) => item.id);
    setSelectedItemIds(newSelectedItemIds);

    // Propagate updated category to parent
    onUpdateItems(updatedCategory);

    // Show toast
    const action = checked ? "added to" : "removed from";
    showToast(`Menu item has successfully been ${action} category`, "success");
  } catch (error) {
    console.error(error);
    showToast(`There was an error while modifying item in category. ${error}`, "error");
  } finally {
    setIsUpdating(false);
  }
};

  const handleClose = () => {
    setSelectedItemIds(category.items.map((item) => item.id)) // Reset to original
    setSearchTerm("")
   
    onClose()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <DialogTitle className="text-lg font-semibold">Manage items in category - {category.name}</DialogTitle>
            <p className="text-sm text-gray-500">Select items to include in this category</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-auto space-y-2 mb-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {availableItems.length === 0
                  ? "No items available. Create some items first."
                  : "No items match your search."}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  disabled={true}
                  checked={selectedItemIds.includes(item.id)}
                />
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt={item.name} />
                  <AvatarFallback>
                    <UtensilsCrossed className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-wrap text-sm text-gray-500 truncate">{item.description}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.portion}
                    </Badge>
                    <span className="text-sm font-semibold text-green-600">{formatPrice(item.price)}</span>
                  </div>
                </div>
                <div className="flex items-end">
                <Button disabled={isUpdating} onClick={() => handleSelectItem(item.id, !selectedItemIds.includes(item.id))} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                    {selectedItemIds.includes(item.id)? `Remove item`: `Add item`}  
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
