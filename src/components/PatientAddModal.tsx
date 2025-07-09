
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const patientFormSchema = z.object({
  first_name: z.string().min(1, 'Ad gerekli'),
  last_name: z.string().min(1, 'Soyad gerekli'),
  email: z.string().email('Geçerli bir email adresi girin'),
  phone: z.string().optional(),
  country: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

interface PatientAddModalProps {
  onPatientAdded?: () => void;
}

const PatientAddModal: React.FC<PatientAddModalProps> = ({ onPatientAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      country: '',
    },
  });

  const handleSubmit = async (data: PatientFormData) => {
    setIsLoading(true);

    try {
      // Generate a UUID for the new profile
      const newId = crypto.randomUUID();

      // Create a new user profile directly in the profiles table
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: newId,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone || null,
          country: data.country || null,
          role: 'patient',
        });

      if (error) throw error;

      toast({
        title: "Hasta Eklendi",
        description: "Yeni hasta başarıyla sisteme eklendi.",
      });

      form.reset();
      setIsOpen(false);
      onPatientAdded?.();
    } catch (error) {
      console.error('Error adding patient:', error);
      toast({
        title: "Hata",
        description: "Hasta eklenirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Yeni Hasta Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Hasta Ekle</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ad girin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soyad *</FormLabel>
                    <FormControl>
                      <Input placeholder="Soyad girin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email adresi girin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefon numarası girin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ülke</FormLabel>
                  <FormControl>
                    <Input placeholder="Ülke girin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Ekleniyor...' : 'Hasta Ekle'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PatientAddModal;
