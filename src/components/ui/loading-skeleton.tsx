
import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  lines?: number
  variant?: 'text' | 'card' | 'avatar' | 'image'
}

export function LoadingSkeleton({ 
  className, 
  lines = 3, 
  variant = 'text' 
}: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn("animate-pulse space-y-4 p-4 border rounded-lg bg-white", className)}>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    )
  }

  if (variant === 'avatar') {
    return (
      <div className={cn("animate-pulse flex space-x-4", className)}>
        <div className="rounded-full bg-gray-200 h-10 w-10"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (variant === 'image') {
    return (
      <div className={cn("animate-pulse bg-gray-200 rounded-lg", className)}>
        <div className="h-48 w-full bg-gray-300 rounded"></div>
      </div>
    )
  }

  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "h-4 bg-gray-200 rounded",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}
