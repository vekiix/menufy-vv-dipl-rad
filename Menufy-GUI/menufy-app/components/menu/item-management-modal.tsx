"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { MenuCategory } from "@/lib/models/MenuCategory"
import { MenuItem } from "@/lib/models/MenuItem"
import { ItemTable } from "./item-table"
import { ItemFormModal } from "./item-form-modal"

interface ItemManagementModalProps {
  isOpen: boolean
  onClose: () => void
  category: MenuCategory
  onUpdateItems: (items: MenuItem[]) => void
}

export function ItemManagementModal({ isOpen, onClose, category, onUpdateItems }: ItemManagementModalProps) {
  const [items, setItems] = useState<MenuItem[]>(category.items)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [viewingItem, setViewingItem] = useState<MenuItem | null>(null)

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddItem = () => {
    setEditingItem(null)
    setViewingItem(null)
    setIsItemModalOpen(true)
  }

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item)
    setViewingItem(null)
    setIsItemModalOpen(true)
  }

  const handleViewItem = (item: MenuItem) => {
    setViewingItem(item)
    setEditingItem(null)
    setIsItemModalOpen(true)
  }

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter((item) => item.id !== itemId)
    setItems(updatedItems)
    onUpdateItems(updatedItems)
    setSelectedItems(selectedItems.filter((id) => id !== itemId))
  }

  const handleSaveItem = (itemData: Partial<MenuItem>) => {
    if (editingItem) {
      // Update existing item
      const updatedItems = items.map((item) => (item.id === editingItem.id ? { ...item, ...itemData } : item))
      setItems(updatedItems)
      onUpdateItems(updatedItems)
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: `item_${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`,
        companyId: "79238a44-cdd2-4872-bbd9-3421e155ea4e",
        name: itemData.name || "",
        description: itemData.description || "",
        portion: itemData.portion || "",
        price: itemData.price || 0,
        image: itemData.image || "",
      }
      const updatedItems = [...items, newItem]
      setItems(updatedItems)
      onUpdateItems(updatedItems)
    }
    setIsItemModalOpen(false)
    setEditingItem(null)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <DialogTitle className="text-lg font-semibold">Manage Items - {category.name}</DialogTitle>
              <p className="text-sm text-gray-500">{items.length} items in this category</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Items Table */}
          <div className="flex-1 overflow-auto">
            <ItemTable
              items={filteredItems}
              selectedItems={selectedItems}
              onSelectedItemsChange={setSelectedItems}
              onEditItem={handleEditItem}
              onViewItem={handleViewItem}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Form Modal */}
      <ItemFormModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false)
          setEditingItem(null)
          setViewingItem(null)
        }}
        onSave={handleSaveItem}
        item={editingItem}
        viewOnly={!!viewingItem}
        initialData={viewingItem || editingItem}
      />
    </>
  )
}
