"use client"

import { memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Building2 } from "lucide-react"
import { CompanyParameters } from "@/lib/res/CompanyParameters"

interface CompanyInfoCardProps {
  paymentData: CompanyParameters
  showSensitiveData: boolean
  maskSensitiveData: (data: string) => string
}

const CompanyInfoCardComponent = ({ paymentData, showSensitiveData, maskSensitiveData }: CompanyInfoCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Information
        </CardTitle>
        <CardDescription>Basic company details and identification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-gray-600">
              Company Name
            </Label>
            <p className="text-sm font-medium bg-gray-50 p-2 rounded border">{paymentData.name}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="oib" className="text-gray-600">
              OIB (Tax Number)
            </Label>
            <p className="text-sm font-medium bg-gray-50 p-2 rounded border">
              {showSensitiveData ? paymentData.oib : maskSensitiveData(paymentData.oib)}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600">Company ID</Label>
          <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border font-mono">{paymentData.id}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export const CompanyInfoCard = memo(CompanyInfoCardComponent); 