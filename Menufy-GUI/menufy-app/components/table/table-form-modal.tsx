"use client"

import type React from "react"
import { X } from "lucide-react" // Import the X component

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Utensils } from "lucide-react"
import { Table } from "@/lib/models/Table"

interface TableFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (tableData: Partial<Table>) => void
  table?: Table | null
  viewOnly?: boolean
  initialData?: Table | null
  isLoading?: boolean
}

export function TableFormModal({ isOpen, onClose, onSave, table, viewOnly = false, initialData, isLoading = false }: TableFormModalProps) {
  const [formData, setFormData] = useState({
    tableName: "",
    uid: ""
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        tableName: initialData.tableName || "",
        uid: initialData.uid || ""
      })
    } else {
      setFormData({
        tableName: "",
        uid: ""
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

  const isEditing = !!table
  const title = viewOnly ? "View Table" : isEditing ? "Edit Table" : "Add New Table"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between sm:hidden mb-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop Header */}
        <DialogHeader className="hidden sm:block">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Table Icon Section (View Only) */}
          {viewOnly && initialData && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt={initialData.uid} />
                <AvatarFallback className="text-lg">
                  <Utensils className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-semibold font-mono">{initialData.uid}</h3>
                <p className="text-sm text-gray-500">{initialData.tableName || "No name assigned"}</p>
              </div>
            </div>
          )}

          {/* Form Fields */}
          {!viewOnly && (
            <>
            <div className="space-y-2">
              <Label htmlFor="tableUid">Table UID</Label>
              <Input
                id="tableName"
                value={formData.uid}
                disabled={isEditing || isLoading}
                minLength={16}
                maxLength={16}
                onChange={(e) => handleInputChange("uid", e.target.value)}
                placeholder="Enter table UID"
              />
              <p className="text-xs text-red-500">Mandatory field</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tableName">Table Name</Label>
              <Input
                id="tableName"
                value={formData.tableName}
                disabled={isLoading}
                onChange={(e) => handleInputChange("tableName", e.target.value)}
                placeholder="Enter table name (optional)"
              />
              <p className="text-xs text-gray-500">Leave empty for no name</p>
            </div>
            </>
          )}

          {/* View Only Information */}
          {viewOnly && initialData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">Table UID</Label>
                  <p className="font-mono text-sm bg-gray-50 p-2 rounded border break-all">{initialData.uid}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Table Name</Label>
                  <p className="font-medium">{initialData.tableName || "No name assigned"}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Scan Count</Label>
                  <p className="font-medium">{initialData.scanCount}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {viewOnly ? "Close" : "Cancel"}
            </Button>
            {!viewOnly && (
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{isEditing ? "Updating..." : "Adding..."}</span>
                  </div>
                ) : (
                  <span>{isEditing ? "Update Table" : "Add Table"}</span>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
