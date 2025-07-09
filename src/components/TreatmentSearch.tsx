
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Filter, X } from 'lucide-react';

interface TreatmentSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  priceRange: string;
  rating: string;
}

const TreatmentSearch: React.FC<TreatmentSearchProps> = ({ onSearch, onClearFilters }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: '',
    priceRange: '',
    rating: ''
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const categories = [
    { value: 'hair_transplant', label: 'Hair Transplant' },
    { value: 'dental', label: 'Dental' },
    { value: 'cosmetic_surgery', label: 'Cosmetic Surgery' },
    { value: 'eye_surgery', label: 'Eye Surgery' },
    { value: 'orthopedic', label: 'Orthopedic' },
    { value: 'fertility', label: 'Fertility' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'bariatric_surgery', label: 'Bariatric Surgery' }
  ];

  const locations = [
    'Turkey', 'Thailand', 'Mexico', 'India', 'Poland', 'Czech Republic', 'Hungary'
  ];

  const priceRanges = [
    { value: '0-1000', label: 'Under $1,000' },
    { value: '1000-5000', label: '$1,000 - $5,000' },
    { value: '5000-10000', label: '$5,000 - $10,000' },
    { value: '10000+', label: 'Over $10,000' }
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update active filters
    const active = Object.entries(newFilters)
      .filter(([_, v]) => v !== '')
      .map(([k, _]) => k);
    setActiveFilters(active);
    
    onSearch(newFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      query: '',
      category: '',
      location: '',
      priceRange: '',
      rating: ''
    };
    setFilters(emptyFilters);
    setActiveFilters([]);
    onClearFilters();
  };

  const removeFilter = (filterKey: string) => {
    handleFilterChange(filterKey as keyof SearchFilters, '');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      {/* Main Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search treatments, clinics, or locations..."
          value={filters.query}
          onChange={(e) => handleFilterChange('query', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {location}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.rating} onValueChange={(value) => handleFilterChange('rating', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4+">4+ Stars</SelectItem>
            <SelectItem value="3+">3+ Stars</SelectItem>
            <SelectItem value="2+">2+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filterKey) => {
            const value = filters[filterKey as keyof SearchFilters];
            const label = filterKey === 'category' 
              ? categories.find(c => c.value === value)?.label || value
              : filterKey === 'priceRange'
              ? priceRanges.find(p => p.value === value)?.label || value
              : value;
            
            return (
              <Badge key={filterKey} variant="secondary" className="flex items-center gap-1">
                {label}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeFilter(filterKey)}
                />
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default TreatmentSearch;
