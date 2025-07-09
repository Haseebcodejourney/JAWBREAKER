import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTreatment } from '@/hooks/useTreatments';
import { useStripe } from '@/hooks/useStripe';
import BookingProgressSteps from '@/components/BookingProgressSteps';
import DateTimeSelection from '@/components/DateTimeSelection';
import PatientInformation from '@/components/PatientInformation';
import PaymentSummary from '@/components/PaymentSummary';
import BookingSummaryCard from '@/components/BookingSummaryCard';

const BookingFlow = () => {
  const { treatmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: treatment, isLoading } = useTreatment(treatmentId || '');
  const { createCheckoutSession, isProcessing } = useStripe();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedDate: '',
    selectedTime: '',
    patientInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: '',
      medicalHistory: ''
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user && treatment) {
      setFormData(prev => ({
        ...prev,
        patientInfo: {
          ...prev.patientInfo,
          firstName: user.user_metadata?.first_name || '',
          lastName: user.user_metadata?.last_name || '',
          email: user.email || ''
        }
      }));
    }
  }, [user, treatment, navigate]);

  const handleNext = async () => {
    if (currentStep === 3) {
      try {
        const { data: booking, error } = await supabase
          .from('bookings')
          .insert({
            patient_id: user?.id,
            clinic_id: treatment?.clinic_id,
            treatment_id: treatmentId,
            preferred_date: formData.selectedDate,
            total_amount: treatment?.price_from || 0,
            currency: treatment?.currency || 'USD',
            status: 'pending',
            payment_status: 'pending',
            notes: `Appointment scheduled for ${formData.selectedTime}`
          })
          .select()
          .single();

        if (error) throw error;

        await createCheckoutSession({
          bookingId: booking.id,
          treatmentName: treatment?.name || 'Medical Treatment',
          clinicName: treatment?.clinics?.name || 'Medical Clinic',
          amount: treatment?.price_from || 0,
          currency: treatment?.currency || 'USD'
        });
        
      } catch (error) {
        console.error('Error creating booking:', error);
        toast({
          title: "Booking Error",
          description: "There was an error processing your booking. Please try again.",
          variant: "destructive"
        });
      }
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DateTimeSelection
            selectedDate={formData.selectedDate}
            selectedTime={formData.selectedTime}
            onDateChange={(date) => setFormData({ ...formData, selectedDate: date })}
            onTimeChange={(time) => setFormData({ ...formData, selectedTime: time })}
          />
        );
      case 2:
        return (
          <PatientInformation
            patientInfo={formData.patientInfo}
            onPatientInfoChange={(patientInfo) => setFormData({ ...formData, patientInfo })}
            clinicId={treatment?.clinic_id}
          />
        );
      case 3:
        return (
          <PaymentSummary
            treatment={treatment}
            selectedDate={formData.selectedDate}
            selectedTime={formData.selectedTime}
          />
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.selectedDate && formData.selectedTime;
      case 2:
        return formData.patientInfo.firstName && formData.patientInfo.lastName && formData.patientInfo.email;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Treatment not found.</p>
          <Button onClick={() => navigate('/treatments')}>
            Browse Treatments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookingProgressSteps currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && 'Select Date & Time'}
                  {currentStep === 2 && 'Patient Information'}
                  {currentStep === 3 && 'Payment'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderStepContent()}

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1 || isProcessing}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid() || isProcessing}
                  >
                    {isProcessing ? 'Processing...' : currentStep === 3 ? 'Proceed to Payment' : 'Next'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <BookingSummaryCard
              treatment={treatment}
              selectedDate={formData.selectedDate}
              selectedTime={formData.selectedTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
