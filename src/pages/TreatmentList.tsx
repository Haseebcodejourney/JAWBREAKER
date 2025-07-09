
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchFilters from '@/components/SearchFilters';
import TreatmentListHeader from '@/components/TreatmentListHeader';
import ActiveFilters from '@/components/ActiveFilters';
import TreatmentFilters from '@/components/TreatmentFilters';
import TreatmentGrid from '@/components/TreatmentGrid';
import { useTreatments } from '@/hooks/useTreatments';

const TreatmentList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const category = searchParams.get('category') || '';
  const destination = searchParams.get('destination') || '';
  
  const { data: treatments, isLoading } = useTreatments(category);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'hair_transplant', label: 'Hair Transplant' },
    { value: 'dental', label: 'Dental Care' },
    { value: 'cosmetic_surgery', label: 'Cosmetic Surgery' },
    { value: 'eye_surgery', label: 'Eye Surgery' },
    { value: 'orthopedic', label: 'Orthopedic' },
    { value: 'fertility', label: 'Fertility' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'other', label: 'Other' }
  ];

  const handleCategoryChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set('category', value);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleDestinationClear = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('destination');
    setSearchParams(newParams);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleClearAllFilters = () => {
    setSearchTerm('');
    setSearchParams(new URLSearchParams());
  };

  // Filter and sort treatments
  let filteredTreatments = treatments || [];
  
  if (searchTerm) {
    filteredTreatments = filteredTreatments.filter(treatment =>
      treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (destination) {
    filteredTreatments = filteredTreatments.filter(treatment =>
      treatment.clinics.country.toLowerCase() === destination.toLowerCase()
    );
  }

  if (priceRange !== 'all') {
    filteredTreatments = filteredTreatments.filter(treatment => {
      const price = treatment.price_from;
      switch (priceRange) {
        case 'low': return price < 1000;
        case 'medium': return price >= 1000 && price <= 5000;
        case 'high': return price > 5000;
        default: return true;
      }
    });
  }

  // Sort treatments
  filteredTreatments.sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price_from - b.price_from;
      case 'price-high': return b.price_from - a.price_from;
      case 'rating': return (b.clinics.rating || 0) - (a.clinics.rating || 0);
      case 'name':
      default: return a.name.localeCompare(b.name);
    }
  });

  const getCategoryLabel = (cat: string) => {
    const category = categories.find(c => c.value === cat);
    return category ? category.label : cat;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <SearchFilters />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <TreatmentListHeader
              category={category}
              destination={destination}
              resultsCount={filteredTreatments.length}
              getCategoryLabel={getCategoryLabel}
            />

            <ActiveFilters
              category={category}
              destination={destination}
              searchTerm={searchTerm}
              getCategoryLabel={getCategoryLabel}
              onCategoryChange={handleCategoryChange}
              onDestinationClear={handleDestinationClear}
              onSearchClear={handleSearchClear}
            />

            <TreatmentFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              category={category}
              sortBy={sortBy}
              setSortBy={setSortBy}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              showMobileFilters={showMobileFilters}
              setShowMobileFilters={setShowMobileFilters}
              categories={categories}
              onCategoryChange={handleCategoryChange}
              onSearch={handleSearch}
            />

            <TreatmentGrid
              treatments={filteredTreatments}
              onClearFilters={handleClearAllFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentList;
