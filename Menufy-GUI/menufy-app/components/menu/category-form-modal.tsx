"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChefHat } from "lucide-react"
import { MenuCategory } from "@/lib/models/MenuCategory"

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (categoryData: Partial<MenuCategory>) => void
  category?: MenuCategory | null
  viewOnly?: boolean
  initialData?: MenuCategory | null
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  category,
  viewOnly = false,
  initialData,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        image: initialData.image || "",
      })
    } else {
      setFormData({
        name: "",
        image: "",
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!viewOnly) {
      onSave({
        name: formData.name,
        image: formData.image || null,
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isEditing = !!category
  const title = viewOnly ? "View Category" : isEditing ? "Edit Category" : "Add New Category"

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
          {/* Category Icon Section (View Only) */}
          {viewOnly && initialData && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt={initialData.name} />
                <AvatarFallback className="text-lg">
                  <ChefHat className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{initialData.name}</h3>
                <p className="text-sm text-gray-500">{initialData.items.length} items</p>
              </div>
            </div>
          )}

          {/* Form Fields */}
          {!viewOnly && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Category Image</Label>
                <Textarea
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="Enter base64 image data (optional)"
                  className="font-mono text-sm"
                  rows={3}
                />
                <p className="text-xs text-gray-500">Base64 encoded image data or leave empty</p>
              </div>
            </>
          )}

          {/* View Only Information */}
          {viewOnly && initialData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">Category ID</Label>
                  <p className="font-mono text-sm bg-gray-50 p-2 rounded border break-all">{initialData.id}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Category Name</Label>
                  <p className="font-medium">{initialData.name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Items Count</Label>
                  <p className="font-medium">{initialData.items.length}</p>
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
                {isEditing ? "Update Category" : "Add Category"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
