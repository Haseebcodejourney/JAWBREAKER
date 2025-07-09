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
  Calendar,
  Clock,
  Euro,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Treatment {
  id: string;
  name: string;
  description: string;
  category: string;
  price_from: number;
  price_to: number;
  currency: string;
  duration_days: number;
  recovery_days: number;
  created_at: string;
  active: boolean;
  success_rate?: number;
  features?: string[];
  included_services?: string[];
  prerequisites?: string[];
  procedure_steps?: string[];
  recovery_instructions?: string;
  images?: string[];
  clinics: {
    name: string;
    city: string;
    country: string;
  };
}

interface TreatmentApprovalProps {
  treatment: Treatment;
  onStatusChange: () => void;
}

const TreatmentApproval: React.FC<TreatmentApprovalProps> = ({ treatment, onStatusChange }) => {
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('treatments')
        .update({ 
          active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', treatment.id);

      if (error) throw error;
      
      toast({
        title: "Tedavi Onaylandı",
        description: `${treatment.name} onaylandı ve artık aktif.`,
      });
      
      onStatusChange();
      setShowApprovalDialog(false);
      setApprovalNotes('');
    } catch (error) {
      console.error('Error approving treatment:', error);
      toast({
        title: "Onaylama Hatası",
        description: "Tedavi onaylanırken hata oluştu. Lütfen tekrar deneyin.",
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
        .from('treatments')
        .delete()
        .eq('id', treatment.id);

      if (error) throw error;
      
      toast({
        title: "Tedavi Reddedildi",
        description: `${treatment.name} reddedildi ve kaldırıldı.`,
      });
      
      onStatusChange();
      setShowRejectionDialog(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting treatment:', error);
      toast({
        title: "Reddetme Hatası",
        description: "Tedavi reddedilirken hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = () => {
    setShowDetailsDialog(true);
  };

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      'hair_transplant': 'Saç Ekimi',
      'dental': 'Diş Tedavisi',
      'eye_surgery': 'Göz Ameliyatı',
      'plastic_surgery': 'Plastik Cerrahi',
      'weight_loss': 'Kilo Verme'
    };
    return categories[category] || category;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{treatment.name}</CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{treatment.clinics.name}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{treatment.clinics.city}, {treatment.clinics.country}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Onay Bekliyor
            </Badge>
            <Badge variant="outline">
              {getCategoryLabel(treatment.category)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold mb-3">Tedavi Detayları</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Euro className="w-4 h-4 text-gray-500" />
                <span>
                  Fiyat: {treatment.price_from.toLocaleString()} - {treatment.price_to.toLocaleString()} {treatment.currency}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Süre: {treatment.duration_days} gün</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>İyileşme: {treatment.recovery_days} gün</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Başvuru: {new Date(treatment.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Klinik Bilgesi</h4>
            <div className="text-sm">
              <div className="font-medium">{treatment.clinics.name}</div>
              <div className="text-gray-600">{treatment.clinics.city}, {treatment.clinics.country}</div>
            </div>
          </div>
        </div>

        {treatment.description && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Açıklama</h4>
            <p className="text-sm text-gray-600">{treatment.description}</p>
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
                <DialogTitle>Tedaviyi Onayla</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p><strong>{treatment.name}</strong> tedavisini onaylamak istediğinizden emin misiniz? Hastalara görünür hale gelacektir.</p>
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
                <DialogTitle>Tedaviyi Reddet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p><strong>{treatment.name}</strong> tedavisini reddetme sebebinizi belirtin:</p>
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

          <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleViewDetails}>
                <Eye className="w-4 h-4 mr-2" />
                Detayları Görüntüle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{treatment.name} - Detaylı Bilgiler</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Tedavi Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Kategori:</strong> {getCategoryLabel(treatment.category)}</div>
                    <div><strong>Para Birimi:</strong> {treatment.currency}</div>
                    <div><strong>Fiyat Aralığı:</strong> {treatment.price_from.toLocaleString()} - {treatment.price_to.toLocaleString()} {treatment.currency}</div>
                    <div><strong>Süre:</strong> {treatment.duration_days} gün</div>
                    <div><strong>İyileşme Süresi:</strong> {treatment.recovery_days} gün</div>
                    <div><strong>Başarı Oranı:</strong> {treatment.success_rate ? `%${treatment.success_rate}` : 'Belirtilmemiş'}</div>
                    <div><strong>Durum:</strong> {treatment.active ? 'Aktif' : 'Pasif'}</div>
                    <div><strong>Oluşturma Tarihi:</strong> {new Date(treatment.created_at).toLocaleDateString('tr-TR')}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Klinik Bilgileri</h4>
                  <div className="text-sm">
                    <div><strong>Klinik:</strong> {treatment.clinics.name}</div>
                    <div><strong>Konum:</strong> {treatment.clinics.city}, {treatment.clinics.country}</div>
                  </div>
                </div>

                {treatment.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Açıklama</h4>
                    <p className="text-sm text-gray-600">{treatment.description}</p>
                  </div>
                )}

                {treatment.features && treatment.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Özellikler</h4>
                    <div className="flex flex-wrap gap-2">
                      {treatment.features.map((feature, index) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {treatment.included_services && treatment.included_services.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Dahil Edilen Hizmetler</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {treatment.included_services.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {treatment.prerequisites && treatment.prerequisites.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Ön Koşullar</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {treatment.prerequisites.map((prerequisite, index) => (
                        <li key={index}>{prerequisite}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {treatment.procedure_steps && treatment.procedure_steps.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">İşlem Adımları</h4>
                    <ol className="list-decimal list-inside text-sm space-y-1">
                      {treatment.procedure_steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {treatment.recovery_instructions && (
                  <div>
                    <h4 className="font-semibold mb-2">İyileşme Talimatları</h4>
                    <p className="text-sm text-gray-600">{treatment.recovery_instructions}</p>
                  </div>
                )}

                {treatment.images && treatment.images.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Tedavi Görselleri</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {treatment.images.slice(0, 4).map((image, index) => (
                        <img 
                          key={index}
                          src={image} 
                          alt={`${treatment.name} - ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg cursor-pointer"
                          onClick={() => window.open(image, '_blank')}
                        />
                      ))}
                    </div>
                    {treatment.images.length > 4 && (
                      <p className="text-xs text-gray-500 mt-2">
                        +{treatment.images.length - 4} daha fazla görsel
                      </p>
                    )}
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

export default TreatmentApproval;
