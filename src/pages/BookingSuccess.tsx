import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePayment } from '@/hooks/usePayment';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendBookingNotification } = usePayment();
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) {
        navigate('/');
        return;
      }

      try {
        const { data: booking, error } = await supabase
          .from('bookings')
          .select(`
            *,
            clinics(name, city, country),
            treatments(name),
            profiles(first_name, last_name, email)
          `)
          .eq('id', bookingId)
          .single();

        if (error) throw error;

        setBookingData(booking);

        // Update booking status to confirmed and payment status to paid
        await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            payment_status: 'released'
          })
          .eq('id', bookingId);

        // Send confirmation email
        if (booking.profiles?.email) {
          await sendBookingNotification(
            bookingId,
            'confirmation',
            booking.profiles.email,
            `${booking.profiles.first_name} ${booking.profiles.last_name}`,
            booking.clinics?.name || 'Unknown Clinic',
            booking.treatments?.name || 'Unknown Treatment',
            booking.preferred_date || 'TBD',
            'TBD'
          );
        }

        toast({
          title: "Payment Successful!",
          description: "Your booking has been confirmed and you'll receive an email confirmation shortly.",
        });
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast({
          title: "Error",
          description: "Failed to load booking details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId, navigate, toast, sendBookingNotification]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing your booking...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your booking has been confirmed and payment processed successfully.
          </p>
        </div>

        {bookingData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Booking Confirmation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Treatment</h4>
                  <p>{bookingData.treatments?.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Clinic</h4>
                  <p>{bookingData.clinics?.name}</p>
                  <p className="text-sm text-gray-600">
                    {bookingData.clinics?.city}, {bookingData.clinics?.country}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Patient</h4>
                  <p>{bookingData.profiles?.first_name} {bookingData.profiles?.last_name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Booking ID</h4>
                  <p className="font-mono text-sm">{bookingData.id}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Amount Paid</h4>
                  <p className="text-lg font-semibold text-green-600">
                    {bookingData.currency} {bookingData.total_amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Status</h4>
                  <p className="text-green-600 font-semibold">Confirmed</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-2">What's Next?</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>You'll receive a confirmation email shortly</li>
                  <li>The clinic will contact you within 24 hours to schedule your appointment</li>
                  <li>You can track your booking status in your dashboard</li>
                  <li>You'll receive a reminder 24 hours before your appointment</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/patient/dashboard')}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            View Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingSuccess;
