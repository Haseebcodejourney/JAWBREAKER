
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Hotel, 
  Car, 
  Plane, 
  FileText, 
  ExternalLink,
  MapPin,
  DollarSign
} from 'lucide-react';

interface TravelService {
  id: string;
  service_type: string;
  provider_name: string;
  service_name: string;
  description: string;
  price_from: number;
  price_to: number;
  currency: string;
  booking_url: string;
  contact_info: any;
  clinics?: {
    id: string;
    name: string;
    city: string;
    country: string;
  };
}

interface TravelServiceCardProps {
  service: TravelService;
  onBook?: (serviceId: string) => void;
}

const TravelServiceCard: React.FC<TravelServiceCardProps> = ({
  service,
  onBook
}) => {
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <Hotel className="w-5 h-5" />;
      case 'transfer': return <Car className="w-5 h-5" />;
      case 'flight': return <Plane className="w-5 h-5" />;
      case 'visa_assistance': return <FileText className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'hotel': return 'Hotel';
      case 'transfer': return 'Transfer';
      case 'flight': return 'Flight';
      case 'visa_assistance': return 'Visa Assistance';
      default: return type;
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'hotel': return 'bg-blue-100 text-blue-800';
      case 'transfer': return 'bg-green-100 text-green-800';
      case 'flight': return 'bg-purple-100 text-purple-800';
      case 'visa_assistance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPriceRange = () => {
    if (service.price_from && service.price_to) {
      if (service.price_from === service.price_to) {
        return `${service.currency} ${service.price_from}`;
      }
      return `${service.currency} ${service.price_from} - ${service.price_to}`;
    }
    if (service.price_from) {
      return `From ${service.currency} ${service.price_from}`;
    }
    return 'Contact for pricing';
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              {getServiceIcon(service.service_type)}
            </div>
            <div>
              <CardTitle className="text-lg">{service.service_name}</CardTitle>
              <p className="text-sm text-gray-600">{service.provider_name}</p>
            </div>
          </div>
          <Badge className={getServiceTypeColor(service.service_type)}>
            {getServiceTypeLabel(service.service_type)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {service.description && (
          <p className="text-sm text-gray-600">{service.description}</p>
        )}
        
        {service.clinics && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            Near {service.clinics.name}, {service.clinics.city}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-600">
              {formatPriceRange()}
            </span>
          </div>
          
          <div className="flex gap-2">
            {service.booking_url && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(service.booking_url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Book Direct
              </Button>
            )}
            {onBook && (
              <Button size="sm" onClick={() => onBook(service.id)}>
                Book Through Us
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelServiceCard;
