
import React from 'react';
import { Calendar, Clock, User, CreditCard } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface BookingProgressStepsProps {
  currentStep: number;
}

const BookingProgressSteps: React.FC<BookingProgressStepsProps> = ({ currentStep }) => {
  const steps: Step[] = [
    { id: 1, title: 'Select Date & Time', icon: Calendar },
    { id: 2, title: 'Patient Information', icon: User },
    { id: 3, title: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-gray-300 text-gray-300'
            }`}>
              <step.icon className="w-5 h-5" />
            </div>
            <span className={`ml-2 text-sm font-medium ${
              currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingProgressSteps;
