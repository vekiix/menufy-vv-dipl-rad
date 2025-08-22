"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { X, Building2 } from "lucide-react"
import { Textarea } from "../ui/textarea"
import { Company } from "@/lib/models/Company"

interface CompanyFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (companyData: Partial<Company>) => void
  company?: Company | null
  viewOnly?: boolean
  initialData?: Company | null
}

// Consistent date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${year}-${month}-${day} ${hours}:${minutes}`
}


export function CompanyFormModal({
  isOpen,
  onClose,
  onSave,
  company,
  viewOnly = false,
  initialData,
}: CompanyFormModalProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    oib: "",
    encryptionKey: "",
    logo: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName,
        oib: initialData.oib,
        encryptionKey: initialData.encryptionKey,
        logo: initialData.logo,
      })
    } else {
      setFormData({
        companyName: "",
        oib: "",
        encryptionKey: "",
        logo: "",
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!viewOnly) {
      onSave(formData)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isEditing = !!company
  const title = viewOnly ? "View Company" : isEditing ? "Edit Company" : "Add New Company"

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
          {/* Company Logo Section (View Only) */}
          {viewOnly && initialData && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt={initialData.companyName} />
                <AvatarFallback className="text-lg">
                  <Building2 className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{initialData.companyName}</h3>
                <p className="text-sm text-gray-500">OIB: {(initialData.oib)}</p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Badge variant="secondary">ID: {initialData.id}</Badge>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          {!viewOnly && (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oib">OIB (Tax Number)</Label>
                <Input
                  id="oib"
                  value={formData.oib}
                  onChange={(e) => handleInputChange("oib", e.target.value)}
                  placeholder="Enter OIB (11 digits)"
                  maxLength={11}
                  pattern="[0-9]{11}"
                  required
                />
                <p className="text-xs text-gray-500">Format: 11 digits (e.g., 30852647712)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="encryptionKey">Encryption Key</Label>
                <Textarea
                  id="encryptionKey"
                  value={formData.encryptionKey}
                  onChange={(e: { target: { value: string } }) => handleInputChange("encryptionKey", e.target.value)}
                  placeholder="Enter encryption key"
                  className="font-mono text-sm"
                  rows={3}
                />
                <p className="text-xs text-gray-500">32-character hexadecimal string</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo Hash</Label>
                <Textarea
                  id="logo"
                  value={formData.logo}
                  onChange={(e: { target: { value: string } }) => handleInputChange("logo", e.target.value)}
                  placeholder="Enter logo hash"
                  className="font-mono text-sm"
                  rows={3}
                />
                <p className="text-xs text-gray-500">32-character hexadecimal string</p>
              </div>
            </>
          )}

          {/* View Only Information */}
          {viewOnly && initialData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">Encryption Key</Label>
                  <p className="font-mono text-xs bg-gray-50 p-2 rounded border break-all">
                    {initialData.encryptionKey}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Logo Hash</Label>
                  <p className="font-mono text-xs bg-gray-50 p-2 rounded border break-all">{initialData.logo}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Created</Label>
                    <p className="font-medium">{formatDate(initialData.createdAt)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Updated</Label>
                    <p className="font-medium">{formatDate(initialData.updatedAt)}</p>
                  </div>
                </div>
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
                {isEditing ? "Update Company" : "Add Company"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
