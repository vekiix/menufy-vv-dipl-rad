"use client"

import { useState, useEffect } from "react"
import { getPaymentParameters, saveKeksPayParameters, saveWSPayParameters, validateKeksPayParameters, validateWSPayParameters } from "@/lib/services/payment-service"
import { CompanyParameters, KeksPayParametersReq, WsPayParametersReq } from "@/lib/res/CompanyParameters"
import { CheckCircle, XCircle, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PaymentHeader } from "./payment-header"
import { DataStatusView } from "@/components/ui/data-status-view"
import { CompanyInfoCard } from "./company-info-card"
import { KeksPayConfigCard } from "./kekspay-config-card"
import { WSPayConfigCard } from "./wspay-config-card"
import { SecurityNoticeCard } from "./security-notice-card"
import { useToast } from "../providers/toast-provider"



export function PaymentInfoPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  const [paymentData, setPaymentData] = useState<CompanyParameters | null>(null)


  const { showToast } = useToast()

  useEffect(() => {
    const fetchPaymentData = async () => {
      setIsLoading(true)
      try {
        const data = await getPaymentParameters()
        setPaymentData(data)
      } catch (error) {
        showToast(`Error occurred while fetching payment data. ${error}`, "error")
      }
      setIsLoading(false)
    }

    fetchPaymentData()
  }, [])

  const handleEdit = () => {
    if (paymentData) {
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    if (paymentData) {
      setIsEditing(false)
    }
  }

  const handleValidateKeksPay = async () => {
    setIsSaving(true)
    try {
      const data = await validateKeksPayParameters()
      setPaymentData(data)
    } catch (error) {
      showToast(`Error occurred while fetching payment data. ${error}`, "error")
    }
    setIsSaving(false)
  }
  const handleValidateWSPay = async () => {
    setIsSaving(true)
    try {
      const data = await validateWSPayParameters()
      setPaymentData(data)
    } catch (error) {
      showToast(`Error occurred while fetching payment data. ${error}`, "error")
    }
    setIsSaving(false)
  }

  const handleSaveKeksPay = async (params: KeksPayParametersReq) => {
    setIsSaving(true)
    try {
      const data = await saveKeksPayParameters(params)
      setPaymentData(data)
      showToast("KeksPay configuration saved successfully!", "success")
    } catch (error) {
      showToast(`Error occurred while saving KeksPay configuration. ${error}`, "error")
    }

    setIsSaving(false)
  }

  const handleSaveWSPay = async (params: WsPayParametersReq) => {
    setIsSaving(true)
    try {
      const data = await saveWSPayParameters(params)
      setPaymentData(data)
      showToast("WSPay configuration saved successfully!", "success")
    } catch (error) {
      showToast(`Error occurred while saving WSPay configuration. ${error}`, "error")
    }

    setIsSaving(false)
  }

  const maskSensitiveData = (data: string) => {
    if (showSensitiveData) return data
    return data?.replace(/./g, "•") || "••••••••"
  }

  const getStatusBadge = (valid: boolean, label: string) => (
    <Badge variant={valid ? "default" : "destructive"} className="bg-green-600 flex items-center gap-1">
      {valid ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {valid ? `${label} Valid` : `${label} Invalid`}
    </Badge>
  )



  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <PaymentHeader
          isEditing={isEditing}
          isSaving={isSaving}
          showSensitiveData={showSensitiveData}
          onToggleSensitiveData={() => setShowSensitiveData(!showSensitiveData)}
          onEdit={handleEdit}
          onCancel={handleCancel}
        />

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 max-w-6xl">
            {isLoading || !paymentData ? (
              <div className="flex items-center justify-center h-full">
                <DataStatusView 
                  isLoading={isLoading} 
                  hasData={!!paymentData}
                  loadingTitle="Loading payment information..."
                  loadingMessage="Please wait while we fetch your payment data."
                  errorTitle="No payment data available"
                  errorMessage="Unable to load payment information."
                  errorIcon={CreditCard}
                />
              </div>
            ) : (
              <>
                <CompanyInfoCard
                  paymentData={paymentData}
                  showSensitiveData={showSensitiveData}
                  maskSensitiveData={maskSensitiveData}
                />

                <KeksPayConfigCard
                  keksPayParameters={paymentData.keksPayParameters}
                  isEditing={isEditing}
                  isSaving={isSaving}
                  showSensitiveData={showSensitiveData}
                  maskSensitiveData={maskSensitiveData}
                  handleSaveKeksPay={handleSaveKeksPay}
                  handleValidateKeksPay={handleValidateKeksPay}
                  getStatusBadge={getStatusBadge}
                />

                <WSPayConfigCard
                  wsPayParameters={paymentData.wsPayParameters}
                  isEditing={isEditing}
                  isSaving={isSaving}
                  showSensitiveData={showSensitiveData}
                  maskSensitiveData={maskSensitiveData}
                  handleSaveWSPay={handleSaveWSPay}
                  handleValidateWSPay={handleValidateWSPay}
                  getStatusBadge={getStatusBadge}
                />

                <SecurityNoticeCard />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
