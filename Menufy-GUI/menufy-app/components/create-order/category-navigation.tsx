"use client"

import { MenuCategory } from "@/lib/models/MenuCategory"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils/utils"

interface CategoryNavigationProps {
  categories: MenuCategory[]
  activeCategory: string
  onCategorySelect: (categoryId: string) => void
}

export function CategoryNavigation({ 
  categories, 
  activeCategory, 
  onCategorySelect 
}: CategoryNavigationProps) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border mb-4 sm:mb-6">
      <ScrollArea className="w-full">
        <div className="flex space-x-2 p-3 sm:p-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategorySelect(category.id)}
              className={cn(
                "whitespace-nowrap min-w-fit text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9",
                activeCategory === category.id && "shadow-md"
              )}
            >
              {category.name}
              {category.items.length > 0 && (
                <span className="ml-1 text-xs opacity-75 hidden sm:inline">
                  ({category.items.length})
                </span>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
