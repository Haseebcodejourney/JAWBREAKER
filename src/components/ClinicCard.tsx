
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star, MapPin, Award, Calendar, MessageCircle } from 'lucide-react';
import ClinicEditModal from '@/components/ClinicEditModal';

interface ClinicCardProps {
  clinic: {
    id: number | string;
    name: string;
    city?: string;
    country?: string;
    cover_image_url?: string;
    logo_url?: string;
    rating: number;
    review_count: number;
    specialties?: string[];
    verified: boolean;
    featured?: boolean;
    description?: string;
    languages?: string[];
    accreditations?: string[];
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
  };
  showEditButton?: boolean;
}

const ClinicCard: React.FC<ClinicCardProps> = ({ clinic, showEditButton = false }) => {
  const location = `${clinic.city || 'Unknown City'}, ${clinic.country || 'Unknown Country'}`;
  const flag = clinic.country === 'Turkey' ? '🇹🇷' : 
              clinic.country === 'Thailand' ? '🇹🇭' : 
              clinic.country === 'India' ? '🇮🇳' :
              clinic.country === 'Mexico' ? '🇲🇽' :
              clinic.country === 'South Korea' ? '🇰🇷' :
              clinic.country === 'Germany' ? '🇩🇪' :
              '🌍';

  // Convert clinic data for ClinicEditModal
  const editableClinic = {
    id: String(clinic.id),
    name: clinic.name,
    description: clinic.description,
    phone: clinic.phone,
    email: clinic.email,
    website: clinic.website,
    address: clinic.address
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={clinic.cover_image_url || 'https://images.unsplash.com/photo-1551601651-767bb2180d49?w=400&h=300&fit=crop'} 
          alt={clinic.name}
          className="w-full h-48 object-cover"
        />
        {clinic.featured && (
          <Badge className="absolute top-2 left-2 bg-orange-500">
            Featured
          </Badge>
        )}
        {clinic.verified && (
          <Badge className="absolute top-2 right-2 bg-green-600">
            Verified
          </Badge>
        )}
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {clinic.logo_url && (
              <img 
                src={clinic.logo_url} 
                alt={`${clinic.name} logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold mb-1">{clinic.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <span className="mr-1">{flag}</span>
                <MapPin className="w-4 h-4 mr-1" />
                <span>{location}</span>
              </div>
              <div className="flex items-center mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="font-medium">{clinic.rating?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-600 ml-1">({clinic.review_count || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {clinic.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{clinic.description}</p>
        )}
        
        {clinic.specialties && clinic.specialties.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {clinic.specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty} variant="secondary">
                  {specialty}
                </Badge>
              ))}
              {clinic.specialties.length > 3 && (
                <Badge variant="secondary">
                  +{clinic.specialties.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {clinic.languages && clinic.languages.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">Languages:</div>
            <div className="text-sm">{clinic.languages.join(', ')}</div>
          </div>
        )}
        
        {clinic.accreditations && clinic.accreditations.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Award className="w-4 h-4 mr-1" />
              Accreditations:
            </div>
            <div className="flex flex-wrap gap-1">
              {clinic.accreditations.slice(0, 2).map((acc) => (
                <Badge key={acc} variant="outline" className="text-xs">
                  {acc}
                </Badge>
              ))}
              {clinic.accreditations.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{clinic.accreditations.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Link to={`/clinic/${clinic.id}`} className="flex-1">
            <Button className="w-full !bg-[#96be25] hover:!bg-[#96be25] text-white">
              View Details
            </Button>
          </Link>
          <Link to={`/booking/${clinic.id}`}>
            <Button variant="outline" className="!border-[#96be25] !text-[##96be25] hover:!bg-[#2596be] hover:!text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="!border-[#96be25] !text-[#96be25] hover:!bg-[#96be25] hover:!text-white">
            <MessageCircle className="w-4 h-4" />
          </Button>
          {showEditButton && (
            <ClinicEditModal clinic={editableClinic} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicCard;
