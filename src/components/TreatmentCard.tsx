
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TreatmentCardProps {
  treatment: {
    id: string;
    name: string;
    description: string;
    category: string;
    price_from: number;
    price_to: number;
    currency: string;
    duration_days: number;
    recovery_days: number;
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
  };
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment }) => {
  const navigate = useNavigate();

  const formatPrice = (from: number, to: number, currency: string) => {
    if (from === to) return `${currency} ${from.toLocaleString()}`;
    return `${currency} ${from.toLocaleString()} - ${to.toLocaleString()}`;
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      hair_transplant: 'Hair Transplant',
      dental: 'Dental Care',
      cosmetic_surgery: 'Cosmetic Surgery',
      eye_surgery: 'Eye Surgery',
      orthopedic: 'Orthopedic',
      cardiology: 'Cardiology',
      fertility: 'Fertility',
      other: 'Other'
    };
    return labels[category] || category;
  };

  return (
    <Card className="group cursor-pointer card-hover border-0 shadow-md overflow-hidden h-full">
      <div className="relative">
        <img 
          src={treatment.images?.[0] || '/placeholder.svg'} 
          alt={treatment.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className="!bg-[#96be25] hover:!bg-[#96be25] text-white text-xs">
            {getCategoryLabel(treatment.category)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{treatment.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{treatment.description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{treatment.clinics.name} • {treatment.clinics.city}, {treatment.clinics.country}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>{treatment.duration_days} day{treatment.duration_days > 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-gray-600">
                  {treatment.clinics.rating?.toFixed(1) || 'N/A'} ({treatment.clinics.review_count || 0})
                </span>
              </div>
            </div>
          </div>

          {treatment.features && treatment.features.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {treatment.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {treatment.features.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{treatment.features.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-4 mt-auto">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold text-[#2596be]">
                {formatPrice(treatment.price_from, treatment.price_to, treatment.currency)}
              </span>
            </div>
            <Button 
              onClick={() => navigate(`/treatment/${treatment.id}`)}
              className="!bg-[#96be25] hover:!bg-[#96be25] text-white"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TreatmentCard;
