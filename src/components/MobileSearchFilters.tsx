
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X, Star, MapPin, DollarSign } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MobileSearchFiltersProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    priceRange: [number, number];
    selectedCountries: string[];
    minRating: number;
    selectedCategories: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const MobileSearchFilters: React.FC<MobileSearchFiltersProps> = ({
  isOpen,
  onOpenChange,
  filters,
  onFiltersChange
}) => {
  const [tempFilters, setTempFilters] = useState(filters);

  const countries = [
    { name: 'Turkey', flag: '🇹🇷' },
    { name: 'Thailand', flag: '🇹🇭' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'Mexico', flag: '🇲🇽' },
    { name: 'South Korea', flag: '🇰🇷' },
    { name: 'Germany', flag: '🇩🇪' }
  ];

  const categories = [
    'Hair Transplant',
    'Dental',
    'Cosmetic Surgery',
    'Eye Surgery',
    'Orthopedic',
    'Fertility'
  ];

  const toggleCountry = (country: string) => {
    const updated = tempFilters.selectedCountries.includes(country)
      ? tempFilters.selectedCountries.filter(c => c !== country)
      : [...tempFilters.selectedCountries, country];
    
    setTempFilters({ ...tempFilters, selectedCountries: updated });
  };

  const toggleCategory = (category: string) => {
    const updated = tempFilters.selectedCategories.includes(category)
      ? tempFilters.selectedCategories.filter(c => c !== category)
      : [...tempFilters.selectedCategories, category];
    
    setTempFilters({ ...tempFilters, selectedCategories: updated });
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    onOpenChange(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      priceRange: [0, 20000] as [number, number],
      selectedCountries: [],
      minRating: 0,
      selectedCategories: []
    };
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </SheetTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-full pb-20">
          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Price Range (USD)
              </h4>
              <Slider
                value={tempFilters.priceRange}
                onValueChange={(value) => setTempFilters({ 
                  ...tempFilters, 
                  priceRange: value as [number, number] 
                })}
                max={20000}
                step={100}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${tempFilters.priceRange[0].toLocaleString()}</span>
                <span>${tempFilters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Countries */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Countries
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {countries.map((country) => (
                  <label
                    key={country.name}
                    className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={tempFilters.selectedCountries.includes(country.name)}
                      onCheckedChange={() => toggleCountry(country.name)}
                    />
                    <span className="text-sm">
                      {country.flag} {country.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-medium mb-3">Treatment Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={tempFilters.selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-medium mb-3">Minimum Rating</h4>
              <div className="space-y-2">
                {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                  <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={tempFilters.minRating === rating}
                      onCheckedChange={() => 
                        setTempFilters({ 
                          ...tempFilters, 
                          minRating: tempFilters.minRating === rating ? 0 : rating 
                        })
                      }
                    />
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm">{rating}+ stars</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button onClick={applyFilters} className="w-full bg-blue-600 hover:bg-blue-700">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSearchFilters;
