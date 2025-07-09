
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useClinics } from '@/hooks/useClinics';
import { useTreatments } from '@/hooks/useTreatments';

export const useUnifiedSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('clinics');
  
  const query = searchParams.get('q') || '';
  const destination = searchParams.get('destination') || '';
  const tab = searchParams.get('tab') || 'clinics';
  
  const { data: allClinics, isLoading: clinicsLoading, error: clinicsError } = useClinics();
  const { data: allTreatments, isLoading: treatmentsLoading, error: treatmentsError } = useTreatments();

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  const filteredClinics = useMemo(() => {
    if (!allClinics) return [];
    
    return allClinics.filter(clinic => {
      const matchesQuery = !query || 
        clinic.name?.toLowerCase().includes(query.toLowerCase()) ||
        clinic.description?.toLowerCase().includes(query.toLowerCase()) ||
        clinic.city?.toLowerCase().includes(query.toLowerCase());
      
      const matchesDestination = !destination || 
        clinic.country?.toLowerCase().includes(destination.toLowerCase()) ||
        clinic.city?.toLowerCase().includes(destination.toLowerCase());

      return matchesQuery && matchesDestination;
    });
  }, [allClinics, query, destination]);

  const filteredTreatments = useMemo(() => {
    if (!allTreatments) return [];
    
    return allTreatments.filter(treatment => {
      const matchesQuery = !query || 
        treatment.name?.toLowerCase().includes(query.toLowerCase()) ||
        treatment.description?.toLowerCase().includes(query.toLowerCase()) ||
        treatment.category?.toLowerCase().includes(query.toLowerCase());
      
      const matchesDestination = !destination || 
        (treatment.clinics && (
          treatment.clinics.country?.toLowerCase().includes(destination.toLowerCase()) ||
          treatment.clinics.city?.toLowerCase().includes(destination.toLowerCase())
        ));

      return matchesQuery && matchesDestination;
    });
  }, [allTreatments, query, destination]);

  const handleTabChange = (newTab: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', newTab);
    setSearchParams(newParams);
    setActiveTab(newTab);
  };

  const handleSearch = (newQuery: string, newDestination: string) => {
    const newParams = new URLSearchParams();
    if (newQuery.trim()) newParams.set('q', newQuery.trim());
    if (newDestination && newDestination !== 'all') newParams.set('destination', newDestination);
    newParams.set('tab', activeTab);
    setSearchParams(newParams);
  };

  const totalResults = (filteredClinics?.length || 0) + (filteredTreatments?.length || 0);

  return {
    query,
    destination,
    activeTab,
    filteredClinics: filteredClinics || [],
    filteredTreatments: filteredTreatments || [],
    clinicsLoading,
    treatmentsLoading,
    clinicsError,
    treatmentsError,
    handleTabChange,
    handleSearch,
    totalResults
  };
};
