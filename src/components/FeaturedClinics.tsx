
import React from 'react';
import { useClinics } from '@/hooks/useClinics';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Award, Users } from 'lucide-react';

const FeaturedClinics = () => {
  const navigate = useNavigate();
  const { data: clinics, isLoading, error } = useClinics();

  // Filter to get only featured clinics (first 6)
  const featuredClinics = clinics?.filter(clinic => clinic.featured)?.slice(0, 6) || [];

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <LoadingSkeleton className="h-8 w-64 mx-auto mb-4" />
            <LoadingSkeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !featuredClinics?.length) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Featured Clinics
          </h2>
          <EmptyState
            icon={<Award className="w-12 h-12" />}
            title="No Featured Clinics Available"
            description="We're working on featuring amazing clinics. Check back soon!"
            action={{
              label: "Browse All Clinics",
              onClick: () => navigate('/search')
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Medical Clinics
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of top-rated medical facilities 
            offering world-class treatments and exceptional patient care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/clinics/${clinic.id}`)}
            >
              <div className="relative">
                <img
                  src={clinic.cover_image_url || '/placeholder.svg'}
                  alt={clinic.name}
                  className="w-full h-48 object-cover"
                />
                {clinic.verified && (
                  <div className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded" style={{ backgroundColor: '#96be25' }}>
                    Verified
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {clinic.name}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {clinic.city}, {clinic.country}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">
                      {clinic.rating?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({clinic.review_count || 0})
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    className="btn-primary text-xs px-3 py-1"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            className="border-[#2596be] text-[#2596be] hover:bg-[#2596be] hover:text-white"
            onClick={() => navigate('/search')}
          >
            View All Clinics
          </Button>
        </div>
      </div>
    </section>
  );

};

export default FeaturedClinics;
