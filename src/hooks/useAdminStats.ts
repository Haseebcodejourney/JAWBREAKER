
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('Fetching admin statistics...');
      
      try {
        // Clinic sayısı
        const { data: clinics, error: clinicsError } = await supabase
          .from('clinics')
          .select('id, status')
          .eq('status', 'approved');
        
        if (clinicsError) {
          console.error('Error fetching clinics:', clinicsError);
        }

        // Patient sayısı
        const { data: patients, error: patientsError } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'patient');
        
        if (patientsError) {
          console.error('Error fetching patients:', patientsError);
        }

        // Booking sayısı ve revenue
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('id, total_amount, status, created_at');
        
        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
        }

        // Pending approvals
        const { data: pendingClinics, error: pendingError } = await supabase
          .from('clinics')
          .select('id')
          .eq('status', 'pending');
        
        if (pendingError) {
          console.error('Error fetching pending clinics:', pendingError);
        }

        const stats = {
          totalClinics: clinics?.length || 0,
          totalPatients: patients?.length || 0,
          totalBookings: bookings?.length || 0,
          monthlyRevenue: bookings?.reduce((sum, booking) => {
            const bookingDate = new Date(booking.created_at);
            const currentMonth = new Date().getMonth();
            const bookingMonth = bookingDate.getMonth();
            
            if (bookingMonth === currentMonth && booking.status === 'completed') {
              return sum + (Number(booking.total_amount) || 0);
            }
            return sum;
          }, 0) || 0,
          pendingApprovals: pendingClinics?.length || 0
        };

        console.log('Admin stats fetched:', stats);
        return stats;
      } catch (error) {
        console.error('Error in useAdminStats:', error);
        return {
          totalClinics: 0,
          totalPatients: 0,
          totalBookings: 0,
          monthlyRevenue: 0,
          pendingApprovals: 0
        };
      }
    },
    refetchInterval: 30000, // 30 saniyede bir güncelle
  });
};
