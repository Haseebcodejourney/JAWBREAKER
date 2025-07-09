
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EnhancedCardProps {
  title?: string
  subtitle?: string
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  image?: string
  actions?: {
    primary?: {
      label: string
      onClick: () => void
      variant?: 'default' | 'outline' | 'secondary'
    }
    secondary?: {
      label: string
      onClick: () => void
    }
  }
  children?: React.ReactNode
  className?: string
  hover?: boolean
}

export function EnhancedCard({
  title,
  subtitle,
  badge,
  image,
  actions,
  children,
  className,
  hover = true
}: EnhancedCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      hover && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
      className
    )}>
      {image && (
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {badge && (
            <Badge 
              variant={badge.variant || 'default'}
              className="absolute top-2 right-2"
            >
              {badge.text}
            </Badge>
          )}
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {title && <CardTitle className="line-clamp-2">{title}</CardTitle>}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{subtitle}</p>
            )}
          </div>
          {badge && !image && (
            <Badge variant={badge.variant || 'default'}>
              {badge.text}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      {children && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
      
      {actions && (
        <CardContent className="pt-0 flex gap-2">
          {actions.primary && (
            <Button 
              onClick={actions.primary.onClick}
              variant={actions.primary.variant || 'default'}
              className="flex-1"
            >
              {actions.primary.label}
            </Button>
          )}
          {actions.secondary && (
            <Button 
              onClick={actions.secondary.onClick}
              variant="outline"
              className="flex-1"
            >
              {actions.secondary.label}
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  )
}
