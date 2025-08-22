"use client"

import { memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Save, RefreshCw, CheckCircle } from "lucide-react"
import { KeksPayParameters, KeksPayParametersReq } from "@/lib/res/CompanyParameters"
import React from "react"

interface KeksPayConfigCardProps {
  keksPayParameters: KeksPayParameters
  isEditing: boolean
  isSaving: boolean
  showSensitiveData: boolean
  maskSensitiveData: (data: string) => string
  handleSaveKeksPay: (params: KeksPayParametersReq) => void
  handleValidateKeksPay: () => void
  getStatusBadge: (valid: boolean, label: string) => React.ReactElement
}

const KeksPayConfigCardComponent = ({
  keksPayParameters,
  isEditing,
  isSaving,
  showSensitiveData,
  maskSensitiveData,
  handleSaveKeksPay,
  handleValidateKeksPay,
  getStatusBadge,
}: KeksPayConfigCardProps) => {
  // Local refs for uncontrolled inputs
  const qrTypeRef = React.useRef<HTMLInputElement>(null);
  const cidRef = React.useRef<HTMLInputElement>(null);
  const tidRef = React.useRef<HTMLInputElement>(null);

    const onSave = () => {
      const params: KeksPayParametersReq = {
        qr_type: qrTypeRef.current ? Number.parseInt(qrTypeRef.current.value) : 0,
        cid: cidRef.current?.value || "",
        tid: tidRef.current?.value || "",
      };
      handleSaveKeksPay(params);
    };

  const onValidate = () => {
    handleValidateKeksPay();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              KeksPay Configuration
              {getStatusBadge(keksPayParameters.valid, "KEKS pay")}
            </CardTitle>
          </div>
          {isEditing && (
            <div className="flex items-center gap-2">
            <Button onClick={onSave} disabled={isSaving} className="flex items-center gap-2">
              {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Saving..." : "Save KeksPay"}
            </Button>
            {!keksPayParameters.valid && (
            <Button onClick={onValidate} disabled={isSaving} className="flex items-center gap-2">
            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Validate"}
            </Button>
            )}
            </div>
          )}
        </div>
        <CardDescription>KeksPay payment gateway settings and parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="qrType" className="text-gray-600">
              QR Type
            </Label>
            {isEditing ? (
              <Input
                id="qrType"
                type="number"
                defaultValue={keksPayParameters.qr_type || 0}
                ref={qrTypeRef}
                placeholder="Enter QR type"
              />
            ) : (
              <p className="text-sm font-medium bg-gray-50 p-2 rounded border">
                {keksPayParameters.qr_type}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="keksCid" className="text-gray-600">
              Customer ID (CID)
            </Label>
            {isEditing ? (
              <Input
                id="keksCid"
                defaultValue={keksPayParameters.cid || ""}
                ref={cidRef}
                placeholder="Enter CID"
              />
            ) : (
              <p className="text-sm font-medium bg-gray-50 p-2 rounded border">
                {showSensitiveData
                  ? keksPayParameters.cid
                  : maskSensitiveData(keksPayParameters.cid)}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="keksTid" className="text-gray-600">
              Terminal ID (TID)
            </Label>
            {isEditing ? (
              <Input
                id="keksTid"
                defaultValue={keksPayParameters.tid || ""}
                ref={tidRef}
                placeholder="Enter TID"
              />
            ) : (
              <p className="text-sm font-medium bg-gray-50 p-2 rounded border">
                {showSensitiveData
                  ? keksPayParameters.tid
                  : maskSensitiveData(keksPayParameters.tid)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const KeksPayConfigCard = memo(KeksPayConfigCardComponent); 