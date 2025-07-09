
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminPatientsWithBookings = () => {
  return useQuery({
    queryKey: ['admin-patients-with-bookings'],
    queryFn: async () => {
      console.log('Fetching patients with booking data...');
      
      // First get all profiles (patients)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Then get booking counts for each patient
      const patientsWithBookings = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('id, created_at')
            .eq('patient_id', profile.id);

          if (bookingsError) {
            console.error('Error fetching bookings for patient:', profile.id, bookingsError);
          }

          const totalBookings = bookings?.length || 0;
          const lastBooking = bookings && bookings.length > 0 
            ? bookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at 
            : null;

          return {
            ...profile,
            totalBookings,
            lastBooking,
            status: 'active' // Default status
          };
        })
      );

      console.log('Patients with booking data:', patientsWithBookings);
      return patientsWithBookings;
    },
  });
};
