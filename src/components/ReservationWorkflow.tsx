
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useReservationWorkflow, ReservationStep } from '@/hooks/useReservationWorkflow';
import { ArrowLeft, ArrowRight, Calendar, CreditCard, User, CheckCircle } from 'lucide-react';

interface ReservationWorkflowProps {
  treatmentId?: string;
  clinicId?: string;
  onComplete?: () => void;
}

const ReservationWorkflow: React.FC<ReservationWorkflowProps> = ({
  treatmentId,
  clinicId,
  onComplete
}) => {
  const {
    currentStep,
    reservationData,
    isLoading,
    nextStep,
    previousStep,
    processReservation,
    resetWorkflow
  } = useReservationWorkflow();

  const steps: { key: ReservationStep; title: string; icon: React.ReactNode }[] = [
    { key: 'treatment', title: 'Tedavi Seçimi', icon: <User className="w-4 h-4" /> },
    { key: 'datetime', title: 'Tarih/Saat', icon: <Calendar className="w-4 h-4" /> },
    { key: 'patient-info', title: 'Hasta Bilgileri', icon: <User className="w-4 h-4" /> },
    { key: 'payment', title: 'Ödeme', icon: <CreditCard className="w-4 h-4" /> },
    { key: 'confirmation', title: 'Onay', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep === 'payment') {
      const success = await processReservation();
      if (success && onComplete) {
        onComplete();
      }
    } else {
      nextStep();
    }
  };

  React.useEffect(() => {
    if (treatmentId && clinicId) {
      // Initialize with provided treatment and clinic
      // This would typically fetch treatment details
    }
  }, [treatmentId, clinicId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Rezervasyon</CardTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              {steps.map((step, index) => (
                <div
                  key={step.key}
                  className={`flex items-center space-x-2 ${
                    index <= currentStepIndex ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {step.icon}
                  <span>{step.title}</span>
                </div>
              ))}
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step Content - This would contain different forms based on currentStep */}
          <div className="min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center space-y-4">
              <div className="text-6xl">
                {steps[currentStepIndex]?.icon}
              </div>
              <h3 className="text-xl font-semibold">
                {steps[currentStepIndex]?.title}
              </h3>
              <p className="text-gray-600">
                {currentStep === 'treatment' && 'Tedavi ve klinik seçiminizi yapın'}
                {currentStep === 'datetime' && 'Randevu tarihi ve saatinizi seçin'}
                {currentStep === 'patient-info' && 'Hasta bilgilerinizi girin'}
                {currentStep === 'payment' && 'Ödeme bilgilerinizi girin'}
                {currentStep === 'confirmation' && 'Rezervasyonunuz tamamlandı!'}
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousStep}
              disabled={currentStepIndex === 0 || currentStep === 'confirmation'}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri</span>
            </Button>

            <div className="flex space-x-2">
              {currentStep === 'confirmation' ? (
                <Button onClick={resetWorkflow}>
                  Yeni Rezervasyon
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <span>
                    {currentStep === 'payment' ? 'Ödemeyi Tamamla' : 'İleri'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationWorkflow;
