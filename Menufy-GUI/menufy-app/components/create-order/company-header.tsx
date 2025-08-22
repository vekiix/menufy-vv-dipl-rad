"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { useApp } from "@/components/providers/app-provider"

export function CompanyHeader() {
  const { session, status } = useApp()

  // Show loading skeleton while session is loading
  if (status === 'loading') {
    return (
      <Card className="mb-4 sm:mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-6 sm:h-8 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-28" />
              </div>
              <Skeleton className="h-4 w-full max-w-xs" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const companyName = session?.user.company || ""

  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src="/logo.png" // Default logo since we don't have logo in session
              alt={`${companyName} logo`}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/logo.png'
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              {companyName}
            </h1>
            
            {/* Restaurant info badges */}
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                ⭐ 4.5 (120+ reviews)
              </Badge>
              <Badge variant="outline" className="text-xs">
                🍽️ Quality Cuisine
              </Badge>
            </div>
            
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
              Quality food • Fresh ingredients • Great service
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
