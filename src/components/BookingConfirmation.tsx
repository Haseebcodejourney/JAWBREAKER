
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Calendar, MapPin, Clock, CreditCard, Download, MessageCircle } from 'lucide-react';

interface BookingConfirmationProps {
  bookingId: string;
  clinicName: string;
  treatmentName: string;
  date: string;
  time: string;
  location: string;
  totalAmount: number;
  currency: string;
  patientName: string;
  onDownloadReceipt: () => void;
  onContactClinic: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingId,
  clinicName,
  treatmentName,
  date,
  time,
  location,
  totalAmount,
  currency,
  patientName,
  onDownloadReceipt,
  onContactClinic
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your appointment has been successfully booked</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{treatmentName}</CardTitle>
              <p className="text-gray-600">{clinicName}</p>
            </div>
            <Badge className="bg-green-600 text-white">
              Confirmed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium">{time}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium">{location}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="font-medium text-lg">{currency} {totalAmount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">Booking ID</p>
            <p className="font-mono text-sm">{bookingId}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button onClick={onDownloadReceipt} className="w-full" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Receipt
        </Button>
        
        <Button onClick={onContactClinic} className="w-full">
          <MessageCircle className="w-4 h-4 mr-2" />
          Contact Clinic
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">What's Next?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• You'll receive a confirmation email shortly</li>
          <li>• The clinic will contact you within 24 hours</li>
          <li>• Please arrive 15 minutes before your appointment</li>
          <li>• Bring a valid ID and any required documents</li>
        </ul>
      </div>
    </div>
  );
};

export default BookingConfirmation;
