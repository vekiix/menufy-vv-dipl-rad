"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UtensilsCrossed } from "lucide-react"
import { MenuItem } from "@/lib/models/MenuItem"

interface ItemFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (itemData: Partial<MenuItem>) => void
  item?: MenuItem | null
  viewOnly?: boolean
  initialData?: MenuItem | null
}

export function ItemFormModal({ isOpen, onClose, onSave, item, viewOnly = false, initialData }: ItemFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    portion: "",
    price: 0,
    image: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        portion: initialData.portion,
        price: initialData.price,
        image: initialData.image,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        portion: "",
        price: 0,
        image: "",
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!viewOnly) {
      onSave(formData)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const isEditing = !!item
  const title = viewOnly ? "View Item" : isEditing ? "Edit Item" : "Add New Item"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between sm:hidden mb-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </div>

        {/* Desktop Header */}
        <DialogHeader className="hidden sm:block">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Icon Section (View Only) */}
          {viewOnly && initialData && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt={initialData.name} />
                <AvatarFallback className="text-lg">
                  <UtensilsCrossed className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{initialData.name}</h3>
                <p className="text-sm text-gray-500">{initialData.portion}</p>
                <p className="text-lg font-bold text-green-600 mt-1">{formatPrice(initialData.price)}</p>
              </div>
            </div>
          )}

          {/* Form Fields */}
          {!viewOnly && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter item description"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portion">Portion Size</Label>
                <Input
                  id="portion"
                  value={formData.portion}
                  onChange={(e) => handleInputChange("portion", e.target.value)}
                  placeholder="e.g., 38cm, large, 0.5l"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (EUR)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Item Image</Label>
                <Textarea
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="Enter base64 image data"
                  className="font-mono text-sm"
                  rows={3}
                />
                <p className="text-xs text-gray-500">Base64 encoded image data</p>
              </div>
            </>
          )}

          {/* View Only Information */}
          {viewOnly && initialData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">Item ID</Label>
                  <p className="font-mono text-sm bg-gray-50 p-2 rounded border break-all">{initialData.id}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Company ID</Label>
                  <p className="font-mono text-sm bg-gray-50 p-2 rounded border break-all">{initialData.companyId}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Description</Label>
                  <p className="text-sm">{initialData.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Portion</Label>
                    <p className="font-medium">{initialData.portion}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Price</Label>
                    <p className="font-medium text-green-600">{formatPrice(initialData.price)}</p>
                  </div>
                </div>
                {initialData.image && (
                  <div>
                    <Label className="text-gray-500">Image Data</Label>
                    <p className="font-mono text-xs bg-gray-50 p-2 rounded border break-all">{initialData.image}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              {viewOnly ? "Close" : "Cancel"}
            </Button>
            {!viewOnly && (
              <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                {isEditing ? "Update Item" : "Add Item"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
