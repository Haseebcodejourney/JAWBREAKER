
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PriceCampaign } from './types';

interface TreatmentCardHeaderProps {
  campaign?: PriceCampaign | null;
  currency: string;
}

const TreatmentCardHeader: React.FC<TreatmentCardHeaderProps> = ({ 
  campaign, 
  currency 
}) => {
  if (!campaign) return null;

  return (
    <div className="absolute top-4 right-4 z-10">
      <Badge className="bg-red-500 text-white shadow-lg">
        {campaign.discount_percentage 
          ? `${campaign.discount_percentage}% OFF`
          : `Save ${currency} ${campaign.discount_amount}`
        }
      </Badge>
    </div>
  );
};

export default TreatmentCardHeader;
