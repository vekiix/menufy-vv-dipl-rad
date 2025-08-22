"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Eye, EyeOff } from "lucide-react"

interface PaymentHeaderProps {
  isEditing: boolean
  isSaving: boolean
  showSensitiveData: boolean
  onToggleSensitiveData: () => void
  onEdit: () => void
  onCancel: () => void
}

const PaymentHeaderComponent = ({
  isEditing,
  isSaving,
  showSensitiveData,
  onToggleSensitiveData,
  onEdit,
  onCancel,
}: PaymentHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Information</h1>
          <p className="text-gray-600 mt-1">Manage your payment gateway settings and configurations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleSensitiveData}
            className="flex items-center gap-2"
          >
            {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showSensitiveData ? "Hide" : "Show"} Sensitive Data
          </Button>
          {!isEditing ? (
            <Button onClick={onEdit} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Settings
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel} disabled={isSaving}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const PaymentHeader = memo(PaymentHeaderComponent); 