
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTreatment } from '@/hooks/useTreatments';
import { usePriceCampaigns } from '@/hooks/usePriceCampaigns';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRateLimiting } from '@/hooks/useRateLimiting';
import TreatmentHeader from '@/components/TreatmentDetail/TreatmentHeader';
import TreatmentGallery from '@/components/TreatmentDetail/TreatmentGallery';
import TreatmentTabs from '@/components/TreatmentDetail/TreatmentTabs';
import BookingCard from '@/components/TreatmentDetail/BookingCard';
import Breadcrumb from '@/components/TreatmentDetail/Breadcrumb';
import { getCategoryLabel, getCategoryColor, getDiscountedPrice } from '@/components/TreatmentDetail/utils';

const TreatmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { checkRateLimit } = useRateLimiting();
  const { data: treatment, isLoading, error } = useTreatment(id!);
  const { data: campaigns } = usePriceCampaigns();

  const activeCampaign = campaigns?.find(c => c.treatment_id === id);
  const discountedPrice = getDiscountedPrice(treatment, activeCampaign);

  const handleBookNow = async () => {
    const canProceed = await checkRateLimit('booking', 3, 10);
    if (!canProceed) return;

    if (!user) {
      navigate(`/auth?redirect=${encodeURIComponent(`/booking/${id}`)}`);
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="h-96 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !treatment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tedavi Bulunamadı</h2>
            <p className="text-gray-600 mb-8">Aradığınız tedavi mevcut değil veya kaldırılmış olabilir.</p>
            <Button onClick={() => navigate('/treatments')} className="bg-blue-600 hover:bg-blue-700">
              Tüm Tedavileri Görüntüle
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb
          treatmentName={treatment.name}
          onNavigateHome={() => navigate('/')}
          onNavigateTreatments={() => navigate('/treatments')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <TreatmentHeader
              treatment={treatment}
              activeCampaign={activeCampaign}
              getCategoryLabel={getCategoryLabel}
              getCategoryColor={getCategoryColor}
            />

            <TreatmentGallery treatment={treatment} />

            <TreatmentTabs treatment={treatment} />
          </div>

          <div className="lg:col-span-1">
            <BookingCard
              treatment={treatment}
              activeCampaign={activeCampaign}
              discountedPrice={discountedPrice}
              getCategoryLabel={getCategoryLabel}
              handleBookNow={handleBookNow}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentDetail;
