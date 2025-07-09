import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw, Home, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const BookingCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
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

        // Update booking status to cancelled
        await supabase
          .from('bookings')
          .update({
            status: 'cancelled',
            payment_status: 'refunded'
          })
          .eq('id', bookingId);

        toast({
          title: "Booking Cancelled",
          description: "Your booking has been cancelled. If payment was processed, it will be refunded within 5-10 business days.",
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
  }, [bookingId, navigate, toast]);

  const handleRetryBooking = () => {
    if (bookingData?.treatments?.id) {
      navigate(`/booking/${bookingData.treatments.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
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
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Cancelled
          </h1>
          <p className="text-gray-600">
            Your booking has been cancelled. No charges will be applied to your payment method.
          </p>
        </div>

        {bookingData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cancelled Booking Details</CardTitle>
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
                  <h4 className="font-semibold text-gray-700">Amount</h4>
                  <p className="text-lg">
                    {bookingData.currency} {bookingData.total_amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Status</h4>
                  <p className="text-red-600 font-semibold">Cancelled</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-2">What happens next?</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Your booking has been cancelled and will not be processed</li>
                  <li>If any payment was charged, it will be automatically refunded</li>
                  <li>Refunds typically take 5-10 business days to appear in your account</li>
                  <li>You can try booking again at any time</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRetryBooking}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Booking Again
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/patient/dashboard')}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            My Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingCancel;
