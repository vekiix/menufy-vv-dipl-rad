"use client"

import { useState } from "react"
import { MenuItem } from "@/lib/models/MenuItem"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Plus, ImageIcon, Check } from "lucide-react"

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const hasImage = item.image && item.image.trim() !== ""
  const [isAdding, setIsAdding] = useState(false)
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Trigger animation
    setIsAdding(true)
    
    // Call the actual add to cart function
    onAddToCart(item)
    
    // Reset animation after 2 seconds
    setTimeout(() => {
      setIsAdding(false)
    }, 2000)
  }
  
  return (
    <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card hover:scale-[1.02]">
      <CardContent className="p-0">
        {/* Modern responsive layout */}
        <div className="sm:flex sm:items-stretch">
          {/* Image section with modern gradient overlay */}
          <div className="relative w-full sm:w-36 sm:h-36 aspect-[4/3] sm:aspect-square flex-shrink-0 overflow-hidden">
            {hasImage && item.image.startsWith("/") ? (
              <>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/logo.png'
                  }}
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-muted-foreground/60" />
              </div>
            )}
            
          </div>
          
          {/* Enhanced content section */}
          <div className="p-4 sm:p-5 flex-1 min-w-0 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-foreground text-base sm:text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-200">
                    {item.name}
                  </h3>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="font-bold text-xl sm:text-2xl text-primary">
                      €{item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
            
            {/* Enhanced bottom section with prominent CTA */}
            <div className="flex items-center justify-between mt-4 gap-3">
              <Badge 
                variant="secondary" 
                className="text-xs font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
              >
                {item.portion}
              </Badge>
              
              {/* Enhanced mobile add button with animation */}
              <Button
                size="sm"
                className={`sm:hidden font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ${
                  isAdding 
                    ? 'bg-green-500 hover:bg-green-500 text-white scale-105' 
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105'
                }`}
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5 animate-in zoom-in duration-300" />
                    Added!
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              {/* Enhanced desktop add button with animation */}
              <Button
                size="sm"
                className={`hidden sm:flex font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 items-center gap-2 ${
                  isAdding 
                    ? 'bg-green-500 hover:bg-green-500 text-white scale-105' 
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105'
                }`}
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4 animate-in zoom-in duration-300" />
                    Added!
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
