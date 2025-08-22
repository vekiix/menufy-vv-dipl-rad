"use client"

import { memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

const SecurityNoticeCardComponent = () => {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Security Notice</h3>
            <p className="text-sm text-amber-700 mt-1">
              Payment gateway credentials are sensitive information. Ensure that only authorized personnel have
              access to this data. Changes to payment settings may affect transaction processing.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const SecurityNoticeCard = memo(SecurityNoticeCardComponent); 