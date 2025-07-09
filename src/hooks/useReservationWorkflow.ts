
import { useState } from 'react';
import { useBookings } from './useBookings';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export type ReservationStep = 'treatment' | 'datetime' | 'patient-info' | 'payment' | 'confirmation';

export interface ReservationData {
  treatmentId: string;
  clinicId: string;
  preferredDate: string;
  notes?: string;
  patientInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    emergencyContact?: string;
  };
  paymentInfo?: {
    amount: number;
    currency: string;
    paymentMethod: string;
  };
}

export const useReservationWorkflow = () => {
  const [currentStep, setCurrentStep] = useState<ReservationStep>('treatment');
  const [reservationData, setReservationData] = useState<Partial<ReservationData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { createBooking } = useBookings();
  const { toast } = useToast();

  const updateReservationData = (data: Partial<ReservationData>) => {
    setReservationData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    const steps: ReservationStep[] = ['treatment', 'datetime', 'patient-info', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const previousStep = () => {
    const steps: ReservationStep[] = ['treatment', 'datetime', 'patient-info', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const processReservation = async () => {
    if (!reservationData.treatmentId || !reservationData.clinicId || !reservationData.preferredDate) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm gerekli alanları doldurun.",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Create booking
      createBooking({
        treatmentId: reservationData.treatmentId,
        clinicId: reservationData.clinicId,
        preferredDate: reservationData.preferredDate,
        notes: reservationData.notes
      });

      // Update patient profile if needed
      if (reservationData.patientInfo) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .update({
              first_name: reservationData.patientInfo.firstName,
              last_name: reservationData.patientInfo.lastName,
              phone: reservationData.patientInfo.phone
            })
            .eq('id', user.id);
        }
      }

      setCurrentStep('confirmation');
      return true;
    } catch (error) {
      console.error('Reservation processing error:', error);
      toast({
        title: "Rezervasyon Hatası",
        description: "Rezervasyon işlenirken bir hata oluştu.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetWorkflow = () => {
    setCurrentStep('treatment');
    setReservationData({});
    setIsLoading(false);
  };

  return {
    currentStep,
    reservationData,
    isLoading,
    updateReservationData,
    nextStep,
    previousStep,
    processReservation,
    resetWorkflow,
    setCurrentStep
  };
};
