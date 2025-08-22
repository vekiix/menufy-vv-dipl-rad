"use client"

import { MenuItem } from "@/lib/models/MenuItem"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils/utils"

interface CartItem {
  itemId: string
  quantity: number
  item: MenuItem
}

interface CartSidebarProps {
  cartItems: CartItem[]
  isOpen: boolean
  onToggleCart: () => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
}

export function CartSidebar({
  cartItems,
  isOpen,
  onToggleCart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartSidebarProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.item.price * item.quantity), 0)

  return (
    <>
      {/* Cart Toggle Buttons - Only visible when cart is closed */}
      {!isOpen && (
        <>
          {/* Desktop Cart Toggle Button */}
          <div className="hidden md:block fixed bottom-4 right-4 z-50">
            <Button
              onClick={onToggleCart}
              size="lg"
              className="rounded-full shadow-lg h-12 w-12 relative hover:scale-105 transition-transform"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile Cart Toggle Button - Positioned above mobile navigation */}
          <div className="fixed bottom-20 right-4 z-40 md:hidden">
            <Button
              onClick={onToggleCart}
              size="lg"
              className="rounded-full shadow-lg h-12 w-12 sm:h-14 sm:w-14 relative hover:scale-105 transition-transform"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:block fixed right-0 top-0 h-screen w-72 md:w-72 lg:w-80 xl:w-96 bg-background border-l border-border transform transition-transform duration-300 z-30",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center justify-between">
              <span>Your Order</span>
              <Button variant="ghost" size="sm" onClick={onToggleCart}>
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col h-[calc(100%-80px)] p-0">
            {cartItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {cartItems.map((cartItem) => (
                    <div key={cartItem.itemId} className="flex items-center space-x-2 sm:space-x-3 p-3 bg-card rounded-lg border">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-1 text-sm sm:text-base">{cartItem.item.name}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          €{cartItem.item.price.toFixed(2)} each
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-7 h-7 sm:w-8 sm:h-8"
                          onClick={() => onUpdateQuantity(cartItem.itemId, cartItem.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        
                        <span className="w-6 sm:w-8 text-center font-medium text-sm">
                          {cartItem.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-7 h-7 sm:w-8 sm:h-8"
                          onClick={() => onUpdateQuantity(cartItem.itemId, cartItem.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 sm:w-8 sm:h-8 text-destructive hover:text-destructive ml-1"
                          onClick={() => onRemoveItem(cartItem.itemId)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-border p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={onCheckout}
                    disabled={cartItems.length === 0}
                  >
                    Place Order
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cart Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background">
          <Card className="h-full rounded-none border-0">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center justify-between">
                <span>Your Order</span>
                <Button variant="ghost" size="sm" onClick={onToggleCart}>
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex flex-col h-[calc(100%-80px)] p-0">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cartItems.map((cartItem) => (
                      <div key={cartItem.itemId} className="flex items-center space-x-3 p-3 bg-card rounded-lg border">
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-1">{cartItem.item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            €{cartItem.item.price.toFixed(2)} each
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => onUpdateQuantity(cartItem.itemId, cartItem.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="w-8 text-center font-medium">
                            {cartItem.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => onUpdateQuantity(cartItem.itemId, cartItem.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-destructive hover:text-destructive"
                            onClick={() => onRemoveItem(cartItem.itemId)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-border p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>€{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={onCheckout}
                      disabled={cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-35"
          onClick={onToggleCart}
        />
      )}
    </>
  )
}
