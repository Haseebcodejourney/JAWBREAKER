
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, TrendingUp } from 'lucide-react';

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSuggestionClick,
  isVisible
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const popularTreatments = useMemo(() => [
    'Hair Transplant',
    'Dental Implants',
    'Rhinoplasty',
    'Breast Augmentation',
    'Liposuction',
    'LASIK Eye Surgery',
    'BBL',
    'Tummy Tuck',
    'Gastric Sleeve',
    'Dental Veneers'
  ], []);

  const popularDestinations = useMemo(() => [
    'Turkey',
    'Thailand',
    'India',
    'Mexico',
    'South Korea',
    'Germany'
  ], []);

  useEffect(() => {
    // Load recent searches from localStorage with error handling
    try {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed);
        }
      }
    } catch (error) {
      console.warn('Failed to load recent searches:', error);
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const treatmentMatches = popularTreatments.filter(treatment =>
        treatment.toLowerCase().includes(query.toLowerCase())
      );
      const destinationMatches = popularDestinations
        .filter(dest => dest.toLowerCase().includes(query.toLowerCase()))
        .map(dest => `Treatments in ${dest}`);
      
      setSuggestions([...treatmentMatches, ...destinationMatches].slice(0, 6));
    } else {
      setSuggestions([]);
    }
  }, [query, popularTreatments, popularDestinations]);

  const saveRecentSearch = useCallback((searchTerm: string) => {
    try {
      if (!searchTerm.trim()) return;
      
      const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save recent search:', error);
    }
  }, [recentSearches]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    saveRecentSearch(suggestion);
    onSuggestionClick(suggestion);
  }, [saveRecentSearch, onSuggestionClick]);

  if (!isVisible) return null;

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto bg-white border shadow-lg">
      <CardContent className="p-4">
        {query.length > 0 ? (
          <div>
            {suggestions.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Suggestions
                </h4>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Searches
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Popular Treatments
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularTreatments.slice(0, 6).map((treatment) => (
                  <Badge
                    key={treatment}
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100 hover:text-blue-700"
                    onClick={() => handleSuggestionClick(treatment)}
                  >
                    {treatment}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchSuggestions;
