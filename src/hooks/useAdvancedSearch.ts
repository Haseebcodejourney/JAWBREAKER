import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TreatmentCategory = Database['public']['Enums']['treatment_category'];

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  country?: string;
  city?: string;
  priceRange?: { min: number; max: number };
  priceMin: number;
  priceMax: number;
  rating?: number;
  duration?: string;
  verified?: boolean;
  languages?: string[];
  specialties?: string[];
  features: string[];
  sortBy?: 'price' | 'rating' | 'popularity' | 'distance' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

const defaultFilters: SearchFilters = {
  query: '',
  category: '',
  country: '',
  city: '',
  priceMin: 0,
  priceMax: 100000,
  rating: 0,
  duration: '',
  verified: false,
  languages: [],
  specialties: [],
  features: [],
  sortBy: 'relevance',
  sortOrder: 'desc'
};

// Valid treatment categories
const validCategories: TreatmentCategory[] = [
  'hair_transplant', 
  'dental', 
  'cosmetic_surgery', 
  'eye_surgery', 
  'orthopedic', 
  'fertility', 
  'cardiology', 
  'other', 
  'bariatric_surgery', 
  'oncology'
];

export const useAdvancedSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['advanced-search', filters],
    queryFn: async () => {
      console.log('Advanced search with filters:', filters);
      
      let treatmentQuery = supabase
        .from('treatments')
        .select(`
          *,
          clinics (
            id,
            name,
            city,
            country,
            rating,
            review_count,
            verified,
            languages,
            specialties
          )
        `)
        .eq('active', true);

      // Apply filters
      if (filters.query) {
        treatmentQuery = treatmentQuery.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      if (filters.category && validCategories.includes(filters.category as TreatmentCategory)) {
        treatmentQuery = treatmentQuery.eq('category', filters.category as TreatmentCategory);
      }

      if (filters.priceMin > 0 || filters.priceMax < 100000) {
        treatmentQuery = treatmentQuery
          .gte('price_from', filters.priceMin)
          .lte('price_to', filters.priceMax);
      }

      const { data: treatments, error } = await treatmentQuery.limit(50);

      if (error) throw error;

      return {
        treatments: treatments || [],
        totalCount: treatments?.length || 0
      };
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'priceMin' && value > 0) return true;
    if (key === 'priceMax' && value < 100000) return true;
    if (key === 'features' && Array.isArray(value) && value.length > 0) return true;
    if (key === 'languages' && Array.isArray(value) && value.length > 0) return true;
    if (typeof value === 'string' && value.length > 0) return true;
    if (typeof value === 'boolean' && value) return true;
    return false;
  }).length;

  return {
    filters,
    updateFilter,
    resetFilters,
    activeFiltersCount,
    results: data?.treatments || [],
    loading,
    error
  };
};

export const useTreatmentCategories = () => {
  return useQuery({
    queryKey: ['treatment-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('treatments')
        .select('category')
        .eq('active', true);

      if (error) throw error;

      const categories = [...new Set(data?.map(t => t.category).filter(Boolean))];
      return categories;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useLocationData = () => {
  return useQuery({
    queryKey: ['location-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinics')
        .select('city, country')
        .eq('status', 'approved');

      if (error) throw error;

      const cities = [...new Set(data?.map(c => c.city).filter(Boolean))];
      const countries = [...new Set(data?.map(c => c.country).filter(Boolean))];

      return { cities, countries };
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const usePopularFeatures = () => {
  return useQuery({
    queryKey: ['popular-features'],
    queryFn: async () => {
      // Mock data for now - would be calculated from actual usage
      return [
        'Airport Transfer',
        'Hotel Accommodation',
        'Interpreter Service',
        'VIP Package',
        'Follow-up Care',
        'Medication Included',
        'Recovery Package',
        'City Tour'
      ];
    },
    staleTime: 10 * 60 * 1000,
  });
};
