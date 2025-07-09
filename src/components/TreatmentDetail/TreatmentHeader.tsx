
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Calendar, TrendingUp, Users, CheckCircle } from 'lucide-react';

interface TreatmentHeaderProps {
  treatment: any;
  activeCampaign: any;
  getCategoryLabel: (category: string) => string;
  getCategoryColor: (category: string) => string;
}

const TreatmentHeader: React.FC<TreatmentHeaderProps> = ({
  treatment,
  activeCampaign,
  getCategoryLabel,
  getCategoryColor
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge className={`${getCategoryColor(treatment.category)} text-xs font-medium px-3 py-1`}>
          {getCategoryLabel(treatment.category)}
        </Badge>
        {treatment.clinics?.verified && (
          <Badge className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            Onaylı Klinik
          </Badge>
        )}
        {activeCampaign && (
          <Badge className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1">
            🔥 Özel İndirim
          </Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{treatment.name}</h1>
      
      {/* Clinic Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          <div>
            <div className="font-semibold text-gray-900">{treatment.clinics?.name}</div>
            <div className="text-sm text-gray-600">{treatment.clinics?.city}, {treatment.clinics?.country}</div>
          </div>
        </div>
        
        {treatment.clinics?.rating && (
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
            <span className="font-semibold text-gray-900">{treatment.clinics.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-600 ml-1">({treatment.clinics.review_count || 0})</span>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
          <Clock className="w-5 h-5 text-blue-600 mr-2" />
          <div>
            <div className="font-semibold text-gray-900">{treatment.duration_days}</div>
            <div className="text-xs text-gray-600">Gün Süre</div>
          </div>
        </div>
        <div className="flex items-center p-3 bg-green-50 rounded-lg">
          <Calendar className="w-5 h-5 text-green-600 mr-2" />
          <div>
            <div className="font-semibold text-gray-900">{treatment.recovery_days}</div>
            <div className="text-xs text-gray-600">İyileşme</div>
          </div>
        </div>
        {treatment.success_rate && (
          <div className="flex items-center p-3 bg-purple-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
            <div>
              <div className="font-semibold text-gray-900">%{treatment.success_rate}</div>
              <div className="text-xs text-gray-600">Başarı</div>
            </div>
          </div>
        )}
        <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
          <Users className="w-5 h-5 text-yellow-600 mr-2" />
          <div>
            <div className="font-semibold text-gray-900">{treatment.clinics?.review_count || 0}</div>
            <div className="text-xs text-gray-600">Yorum</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentHeader;
