"use client"

import { MenuCategory } from "@/lib/models/MenuCategory"
import { MenuItem } from "@/lib/models/MenuItem"
import { MenuItemCard } from "./menu-item-card"

interface MenuItemsGridProps {
  activeCategory: MenuCategory
  onAddToCart: (item: MenuItem) => void
}



export function MenuItemsGrid({ 
  activeCategory, 
  onAddToCart 
}: MenuItemsGridProps) {
  return (
    <div className="space-y-8">
        <div key={activeCategory.id} className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {activeCategory.name}
          </h2>
          
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {activeCategory.items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
          
          {activeCategory.items.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No items available in this category
              </p>
            </div>
          )}
        </div>
      
    </div>
  )
}
