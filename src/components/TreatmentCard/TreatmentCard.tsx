
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import TreatmentCardHeader from './TreatmentCardHeader';
import TreatmentCardImage from './TreatmentCardImage';
import TreatmentCardContent from './TreatmentCardContent';
import TreatmentCardPricing from './TreatmentCardPricing';
import { Treatment, PriceCampaign, TreatmentPackage } from './types';

interface TreatmentCardProps {
  treatment: Treatment;
  campaigns?: PriceCampaign[];
  packages?: TreatmentPackage[];
  onViewDetails?: (treatmentId: string) => void;
  onBookNow?: (treatmentId: string) => void;
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({
  treatment,
  campaigns = [],
  packages = [],
  onViewDetails,
  onBookNow
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/treatment/${treatment.id}`);
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/booking/${treatment.id}`;
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(treatment.id);
    } else {
      navigate(`/treatment/${treatment.id}`);
    }
  };

  const activeCampaign = campaigns.length > 0 ? campaigns[0] : null;

  return (
    <Card 
      className="relative overflow-hidden transition-all duration-300 hover:shadow-xl group border border-gray-200 bg-white cursor-pointer"
      onClick={handleCardClick}
    >
      <TreatmentCardHeader campaign={activeCampaign} currency={treatment.currency} />
      
      <TreatmentCardImage 
        image={treatment.images?.[0]} 
        name={treatment.name} 
      />

      <CardContent className="p-6 space-y-4">
        <TreatmentCardContent 
          treatment={treatment}
          packages={packages}
        />
        
        <TreatmentCardPricing
          treatment={treatment}
          campaign={activeCampaign}
          onViewDetails={handleViewDetails}
          onBookNow={handleBookNow}
        />
      </CardContent>
    </Card>
  );
};

export default TreatmentCard;
