"use client"

import { RefreshCw, AlertTriangle, LucideIcon } from "lucide-react"

interface DataStatusViewProps {
  isLoading: boolean
  hasData: boolean
  loadingTitle?: string
  loadingMessage?: string
  errorTitle?: string
  errorMessage?: string
  errorIcon?: LucideIcon
}

export function DataStatusView({ 
  isLoading, 
  hasData, 
  loadingTitle = "Loading...", 
  loadingMessage = "Please wait while we fetch your data.",
  errorTitle = "No data available",
  errorMessage = "Unable to load data.",
  errorIcon: ErrorIcon = AlertTriangle
}: DataStatusViewProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">{loadingTitle}</h3>
        <p className="mt-2 text-sm text-gray-500">{loadingMessage}</p>
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className="text-center py-12">
        <ErrorIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">{errorTitle}</h3>
        <p className="mt-2 text-sm text-gray-500">{errorMessage}</p>
      </div>
    )
  }

  return null
} 