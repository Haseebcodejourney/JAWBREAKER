
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit } from 'lucide-react';

interface DoctorEditModalProps {
  doctor: {
    id: string;
    first_name: string;
    last_name: string;
    title?: string;
    specialization: string;
    bio?: string;
    consultation_fee?: number;
  };
  onUpdate?: () => void;
}

const DoctorEditModal: React.FC<DoctorEditModalProps> = ({ doctor, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: doctor.first_name,
    last_name: doctor.last_name,
    title: doctor.title || '',
    specialization: doctor.specialization,
    bio: doctor.bio || '',
    consultation_fee: doctor.consultation_fee || 0
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('doctor_profiles')
        .update(formData)
        .eq('id', doctor.id);

      if (error) throw error;

      toast({
        title: "Doctor Profile Updated",
        description: "Doctor profile has been updated successfully.",
      });

      setIsOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update doctor profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit Doctor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Doctor Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Dr., Prof. etc."
              />
            </div>
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                placeholder="First name"
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                placeholder="Last name"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              placeholder="Enter specialization"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="bio">Biography</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Enter doctor's biography"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="consultation_fee">Consultation Fee ($)</Label>
            <Input
              id="consultation_fee"
              type="number"
              value={formData.consultation_fee}
              onChange={(e) => setFormData({...formData, consultation_fee: parseFloat(e.target.value) || 0})}
              placeholder="Enter consultation fee"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorEditModal;
