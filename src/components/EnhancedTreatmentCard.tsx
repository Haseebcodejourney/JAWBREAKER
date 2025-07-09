
import React from 'react';
import TreatmentCard from './TreatmentCard';
import type { Treatment, PriceCampaign, TreatmentPackage } from './TreatmentCard/types';

interface EnhancedTreatmentCardProps {
  treatment: Treatment;
  campaigns?: PriceCampaign[];
  packages?: TreatmentPackage[];
  onViewDetails?: (treatmentId: string) => void;
  onBookNow?: (treatmentId: string) => void;
}

const EnhancedTreatmentCard: React.FC<EnhancedTreatmentCardProps> = (props) => {
  return <TreatmentCard {...props} />;
};

export default EnhancedTreatmentCard;
