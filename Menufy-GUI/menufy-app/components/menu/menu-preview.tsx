"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ChefHat, UtensilsCrossed, Clock, Star, Heart, Share2, Download, Smartphone, Monitor } from "lucide-react"
import { Menu } from "@/lib/models/Menu"

interface MenuPreviewProps {
  menu: Menu
}

export function MenuPreview({ menu }: MenuPreviewProps) {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("desktop")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const totalItems = menu?.categories.reduce((total, category) => total + category.items.length, 0) ?? 0

  if (menu?.categories.length === 0) {
    return (
      <div className="text-center py-12">
        <UtensilsCrossed className="mx-auto h-16 w-16 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No menu to preview</h3>
        <p className="mt-2 text-sm text-gray-500">Add some categories to your menu to see the preview.</p>
      </div>
    )
  }

  const PreviewContent = () => (
    <div className="space-y-8">
      {/* Restaurant Header */}
      <div className="text-center space-y-4 pb-6 border-b border-gray-200">
        <div className="flex justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Restaurant Logo" />
            <AvatarFallback className="text-2xl">
              <ChefHat className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Name</h1>
          <p className="text-gray-600 mt-2">Authentic cuisine • Fresh ingredients • Made with love</p>
          <div className="flex items-center justify-center space-x-4 mt-3">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">4.8</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">25-35 min</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {totalItems} items
            </Badge>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="space-y-8">
        {menu?.categories.map((category) => (
          <div key={category.id} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" alt={category.name} />
                <AvatarFallback>
                  <ChefHat className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                <p className="text-sm text-gray-500">{category.items.length} items</p>
              </div>
            </div>

            {/* Category Items */}
            {category.items.length > 0 ? (
              <div className="grid gap-4">
                {category.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Item Image */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                          <Avatar className="w-full h-full rounded-none">
                            <AvatarImage
                              src="/placeholder.svg?height=128&width=128"
                              alt={item.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="rounded-none">
                              <UtensilsCrossed className="h-8 w-8" />
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-gray-900 text-lg leading-tight">{item.name}</h3>
                              <div className="flex items-center space-x-2 ml-4">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {item.portion}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xl font-bold text-green-600">{formatPrice(item.price)}</span>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UtensilsCrossed className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">No items in this category</p>
              </div>
            )}

            {/* Category Separator */}
            {menu?.categories.indexOf(category) < menu?.categories.length - 1 && <Separator className="my-8" />}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-200 space-y-4">
        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Menu
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
        <p className="text-xs text-gray-500">Menu last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <UtensilsCrossed className="h-5 w-5" />
              <span>Menu Preview</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("desktop")}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant={viewMode === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("mobile")}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Preview how your menu will appear to customers</p>
            <div className="flex items-center space-x-4 text-xs">
              <span>{menu?.categories.length} categories</span>
              <span>•</span>
              <span>{totalItems} total items</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Container */}
      <div className="flex justify-center">
        <div
          className={`
            bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden
            ${viewMode === "mobile" ? "w-full max-w-sm mx-auto" : "w-full max-w-4xl"}
          `}
        >
          <div
            className={`
            ${viewMode === "mobile" ? "p-4 max-h-[600px] overflow-y-auto" : "p-8 max-h-[800px] overflow-y-auto"}
          `}
          >
            <PreviewContent />
          </div>
        </div>
      </div>

      {/* Preview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{menu?.categories.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalItems}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalItems > 0
                ? formatPrice(
                    menu?.categories.reduce(
                      (total, cat) => total + cat.items.reduce((catTotal, item) => catTotal + item.price, 0),
                      0,
                    ) / totalItems,
                  )
                : "€0.00"}
            </div>
            <div className="text-sm text-gray-600">Avg. Price</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
