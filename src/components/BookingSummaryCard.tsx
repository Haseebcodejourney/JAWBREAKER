
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

interface Treatment {
  name: string;
  price_from?: number;
  currency?: string;
  clinics?: {
    name: string;
  };
}

interface BookingSummaryCardProps {
  treatment: Treatment;
  selectedDate: string;
  selectedTime: string;
}

const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  treatment,
  selectedDate,
  selectedTime
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">{treatment.clinics?.name}</h4>
            <p className="text-sm text-gray-600">{treatment.name}</p>
          </div>
          
          {selectedDate && (
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              {selectedDate}
            </div>
          )}
          
          {selectedTime && (
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              {selectedTime}
            </div>
          )}
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                {treatment.currency} {treatment.price_from?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummaryCard;
