
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import EnhancedTreatmentCard from '@/components/EnhancedTreatmentCard';
import { usePriceCampaigns } from '@/hooks/usePriceCampaigns';
import { useTreatmentPackages } from '@/hooks/useTreatmentPackages';

interface Treatment {
  id: string;
  name: string;
  description: string;
  category: string;
  price_from: number;
  price_to: number;
  currency: string;
  duration_days: number;
  recovery_days: number;
  success_rate?: number; // Make optional to handle cases where it's not provided
  features: string[];
  images: string[];
  clinics: {
    id: string;
    name: string;
    city: string;
    country: string;
    rating: number;
    review_count: number;
  };
}

interface TreatmentGridProps {
  treatments: Treatment[];
  onClearFilters: () => void;
}

const TreatmentGrid: React.FC<TreatmentGridProps> = ({ treatments, onClearFilters }) => {
  const { data: campaigns } = usePriceCampaigns();
  const { data: packages } = useTreatmentPackages();

  const getTreatmentCampaigns = (treatmentId: string) => {
    return campaigns?.filter(campaign => campaign.treatment_id === treatmentId) || [];
  };

  const getTreatmentPackages = (treatmentId: string) => {
    return packages?.filter(pkg => pkg.treatment_id === treatmentId) || [];
  };

  const handleViewDetails = (treatmentId: string) => {
    window.location.href = `/treatment/${treatmentId}`;
  };

  const handleBookNow = (treatmentId: string) => {
    window.location.href = `/booking/${treatmentId}`;
  };

  return (
    <>
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {treatments.length} treatment{treatments.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Treatment Grid or No Results */}
      {treatments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {treatments.map((treatment) => (
            <EnhancedTreatmentCard
              key={treatment.id}
              treatment={treatment}
              campaigns={getTreatmentCampaigns(treatment.id)}
              packages={getTreatmentPackages(treatment.id)}
              onViewDetails={handleViewDetails}
              onBookNow={handleBookNow}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No treatments found</h3>
            <p>Try adjusting your search criteria or browse all treatments.</p>
          </div>
          <Button onClick={onClearFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      )}
    </>
  );
};

export default TreatmentGrid;
