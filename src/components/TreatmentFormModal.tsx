
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCreateTreatment, useUpdateTreatment } from '@/hooks/useTreatmentOperations';

interface TreatmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  treatment?: any;
  clinicId: string;
  onSuccess?: () => void;
}

const TreatmentFormModal = ({ 
  open, 
  onOpenChange, 
  treatment, 
  clinicId,
  onSuccess 
}: TreatmentFormModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price_from: '',
    price_to: '',
    duration_days: '',
    recovery_days: '',
    success_rate: '',
    active: true
  });

  const createMutation = useCreateTreatment();
  const updateMutation = useUpdateTreatment();

  useEffect(() => {
    if (treatment) {
      setFormData({
        name: treatment.name || '',
        category: treatment.category || '',
        description: treatment.description || '',
        price_from: treatment.price_from?.toString() || '',
        price_to: treatment.price_to?.toString() || '',
        duration_days: treatment.duration_days?.toString() || '',
        recovery_days: treatment.recovery_days?.toString() || '',
        success_rate: treatment.success_rate?.toString() || '',
        active: treatment.active ?? true
      });
    } else {
      setFormData({
        name: '',
        category: '',
        description: '',
        price_from: '',
        price_to: '',
        duration_days: '',
        recovery_days: '',
        success_rate: '',
        active: true
      });
    }
  }, [treatment, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const treatmentData = {
      ...formData,
      clinic_id: clinicId,
      price_from: formData.price_from ? parseFloat(formData.price_from) : null,
      price_to: formData.price_to ? parseFloat(formData.price_to) : null,
      duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
      recovery_days: formData.recovery_days ? parseInt(formData.recovery_days) : null,
      success_rate: formData.success_rate ? parseFloat(formData.success_rate) : null,
    };

    try {
      if (treatment) {
        await updateMutation.mutateAsync({ id: treatment.id, ...treatmentData });
      } else {
        await createMutation.mutateAsync(treatmentData);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving treatment:', error);
    }
  };

  const treatmentCategories = [
    'dental',
    'cosmetic_surgery',
    'hair_transplant',
    'orthopedic',
    'cardiac',
    'oncology',
    'fertility',
    'ophthalmology'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {treatment ? 'Tedavi Düzenle' : 'Yeni Tedavi Ekle'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tedavi Adı *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {treatmentCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_from">Minimum Fiyat (USD)</Label>
              <Input
                id="price_from"
                type="number"
                step="0.01"
                value={formData.price_from}
                onChange={(e) => setFormData(prev => ({ ...prev, price_from: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price_to">Maksimum Fiyat (USD)</Label>
              <Input
                id="price_to"
                type="number"
                step="0.01"
                value={formData.price_to}
                onChange={(e) => setFormData(prev => ({ ...prev, price_to: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration_days">Tedavi Süresi (gün)</Label>
              <Input
                id="duration_days"
                type="number"
                value={formData.duration_days}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_days: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recovery_days">İyileşme Süresi (gün)</Label>
              <Input
                id="recovery_days"
                type="number"
                value={formData.recovery_days}
                onChange={(e) => setFormData(prev => ({ ...prev, recovery_days: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="success_rate">Başarı Oranı (%)</Label>
              <Input
                id="success_rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.success_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, success_rate: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="active">Aktif</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TreatmentFormModal;
