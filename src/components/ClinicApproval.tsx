import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Check, 
  X, 
  Eye, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Users,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Clinic {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  established_year: number;
  staff_count: number;
  accreditations: string[];
  logo_url: string;
  cover_image_url: string;
  created_at: string;
  total_patients: number;
  response_time_hours: number;
  specialties: string[];
  languages: string[];
  insurance_accepted: string[];
  transfer_services: boolean;
  hotel_partnerships: boolean;
  virtual_tour_url: string;
  video_tour_url: string;
}

interface ClinicApprovalProps {
  clinic: Clinic;
  onStatusChange: () => void;
}

const ClinicApproval: React.FC<ClinicApprovalProps> = ({
  clinic,
  onStatusChange
}) => {
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [infoRequest, setInfoRequest] = useState('');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('clinics')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', clinic.id);

      if (error) throw error;
      
      toast({
        title: "Klinik Onaylandı",
        description: `${clinic.name} başarıyla onaylandı.`,
      });
      
      onStatusChange();
      setShowApprovalDialog(false);
      setApprovalNotes('');
    } catch (error) {
      console.error('Error approving clinic:', error);
      toast({
        title: "Onaylama Hatası",
        description: "Klinik onaylanırken hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('clinics')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', clinic.id);

      if (error) throw error;
      
      toast({
        title: "Klinik Reddedildi",
        description: `${clinic.name} reddedildi.`,
      });
      
      onStatusChange();
      setShowRejectionDialog(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting clinic:', error);
      toast({
        title: "Reddetme Hatası",
        description: "Klinik reddedilirken hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestInfo = async () => {
    if (!infoRequest.trim()) return;
    
    setIsLoading(true);
    try {
      // Create a conversation for the info request
      const { error } = await supabase
        .from('conversations')
        .insert({
          clinic_id: clinic.id,
          subject: `Bilgi Talebi - ${clinic.name}`,
          status: 'active',
          priority: 'high'
        });

      if (error) throw error;

      toast({
        title: "Bilgi Talep Edildi",
        description: `${clinic.name} klinikine bilgi talebi gönderildi.`,
      });
      
      setShowInfoDialog(false);
      setInfoRequest('');
    } catch (error) {
      console.error('Error requesting info:', error);
      toast({
        title: "Bilgi Talebi Hatası",
        description: "Bilgi talebi gönderilirken hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = () => {
    setShowDetailsDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-600 text-white';
      case 'rejected': return 'bg-red-600 text-white';
      case 'pending': return 'bg-yellow-600 text-white';
      case 'suspended': return 'bg-orange-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      case 'pending': return 'Beklemede';
      case 'suspended': return 'Askıya Alındı';
      default: return status;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            {clinic.logo_url && (
              <img 
                src={clinic.logo_url} 
                alt={clinic.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <CardTitle className="text-xl">{clinic.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{clinic.city}, {clinic.country}</span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(clinic.status)}>
            {getStatusText(clinic.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold mb-3">İletişim Bilgileri</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{clinic.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{clinic.phone}</span>
              </div>
              {clinic.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span>{clinic.website}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Klinik Detayları</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Kuruluş: {clinic.established_year}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span>Personel: {clinic.staff_count}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span>Başvuru: {new Date(clinic.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          </div>
        </div>

        {clinic.description && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Açıklama</h4>
            <p className="text-sm text-gray-600">{clinic.description}</p>
          </div>
        )}

        {clinic.accreditations && clinic.accreditations.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Akreditasyonlar</h4>
            <div className="flex flex-wrap gap-2">
              {clinic.accreditations.map((accreditation, index) => (
                <Badge key={index} variant="outline">
                  {accreditation}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-4 border-t">
          <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                <Check className="w-4 h-4 mr-2" />
                Onayla
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Kliniği Onayla</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p><strong>{clinic.name}</strong> klinikini onaylamak istediğinizden emin misiniz?</p>
                <Textarea
                  placeholder="Onaylama notları (opsiyonel)"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleApprove} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Onaylanıyor...' : 'Onayı Doğrula'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                    İptal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" disabled={isLoading}>
                <X className="w-4 h-4 mr-2" />
                Reddet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Kliniği Reddet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p><strong>{clinic.name}</strong> klinikini reddetme sebebinizi belirtin:</p>
                <Textarea
                  placeholder="Ret sebebi (gerekli)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleReject} 
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!rejectionReason.trim() || isLoading}
                  >
                    {isLoading ? 'Reddediliyor...' : 'Reddi Doğrula'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
                    İptal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={isLoading}>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Bilgi Talep Et
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ek Bilgi Talep Et</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p><strong>{clinic.name}</strong> klinikinden ek bilgi talep edin:</p>
                <Textarea
                  placeholder="Hangi ek bilgilere ihtiyacınız var?"
                  value={infoRequest}
                  onChange={(e) => setInfoRequest(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleRequestInfo} 
                    disabled={!infoRequest.trim() || isLoading}
                  >
                    {isLoading ? 'Gönderiliyor...' : 'Talep Gönder'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowInfoDialog(false)}>
                    İptal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleViewDetails}>
                <Eye className="w-4 h-4 mr-2" />
                Detayları Görüntüle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{clinic.name} - Detaylı Bilgiler</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {clinic.cover_image_url && (
                  <div>
                    <h4 className="font-semibold mb-2">Kapak Fotoğrafı</h4>
                    <img 
                      src={clinic.cover_image_url} 
                      alt={clinic.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2">Genel Bilgiler</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Kuruluş Yılı:</strong> {clinic.established_year}</div>
                    <div><strong>Personel Sayısı:</strong> {clinic.staff_count}</div>
                    <div><strong>Toplam Hasta:</strong> {clinic.total_patients}</div>
                    <div><strong>Yanıt Süresi:</strong> {clinic.response_time_hours} saat</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Adres</h4>
                  <p className="text-sm">{clinic.address}</p>
                </div>

                {clinic.specialties && clinic.specialties.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Uzmanlık Alanları</h4>
                    <div className="flex flex-wrap gap-2">
                      {clinic.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {clinic.languages && clinic.languages.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Konuşulan Diller</h4>
                    <div className="flex flex-wrap gap-2">
                      {clinic.languages.map((language, index) => (
                        <Badge key={index} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {clinic.insurance_accepted && clinic.insurance_accepted.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Kabul Edilen Sigortalar</h4>
                    <div className="flex flex-wrap gap-2">
                      {clinic.insurance_accepted.map((insurance, index) => (
                        <Badge key={index} variant="outline">
                          {insurance}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Ek Hizmetler</h4>
                  <div className="space-y-1 text-sm">
                    <div>Transfer Hizmeti: {clinic.transfer_services ? 'Evet' : 'Hayır'}</div>
                    <div>Otel Ortaklıkları: {clinic.hotel_partnerships ? 'Evet' : 'Hayır'}</div>
                  </div>
                </div>

                {(clinic.virtual_tour_url || clinic.video_tour_url) && (
                  <div>
                    <h4 className="font-semibold mb-2">Sanal Turlar</h4>
                    <div className="space-y-2">
                      {clinic.virtual_tour_url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(clinic.virtual_tour_url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Sanal Tur
                        </Button>
                      )}
                      {clinic.video_tour_url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(clinic.video_tour_url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Video Tur
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicApproval;
