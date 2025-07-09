
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Filter, MapPin } from 'lucide-react';

interface ActiveFiltersProps {
  category: string;
  destination: string;
  searchTerm: string;
  getCategoryLabel: (cat: string) => string;
  onCategoryChange: (value: string) => void;
  onDestinationClear: () => void;
  onSearchClear: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  category,
  destination,
  searchTerm,
  getCategoryLabel,
  onCategoryChange,
  onDestinationClear,
  onSearchClear
}) => {
  if (!category && !destination && !searchTerm) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">Active filters:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {category && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {getCategoryLabel(category)}
            <button onClick={() => onCategoryChange('all')} className="ml-1 hover:text-red-600">×</button>
          </Badge>
        )}
        {destination && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {destination}
            <button onClick={onDestinationClear} className="ml-1 hover:text-red-600">×</button>
          </Badge>
        )}
        {searchTerm && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Search: {searchTerm}
            <button onClick={onSearchClear} className="ml-1 hover:text-red-600">×</button>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
