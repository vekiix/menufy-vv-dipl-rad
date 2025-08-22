"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2, Smartphone } from "lucide-react"
import { formatPrice } from "@/lib/utils/utils"
import { initiateCreditCardPayment, initiateKeksPayPayment } from "@/lib/services/payment-service"
import { useToast } from "../providers/toast-provider"

interface PaymentActionsProps {
  orderId: string
  totalPrice: number
  transactionToken: string
  onPaymentSuccess: () => void
}

type PaymentMethod = 'creditcard' | 'kekspay'

export function PaymentActions({ 
  totalPrice, 
  transactionToken, 
  onPaymentSuccess 
}: PaymentActionsProps) {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditcard')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // Form refs
  const formRef = useRef<HTMLFormElement>(null)
  const { showToast } = useToast()

  const validateCreditCardForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {}
    
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const cardNumber = formData.get('cardNumber') as string
    const cvv = formData.get('cvv') as string
    
    if (!firstName?.trim()) {
      errors.firstName = "First name is required"
    }
    if (!lastName?.trim()) {
      errors.lastName = "Last name is required"
    }
    if (!cardNumber?.trim()) {
      errors.cardNumber = "Card number is required"
    } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = "Card number must be 16 digits"
    }
    if (!cvv?.trim()) {
      errors.cvv = "CVV is required"
    } else if (!/^\d{3,4}$/.test(cvv)) {
      errors.cvv = "CVV must be 3-4 digits"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateKeksPayForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {}
    
    const phoneNumber = formData.get('phoneNumber') as string
    
    if (!phoneNumber?.trim()) {
      errors.phoneNumber = "Phone number is required"
    } else if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = "Please enter a valid phone number"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!formRef.current) return
    
    const formData = new FormData(formRef.current)
    
    // Validate form based on selected payment method
    const isValid = paymentMethod === 'creditcard' ? validateCreditCardForm(formData) : validateKeksPayForm(formData)
    if (!isValid) return
    
    try {
      setIsPaymentLoading(true)
      
      // Call appropriate payment service based on method
      const payment = paymentMethod === 'creditcard' 
        ? await initiateCreditCardPayment(transactionToken, {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            cardNumber: (formData.get('cardNumber') as string).replace(/\s/g, ''),
            cvv: formData.get('cvv') as string
          })
        : await initiateKeksPayPayment(transactionToken, (formData.get('phoneNumber') as string).replace(/\s/g, ''))
      
      // Only call success callback if payment was accepted
      if (payment) {
        // Reset form and hide payment section on success
        setShowPaymentForm(false)
        formRef.current.reset()
        setFormErrors({})
        
        // Call success callback after payment is confirmed
        onPaymentSuccess()
      } else {
        throw ("Payment failed. Please try again.")
      }
      
    } catch (error) {
      // Handle different error types
      showToast("Failed to initiate payment. Please try again.", "error")
    } finally {
      setIsPaymentLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\D/g, '')
    // Add spaces every 4 digits
    return v.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.replace(/\s/g, '').length <= 16) {
      e.target.value = formatted
      if (formErrors.cardNumber) {
        setFormErrors(prev => ({ ...prev, cardNumber: '' }))
      }
    } else {
      e.preventDefault()
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 4) {
      e.target.value = value
      if (formErrors.cvv) {
        setFormErrors(prev => ({ ...prev, cvv: '' }))
      }
    } else {
      e.preventDefault()
    }
  }

  const clearFieldError = (fieldName: string) => {
    if (formErrors[fieldName]) {
      setFormErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="mb-3">
        <div className="font-medium text-gray-900 mb-1">Complete Payment</div>
        <div className="text-xs text-gray-500 mb-3">
          Total: {formatPrice(totalPrice)} • Transaction: {transactionToken}
        </div>
        
        {!showPaymentForm ? (
          <div className="flex items-center justify-end">
            <Button 
              onClick={(e) => {
                e.stopPropagation()
                setShowPaymentForm(true)
              }}
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handlePayment} className="space-y-4">
            <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="creditcard" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Credit Card
                </TabsTrigger>
                <TabsTrigger value="kekspay" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  KeksPay
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="creditcard" className="space-y-3 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      onChange={() => clearFieldError('firstName')}
                      className={`mt-1 ${formErrors.firstName ? 'border-red-500' : ''}`}
                      placeholder="John"
                    />
                    {formErrors.firstName && <p className="text-xs text-red-500 mt-1">{formErrors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      onChange={() => clearFieldError('lastName')}
                      className={`mt-1 ${formErrors.lastName ? 'border-red-500' : ''}`}
                      placeholder="Doe"
                    />
                    {formErrors.lastName && <p className="text-xs text-red-500 mt-1">{formErrors.lastName}</p>}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cardNumber" className="text-sm font-medium">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    onChange={handleCardNumberChange}
                    className={`mt-1 ${formErrors.cardNumber ? 'border-red-500' : ''}`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {formErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{formErrors.cardNumber}</p>}
                </div>
                
                <div>
                  <Label htmlFor="cvv" className="text-sm font-medium">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    type="text"
                    onChange={handleCvvChange}
                    className={`mt-1 w-24 ${formErrors.cvv ? 'border-red-500' : ''}`}
                    placeholder="123"
                    maxLength={4}
                  />
                  {formErrors.cvv && <p className="text-xs text-red-500 mt-1">{formErrors.cvv}</p>}
                </div>
              </TabsContent>
              
              <TabsContent value="kekspay" className="space-y-3 mt-4">
                <div>
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    onChange={() => clearFieldError('phoneNumber')}
                    className={`mt-1 ${formErrors.phoneNumber ? 'border-red-500' : ''}`}
                    placeholder="+385 91 234 5678"
                  />
                  {formErrors.phoneNumber && <p className="text-xs text-red-500 mt-1">{formErrors.phoneNumber}</p>}
                </div>
                <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                  <Smartphone className="h-3 w-3 inline mr-1" />
                  You&39;ll receive a payment link via SMS to complete the transaction.
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex gap-2 pt-2">
              <Button 
                type="submit"
                disabled={isPaymentLoading}
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                {isPaymentLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === 'creditcard' ? (
                      <CreditCard className="h-4 w-4 mr-2" />
                    ) : (
                      <Smartphone className="h-4 w-4 mr-2" />
                    )}
                    Pay {formatPrice(totalPrice)}
                  </>
                )}
              </Button>
              <Button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPaymentForm(false)
                  setFormErrors({})
                }}
                variant="outline" 
                size="sm"
                disabled={isPaymentLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
