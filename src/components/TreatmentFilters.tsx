
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, DollarSign, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import SearchFilters from '@/components/SearchFilters';

interface TreatmentFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  category: string;
  sortBy: string;
  setSortBy: (sort: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
  categories: Array<{ value: string; label: string }>;
  onCategoryChange: (value: string) => void;
  onSearch: () => void;
}

const TreatmentFilters: React.FC<TreatmentFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  category,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  showMobileFilters,
  setShowMobileFilters,
  categories,
  onCategoryChange,
  onSearch
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filter Treatments</SheetTitle>
                <SheetDescription>
                  Refine your search with detailed filters
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <SearchFilters />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search treatments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Category Filter */}
        <div className="w-full lg:w-48">
          <Select value={category || 'all'} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="w-full lg:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onSearch} className="!bg-[#96be25] hover:!bg-[#96be25]">
          Apply Search
        </Button>
      </div>

      {/* Quick Price Filter */}
      <div className="flex items-center gap-4 mt-4">
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="w-48">
            <DollarSign className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="low">Under $1,000</SelectItem>
            <SelectItem value="medium">$1,000 - $5,000</SelectItem>
            <SelectItem value="high">Over $5,000</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TreatmentFilters;
