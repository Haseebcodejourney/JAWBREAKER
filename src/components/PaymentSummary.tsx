
import React from 'react';

interface Treatment {
  name: string;
  price_from?: number;
  currency?: string;
  clinics?: {
    name: string;
  };
}

interface PaymentSummaryProps {
  treatment: Treatment;
  selectedDate: string;
  selectedTime: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  treatment,
  selectedDate,
  selectedTime
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Secure Payment</h3>
        <p className="text-blue-800 text-sm">
          You'll be redirected to our secure payment processor to complete your booking.
          Your payment information is encrypted and secure.
        </p>
      </div>
      
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Payment Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Treatment</span>
            <span>{treatment?.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Clinic</span>
            <span>{treatment?.clinics?.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Date</span>
            <span>{selectedDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Time</span>
            <span>{selectedTime}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-blue-600">
              {treatment?.currency} {treatment?.price_from?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
