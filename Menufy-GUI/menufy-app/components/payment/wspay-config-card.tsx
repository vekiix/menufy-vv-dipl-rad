"use client"

import { memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Save, RefreshCw, CheckCircle } from "lucide-react"
import { WsPayParameters, WsPayParametersReq } from "@/lib/res/CompanyParameters"
import React from "react"

interface WSPayConfigCardProps {
  wsPayParameters: WsPayParameters
  isEditing: boolean
  isSaving: boolean
  showSensitiveData: boolean
  maskSensitiveData: (data: string) => string
  handleSaveWSPay: (params: WsPayParametersReq) => void
  handleValidateWSPay: () => void
  getStatusBadge: (valid: boolean, label: string) => React.ReactElement
}

const WSPayConfigCardComponent = ({
  wsPayParameters,
  isEditing,
  isSaving,
  showSensitiveData,
  maskSensitiveData,
  handleSaveWSPay,
  handleValidateWSPay,
  getStatusBadge,
}: WSPayConfigCardProps) => {
  // Local refs for uncontrolled inputs
  const shopIdRef = React.useRef<HTMLInputElement>(null);
  const versionRef = React.useRef<HTMLInputElement>(null);

  const onSave = () => {
    const params: WsPayParametersReq = {
      shopId: shopIdRef.current?.value || "",
      version: versionRef.current?.value || "",
    };
    handleSaveWSPay(params);
  };

  const onValidate = () => {
    handleValidateWSPay();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              WSPay Configuration
              {getStatusBadge(wsPayParameters.valid, "WSPay")}
            </CardTitle>
          </div>
          {isEditing && (
            <div className="flex items-center gap-2">
              <Button onClick={onSave} disabled={isSaving} className="flex items-center gap-2">
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? "Saving..." : "Save WSPay"}
              </Button>
               {!wsPayParameters.valid && !isSaving && <Button onClick={onValidate} disabled={isSaving} className="flex items-center gap-2">
                  {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  {isSaving ? "Saving..." : "Validate"}
                </Button>}
            </div>
          )}
        </div>
        <CardDescription>WSPay payment gateway settings and parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wsShopId" className="text-gray-600">
              Shop ID
            </Label>
            {isEditing ? (
              <Input
                id="wsShopId"
                defaultValue={wsPayParameters.shopID || ""}
                ref={shopIdRef}
                placeholder="Enter Shop ID"
              />
            ) : (
              <p className="text-sm font-medium bg-gray-50 p-2 rounded border">
                {showSensitiveData
                  ? wsPayParameters.shopID
                  : maskSensitiveData(wsPayParameters.shopID)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="wsVersion" className="text-gray-600">
              Version
            </Label>
            {isEditing ? (
              <Input
                id="wsVersion"
                defaultValue={wsPayParameters.version || ""}
                ref={versionRef}
                placeholder="Enter version"
              />
            ) : (
              <p className="text-sm font-medium bg-gray-50 p-2 rounded border">
                {showSensitiveData
                  ? wsPayParameters.version
                  : maskSensitiveData(wsPayParameters.version)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const WSPayConfigCard = memo(WSPayConfigCardComponent); 