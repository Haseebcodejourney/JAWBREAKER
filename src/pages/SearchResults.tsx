
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import UnifiedSearchBar from '@/components/UnifiedSearchBar';
import SearchResultsTabs from '@/components/SearchResultsTabs';
import MobileSearchFilters from '@/components/MobileSearchFilters';
import { Button } from '@/components/ui/button';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { useUnifiedSearch } from '@/hooks/useUnifiedSearch';

const SearchResults = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [mobileFilters, setMobileFilters] = useState({
    priceRange: [0, 20000] as [number, number],
    selectedCountries: [],
    minRating: 0,
    selectedCategories: []
  });
  
  const {
    query,
    destination,
    activeTab,
    filteredClinics,
    filteredTreatments,
    clinicsLoading,
    treatmentsLoading,
    handleTabChange,
    handleSearch,
    totalResults
  } = useUnifiedSearch();

  const getSearchTitle = () => {
    if (query && destination) {
      return `"${query}" in ${destination}`;
    } else if (query) {
      return `"${query}"`;
    } else if (destination) {
      return `Results in ${destination}`;
    }
    return 'Search Results';
  };

  const handleMobileFiltersChange = (newFilters: any) => {
    setMobileFilters(newFilters);
    // Apply filters to search results
    console.log('Applying mobile filters:', newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Search Results for {getSearchTitle()}
            </h1>
            <p className="text-gray-600">
              {totalResults} results found
              {query && ` for "${query}"`}
              {destination && ` in ${destination}`}
            </p>
          </div>
          
          <UnifiedSearchBar
            initialQuery={query}
            initialDestination={destination}
            onSearch={handleSearch}
            placeholder="Refine your search..."
          />
          
          <div className="flex items-center justify-between mt-4">
            {/* Desktop Filter Toggle */}
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="hidden lg:flex"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            {/* Mobile Filter Toggle */}
            <Button 
              variant="outline" 
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Most Relevant</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 space-y-6`}>
            <SearchFilters />
          </div>

          {/* Results */}
          <div className="flex-1">
            <SearchResultsTabs
              clinics={filteredClinics}
              treatments={filteredTreatments}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              clinicsLoading={clinicsLoading}
              treatmentsLoading={treatmentsLoading}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <MobileSearchFilters
        isOpen={showMobileFilters}
        onOpenChange={setShowMobileFilters}
        filters={mobileFilters}
        onFiltersChange={handleMobileFiltersChange}
      />
      
      <Footer />
    </div>
  );
};

export default SearchResults;
