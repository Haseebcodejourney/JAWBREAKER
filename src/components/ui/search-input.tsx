
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
  showClearButton?: boolean
}

export function SearchInput({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  className,
  showClearButton = true
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    onChange?.(newValue)
  }

  const handleSearch = () => {
    onSearch?.(searchValue)
  }

  const handleClear = () => {
    setSearchValue("")
    onChange?.("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          value={searchValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
     
          <Button
          style={{backgroundColor: '#96be25 !important'}}
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        
      </div>
      <Button 
        onClick={handleSearch}
        className="ml-2"
        size="sm"
        style={{ backgroundColor: '#96be25 !important' }}
      >
        Search
      </Button>
    </div>
  )
}
