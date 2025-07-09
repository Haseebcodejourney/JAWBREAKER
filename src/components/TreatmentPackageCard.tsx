
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Users, Calendar, Star } from 'lucide-react';

interface TreatmentPackage {
  id: string;
  name: string;
  package_type: string;
  description: string;
  price: number;
  currency: string;
  includes: string[];
  excludes: string[];
  duration_days: number;
  max_participants: number;
  treatments?: {
    id: string;
    name: string;
    category: string;
  };
}

interface TreatmentPackageCardProps {
  package: TreatmentPackage;
  onSelect?: (packageId: string) => void;
  isSelected?: boolean;
}

const TreatmentPackageCard: React.FC<TreatmentPackageCardProps> = ({
  package: pkg,
  onSelect,
  isSelected = false
}) => {
  const getPackageTypeLabel = (type: string) => {
    switch (type) {
      case 'standard': return 'Standard';
      case 'vip': return 'VIP';
      case 'all_inclusive': return 'All Inclusive';
      case 'family': return 'Family Package';
      default: return type;
    }
  };

  const getPackageTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'all_inclusive': return 'bg-green-100 text-green-800';
      case 'family': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`relative transition-all duration-200 ${
      isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
    }`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{pkg.name}</CardTitle>
            <Badge className={`mt-2 ${getPackageTypeColor(pkg.package_type)}`}>
              {getPackageTypeLabel(pkg.package_type)}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {pkg.currency} {pkg.price.toLocaleString()}
            </div>
            {pkg.package_type === 'vip' && (
              <div className="flex items-center text-yellow-500 text-sm mt-1">
                <Star className="w-4 h-4 mr-1" />
                Premium
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {pkg.description && (
          <p className="text-gray-600 text-sm">{pkg.description}</p>
        )}
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {pkg.duration_days} days
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            Up to {pkg.max_participants} {pkg.max_participants === 1 ? 'person' : 'people'}
          </div>
        </div>

        {pkg.includes && pkg.includes.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Included:</h4>
            <div className="space-y-1">
              {pkg.includes.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
              {pkg.includes.length > 3 && (
                <div className="text-sm text-gray-500">
                  +{pkg.includes.length - 3} more included
                </div>
              )}
            </div>
          </div>
        )}

        {onSelect && (
          <Button 
            onClick={() => onSelect(pkg.id)}
            variant={isSelected ? "default" : "outline"}
            className="w-full"
          >
            {isSelected ? 'Selected' : 'Select Package'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TreatmentPackageCard;
