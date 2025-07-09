
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Calendar, Star, TrendingUp, Package } from 'lucide-react';
import { Treatment, TreatmentPackage } from './types';

interface TreatmentCardContentProps {
  treatment: Treatment;
  packages: TreatmentPackage[];
}

const TreatmentCardContent: React.FC<TreatmentCardContentProps> = ({ 
  treatment, 
  packages 
}) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      'hair_transplant': 'bg-blue-100 text-blue-800',
      'dental': 'bg-green-100 text-green-800',
      'cosmetic_surgery': 'bg-purple-100 text-purple-800',
      'eye_surgery': 'bg-orange-100 text-orange-800',
      'orthopedic': 'bg-red-100 text-red-800',
      'fertility': 'bg-pink-100 text-pink-800',
      'cardiology': 'bg-indigo-100 text-indigo-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  return (
    <>
      {/* Category Badge */}
      <div className="flex items-start justify-between">
        <Badge 
          className={`${getCategoryColor(treatment.category)} text-xs font-medium px-3 py-1 uppercase tracking-wide`} 
          variant="secondary"
        >
          {treatment.category.replace('_', ' ')}
        </Badge>
      </div>
      
      {/* Treatment Title */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {treatment.name}
        </h3>
      </div>
      
      {/* Clinic Location */}
      <div className="flex items-center gap-2 text-gray-600">
        <MapPin className="w-4 h-4 flex-shrink-0" />
        <div className="flex flex-col text-sm">
          <span className="font-medium text-gray-900">{treatment.clinics?.name}</span>
          <span>{treatment.clinics?.city}, {treatment.clinics?.country}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
        {treatment.description}
      </p>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{treatment.duration_days} days</div>
            <div className="text-xs text-gray-500">Duration</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
            <Calendar className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{treatment.recovery_days} days</div>
            <div className="text-xs text-gray-500">Recovery</div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex items-center justify-between text-sm">
        {treatment.success_rate && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-gray-600">{treatment.success_rate}% success</span>
          </div>
        )}
        
        {treatment.clinics?.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-medium text-gray-900">{treatment.clinics.rating}</span>
            <span className="text-gray-500">({treatment.clinics.review_count})</span>
          </div>
        )}
      </div>

      {/* Features */}
      {treatment.features && treatment.features.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {treatment.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                {feature}
              </Badge>
            ))}
            {treatment.features.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-200">
                +{treatment.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Package Info */}
      {packages.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
          <Package className="w-4 h-4" />
          <span className="font-medium">{packages.length} package{packages.length > 1 ? 's' : ''} available</span>
        </div>
      )}
    </>
  );
};

export default TreatmentCardContent;
