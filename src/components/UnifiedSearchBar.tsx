
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchSuggestions from './SearchSuggestions';

interface UnifiedSearchBarProps {
  initialQuery?: string;
  initialDestination?: string;
  onSearch?: (query: string, destination: string) => void;
  placeholder?: string;
}

const UnifiedSearchBar: React.FC<UnifiedSearchBarProps> = ({
  initialQuery = '',
  initialDestination = '',
  onSearch,
  placeholder
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState(initialQuery);
  const [destination, setDestination] = useState(initialDestination || 'all-destinations');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const destinations = useMemo(() => [
    { value: 'all-destinations', label: t('search.allDestinations') },
    { value: 'turkey', label: 'Turkey' },
    { value: 'thailand', label: 'Thailand' },
    { value: 'india', label: 'India' },
    { value: 'mexico', label: 'Mexico' },
    { value: 'south-korea', label: 'South Korea' },
    { value: 'germany', label: 'Germany' }
  ], [t]);

  const searchPlaceholder = placeholder || t('search.placeholder');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (destination && destination !== 'all-destinations') {
      const selectedDest = destinations.find(d => d.value === destination);
      if (selectedDest && selectedDest.label !== t('search.allDestinations')) {
        params.set('destination', selectedDest.label);
      }
    }
    
    if (onSearch) {
      const destValue = destination === 'all-destinations' ? '' : 
                      destinations.find(d => d.value === destination)?.label || '';
      onSearch(query, destValue);
    } else {
      navigate(`/search?${params.toString()}`);
    }
    
    setShowSuggestions(false);
    setIsFocused(false);
  }, [query, destination, onSearch, navigate, destinations, t]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    // Auto-trigger search when suggestion is clicked
    setTimeout(() => {
      const params = new URLSearchParams();
      if (suggestion.trim()) params.set('q', suggestion.trim());
      if (destination && destination !== 'all-destinations') {
        const selectedDest = destinations.find(d => d.value === destination);
        if (selectedDest && selectedDest.label !== t('search.allDestinations')) {
          params.set('destination', selectedDest.label);
        }
      }
      
      if (onSearch) {
        const destValue = destination === 'all-destinations' ? '' : 
                        destinations.find(d => d.value === destination)?.label || '';
        onSearch(suggestion, destValue);
      } else {
        navigate(`/search?${params.toString()}`);
      }
    }, 100);
  }, [destination, onSearch, navigate, destinations, t]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    setShowSuggestions(true);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  }, []);

  const handleDestinationChange = useCallback((value: string) => {
    setDestination(value);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
      <div className="flex-1 relative" ref={searchRef}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        <Input
          placeholder={searchPlaceholder}
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={handleInputFocus}
          className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
        />
        <SearchSuggestions
          query={query}
          onSuggestionClick={handleSuggestionClick}
          isVisible={showSuggestions && isFocused}
        />
      </div>
      
      <Select value={destination} onValueChange={handleDestinationChange}>
        <SelectTrigger className="w-full sm:w-48 h-11 sm:h-12">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Destination" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {destinations.map((dest) => (
            <SelectItem key={dest.value} value={dest.value}>
              {dest.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button onClick={handleSearch} className="h-11 sm:h-12 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700">
        {t('search.button')}
      </Button>
    </div>
  );
};

export default UnifiedSearchBar;
