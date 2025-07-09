
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Calendar, 
  Award, 
  Video, 
  MessageCircle,
  Star,
  Languages
} from 'lucide-react';
import DoctorEditModal from '@/components/DoctorEditModal';

interface DoctorProfile {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  specialization: string;
  education: string[];
  certifications: string[];
  years_experience: number;
  bio: string;
  profile_image_url: string;
  languages: string[];
  consultation_fee: number;
  available_online: boolean;
  clinics?: {
    id: string;
    name: string;
    city: string;
    country: string;
  };
}

interface DoctorProfileCardProps {
  doctor: DoctorProfile;
  onConsultation?: (doctorId: string) => void;
  onMessage?: (doctorId: string) => void;
  compact?: boolean;
  showEditButton?: boolean;
}

const DoctorProfileCard: React.FC<DoctorProfileCardProps> = ({
  doctor,
  onConsultation,
  onMessage,
  compact = false,
  showEditButton = false
}) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatLanguages = (languages: string[]) => {
    const langMap: { [key: string]: string } = {
      'en': 'English',
      'tr': 'Turkish',
      'ar': 'Arabic',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German'
    };
    
    return languages.map(lang => langMap[lang] || lang).join(', ');
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className={compact ? "pb-3" : "pb-4"}>
        <div className="flex items-start gap-4">
          <Avatar className={compact ? "w-12 h-12" : "w-16 h-16"}>
            <AvatarImage src={doctor.profile_image_url} alt={`${doctor.first_name} ${doctor.last_name}`} />
            <AvatarFallback>{getInitials(doctor.first_name, doctor.last_name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold ${compact ? 'text-base' : 'text-lg'}`}>
                {doctor.title} {doctor.first_name} {doctor.last_name}
              </h3>
              {doctor.available_online && (
                <Badge variant="secondary" className="text-xs">
                  <Video className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{doctor.specialization}</p>
            
            {doctor.clinics && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                {doctor.clinics.name}, {doctor.clinics.city}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {doctor.years_experience}+ years
              </div>
              
              {doctor.languages && doctor.languages.length > 0 && (
                <div className="flex items-center gap-1">
                  <Languages className="w-4 h-4" />
                  <span className="truncate">{formatLanguages(doctor.languages)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      {!compact && (
        <CardContent className="space-y-4">
          {doctor.bio && (
            <p className="text-sm text-gray-600 line-clamp-3">{doctor.bio}</p>
          )}
          
          {doctor.certifications && doctor.certifications.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Certifications</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {doctor.certifications.slice(0, 3).map((cert, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
                {doctor.certifications.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{doctor.certifications.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm">
              {doctor.consultation_fee && (
                <span className="font-medium text-blue-600">
                  ${doctor.consultation_fee} consultation
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              {onMessage && (
                <Button variant="outline" size="sm" onClick={() => onMessage(doctor.id)}>
                  <MessageCircle className="w-4 h-4" />
                </Button>
              )}
              {onConsultation && (
                <Button size="sm" onClick={() => onConsultation(doctor.id)}>
                  Book Consultation
                </Button>
              )}
              {showEditButton && (
                <DoctorEditModal doctor={doctor} />
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DoctorProfileCard;
