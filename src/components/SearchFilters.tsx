
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, MapPin, Shield, Globe } from 'lucide-react';

const SearchFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const countries = [
    { name: 'Turkey', flag: '🇹🇷', count: 1247 },
    { name: 'Thailand', flag: '🇹🇭', count: 892 },
    { name: 'India', flag: '🇮🇳', count: 654 },
    { name: 'Mexico', flag: '🇲🇽', count: 432 },
    { name: 'South Korea', flag: '🇰🇷', count: 321 },
    { name: 'Germany', flag: '🇩🇪', count: 234 }
  ];

  const languages = [
    'English', 'Turkish', 'Arabic', 'Russian', 'German', 'French', 'Spanish', 'Chinese'
  ];

  const accreditations = [
    'JCI Accredited', 'ISO 9001', 'FDA Approved', 'CE Marked', 'NABH', 'AAAHC'
  ];

  const toggleSelection = (item: string, list: string[], setList: (list: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    
    // Apply country filters
    if (selectedCountries.length > 0) {
      newParams.set('countries', selectedCountries.join(','));
    } else {
      newParams.delete('countries');
    }
    
    // Apply price range
    if (priceRange[0] !== 0 || priceRange[1] !== 10000) {
      newParams.set('priceMin', priceRange[0].toString());
      newParams.set('priceMax', priceRange[1].toString());
    } else {
      newParams.delete('priceMin');
      newParams.delete('priceMax');
    }
    
    // Apply rating filter
    if (minRating > 0) {
      newParams.set('minRating', minRating.toString());
    } else {
      newParams.delete('minRating');
    }
    
    // Apply language filters
    if (selectedLanguages.length > 0) {
      newParams.set('languages', selectedLanguages.join(','));
    } else {
      newParams.delete('languages');
    }
    
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedCountries([]);
    setSelectedLanguages([]);
    setMinRating(0);
    
    // Clear URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('countries');
    newParams.delete('priceMin');
    newParams.delete('priceMax');
    newParams.delete('minRating');
    newParams.delete('languages');
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-3">Price Range (USD)</h4>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={20000}
              step={100}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* Countries */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Countries
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {countries.map((country) => (
                <div key={country.name} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={selectedCountries.includes(country.name)}
                      onCheckedChange={() => 
                        toggleSelection(country.name, selectedCountries, setSelectedCountries)
                      }
                    />
                    <span className="text-sm">
                      {country.flag} {country.name}
                    </span>
                  </label>
                  <Badge variant="secondary" className="text-xs">
                    {country.count}
                  </Badge>
                </div>
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
                    checked={minRating === rating}
                    onCheckedChange={() => setMinRating(minRating === rating ? 0 : rating)}
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

          {/* Languages */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Languages Spoken
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {languages.map((language) => (
                <label key={language} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={selectedLanguages.includes(language)}
                    onCheckedChange={() => 
                      toggleSelection(language, selectedLanguages, setSelectedLanguages)
                    }
                  />
                  <span className="text-sm">{language}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Accreditations */}
          <div>
            <h4 className="font-medium mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Accreditations
            </h4>
            <div className="space-y-2">
              {accreditations.map((accreditation) => (
                <label key={accreditation} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox />
                  <span className="text-sm">{accreditation}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button onClick={applyFilters} className="w-full">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearAllFilters} className="w-full">
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchFilters;
