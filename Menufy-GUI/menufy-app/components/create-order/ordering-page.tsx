"use client"

import { useState, useCallback, useEffect } from "react"
import { CreateOrderLine } from "@/lib/models/Orders"
import { MenuItem } from "@/lib/models/MenuItem"
import { CompanyHeader } from "./company-header"
import { CategoryNavigation } from "./category-navigation"
import { MenuItemsGrid } from "./menu-items-grid"
import { CartSidebar } from "./cart-sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/utils"
import { getCompanyMenu } from "@/lib/services/menu-service"
import { MenuCategory } from "@/lib/models/MenuCategory"
import { useToast } from "../providers/toast-provider"
import { cartStorageManager, PersistedCartItem } from "@/lib/utils/cart-storage-manager"
import { createOrder } from "@/lib/services/order-service"

export interface CartItem {
  itemId: string
  quantity: number
  item: MenuItem
}

// Helper function to convert CartItem to PersistedCartItem
const cartItemsToPersistedItems = (cartItems: CartItem[]): PersistedCartItem[] => {
  return cartItems.map(item => ({
    i: item.itemId,
    q: item.quantity
  }))
}

// Helper function to reconstruct CartItems from PersistedCartItems using menu data
const reconstructCartItems = (persistedItems: PersistedCartItem[], allMenuItems: MenuItem[]): CartItem[] => {
  const restoredCartItems: CartItem[] = []
  persistedItems.forEach(persistedItem => {
    const menuItem = allMenuItems.find(item => item.id === persistedItem.i)
    if (menuItem && persistedItem.q > 0) {
      restoredCartItems.push({
        itemId: persistedItem.i,
        quantity: persistedItem.q,
        item: menuItem
      })
    }
  })
  return restoredCartItems
}

// Export the clear cart function for backward compatibility
export const clearCartFromStorage = () => {
  cartStorageManager.clearCartFromStorage()
}

export function OrderingPage() {
  const [activeCategory, setActiveCategory] = useState<string>("") // Start with first category
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { showToast } = useToast()

  const fetchMenuCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      const categories = (await getCompanyMenu()).categories
      setMenuCategories(categories)
      // Set first category as active if available
      if (categories.length > 0 && !activeCategory) {
        setActiveCategory(categories[0].id)
      }

      // Load cart from localStorage after menu data is available
      if (!cartStorageManager.getHasLoadedFromStorage()) {
        // Find all menu items to reconstruct cart
        const allMenuItems: MenuItem[] = []
        categories.forEach(category => {
          if (category.items) {
            allMenuItems.push(...category.items)
          }
        })

        // Load persisted items and reconstruct cart items
        const persistedItems = cartStorageManager.loadCartFromStorage()
        const restoredCartItems = reconstructCartItems(persistedItems, allMenuItems)
        if (restoredCartItems.length > 0) {
          setCartItems(restoredCartItems)
        }
      }
    } catch (error) {
      showToast(`Failed to fetch menu categories. ${error}`, "error")
      // Fallback to empty array
      setMenuCategories([])
    } finally {
      setIsLoading(false)
    }
  }, [activeCategory, showToast])
  const removeItem = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(cartItem => cartItem.itemId !== itemId))
  }, [])

  // Fetch categories on component mount
  useEffect(() => {
    fetchMenuCategories()
  }, [fetchMenuCategories])

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (cartStorageManager.getHasLoadedFromStorage()) {
      const persistedItems = cartItemsToPersistedItems(cartItems)
      cartStorageManager.saveCartToStorage(persistedItems)
    }
  }, [cartItems])

  const addToCart = useCallback((item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.itemId === item.id)
      
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.itemId === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        return [...prev, {
          itemId: item.id,
          quantity: 1,
          item
        }]
      }
    })
    
    // Show feedback when adding items - could add toast notification here in the future
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    
    setCartItems(prev =>
      prev.map(cartItem =>
        cartItem.itemId === itemId
          ? { ...cartItem, quantity }
          : cartItem
      )
    )
  }, [removeItem])



  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev)
  }, [])

  const handleCheckout = useCallback(async () => {
    try {
      // Mock order placement - in real app this would call an API
      console.log("Placing order with items:", cartItems)
      
      // Check if cart is empty
      if (cartItems.length === 0) {
        showToast("Your cart is empty. Please add items before placing an order.", "error")
        return
      }
      
      ///Create modal for confirming order
      const orderItems: CreateOrderLine[] = cartItems.map(cartItem => ({
        item: cartItem.itemId,
        quantity: cartItem.quantity
      }))
      
      console.log("Order items to send:", orderItems)
      
      await createOrder(orderItems)
      showToast("Order placed successfully! Kitchen staff will be notified.", "success")
      setCartItems([])
      clearCartFromStorage()
      toggleCart()
    } catch (error) {
      showToast(`Failed to place order. ${error}`, "error")
    }
  }, [cartItems, showToast, toggleCart])


  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 min-h-screen pb-32 md:pb-6",
        isCartOpen ? "md:mr-72 lg:mr-80 xl:mr-96" : "md:mr-0"
      )}>
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl lg:max-w-6xl">
          <CompanyHeader />
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading menu...</p>
              </div>
            </div>
          ) : menuCategories.length > 0 ? (
            <>
              <CategoryNavigation
                categories={menuCategories}
                activeCategory={activeCategory}
                onCategorySelect={setActiveCategory}
              />
              
              <MenuItemsGrid
                activeCategory={menuCategories.find(category => category.id === activeCategory)!}
                onAddToCart={addToCart}
              />
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No menu categories available</p>
                <Button onClick={fetchMenuCategories} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        cartItems={cartItems}
        isOpen={isCartOpen}
        onToggleCart={toggleCart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />
    </div>
  )
}

