
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Mail, Phone, Calendar, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PatientDetailModalProps {
  patient: any;
  trigger?: React.ReactNode;
}

const PatientDetailModal = ({ patient, trigger }: PatientDetailModalProps) => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['patient-bookings', patient.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          treatments (name),
          clinics (name)
        `)
        .eq('patient_id', patient.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Hasta Detayları</DialogTitle>
          <DialogDescription>
            {patient.first_name} {patient.last_name} - Detaylı Bilgiler
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Kişisel Bilgiler</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{patient.first_name} {patient.last_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{patient.email}</span>
                </div>
                {patient.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                {patient.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{patient.country}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Kayıt: {new Date(patient.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">İstatistikler</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Toplam Rezervasyon:</span>
                  <Badge variant="secondary">{patient.totalBookings}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Son Aktivite:</span>
                  <span className="text-sm">
                    {patient.lastBooking 
                      ? new Date(patient.lastBooking).toLocaleDateString()
                      : 'Yok'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Durum:</span>
                  <Badge 
                    variant={patient.status === 'active' ? 'default' : 'secondary'}
                    className={patient.status === 'active' ? 'bg-green-600' : 'bg-gray-500'}
                  >
                    {patient.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="space-y-2">
            <h4 className="font-medium">Rezervasyon Geçmişi</h4>
            {isLoading ? (
              <div className="text-sm text-gray-500">Yükleniyor...</div>
            ) : bookings && bookings.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {bookings.map((booking: any) => (
                  <div key={booking.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{booking.treatments?.name}</p>
                        <p className="text-xs text-gray-600">{booking.clinics?.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{booking.status}</Badge>
                        <p className="text-sm font-medium mt-1">
                          {booking.currency} {booking.total_amount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">Rezervasyon bulunamadı</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailModal;
