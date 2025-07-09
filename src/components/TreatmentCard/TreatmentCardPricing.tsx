
import React from 'react';
import { Button } from '@/components/ui/button';
import { Treatment, PriceCampaign } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { useRateLimiting } from '@/hooks/useRateLimiting';

interface TreatmentCardPricingProps {
  treatment: Treatment;
  campaign?: PriceCampaign | null;
  onViewDetails?: (e: React.MouseEvent) => void;
  onBookNow: (e: React.MouseEvent) => void;
}

const TreatmentCardPricing: React.FC<TreatmentCardPricingProps> = ({
  treatment,
  campaign,
  onViewDetails,
  onBookNow
}) => {
  const { user } = useAuth();
  const { checkRateLimit } = useRateLimiting();

  const formatPrice = () => {
    if (treatment.price_from === treatment.price_to) {
      return `${treatment.currency} ${treatment.price_from?.toLocaleString()}`;
    }
    return `${treatment.currency} ${treatment.price_from?.toLocaleString()} - ${treatment.price_to?.toLocaleString()}`;
  };

  const getDiscountedPrice = () => {
    if (!campaign) return null;
    
    let discountedPrice = treatment.price_from;
    
    if (campaign.discount_percentage) {
      discountedPrice = treatment.price_from * (1 - campaign.discount_percentage / 100);
    } else if (campaign.discount_amount) {
      discountedPrice = treatment.price_from - campaign.discount_amount;
    }
    
    return discountedPrice;
  };

  const handleBookNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check rate limiting for booking requests
    const canProceed = await checkRateLimit('booking', 5, 10); // 5 requests per 10 minutes
    if (!canProceed) return;

    if (!user) {
      // Redirect to auth if not logged in
      window.location.href = `/auth?redirect=${encodeURIComponent(`/booking/${treatment.id}`)}`;
      return;
    }

    onBookNow(e);
  };

  const discountedPrice = getDiscountedPrice();

  return (
    <div className="border-t pt-4 space-y-4">
      {/* Price */}
      <div className="text-center">
        {discountedPrice ? (
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-600">
              {treatment.currency} {discountedPrice.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 line-through">
              {treatment.currency} {treatment.price_from?.toLocaleString()}
            </div>
            {campaign && (
              <div className="text-xs text-green-600 font-medium">
                {campaign.discount_percentage 
                  ? `%${campaign.discount_percentage} İndirim`
                  : `${campaign.discount_amount} ${treatment.currency} İndirim`
                }
              </div>
            )}
          </div>
        ) : (
          <div className="text-2xl font-bold text-blue-600">
            {formatPrice()}
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {onViewDetails && (
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Detaylar
          </Button>
        )}
        <Button
          onClick={handleBookNow}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Rezervasyon Yap
        </Button>
      </div>
    </div>
  );
};

export default TreatmentCardPricing;
