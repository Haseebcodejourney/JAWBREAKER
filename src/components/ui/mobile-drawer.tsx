
import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface MobileDrawerProps {
  trigger?: React.ReactNode
  title?: string
  children: React.ReactNode
}

export function MobileDrawer({ trigger, title, children }: MobileDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        {title && (
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
        )}
        <div className="mt-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
