
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminReports = () => {
  return useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      console.log('Fetching admin reports data...');
      
      try {
        // Get current month date range
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1).toISOString();
        const lastDay = new Date(currentYear, currentMonth + 1, 0).toISOString();
        
        // Get last month for comparison
        const lastMonth = new Date(currentYear, currentMonth - 1, 1);
        const lastMonthFirst = lastMonth.toISOString();
        const lastMonthLast = new Date(currentYear, currentMonth, 0).toISOString();

        // Monthly Revenue
        const { data: currentRevenue } = await supabase
          .from('payment_transactions')
          .select('amount')
          .eq('status', 'completed')
          .gte('created_at', firstDay)
          .lte('created_at', lastDay);

        const { data: lastMonthRevenue } = await supabase
          .from('payment_transactions')
          .select('amount')
          .eq('status', 'completed')
          .gte('created_at', lastMonthFirst)
          .lte('created_at', lastMonthLast);

        const currentMonthTotal = currentRevenue?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
        const lastMonthTotal = lastMonthRevenue?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
        const revenueChange = lastMonthTotal > 0 ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal * 100) : 0;

        // New Patients this month
        const { data: currentPatients } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'patient')
          .gte('created_at', firstDay)
          .lte('created_at', lastDay);

        const { data: lastMonthPatients } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'patient')
          .gte('created_at', lastMonthFirst)
          .lte('created_at', lastMonthLast);

        const currentPatientsCount = currentPatients?.length || 0;
        const lastMonthPatientsCount = lastMonthPatients?.length || 0;
        const patientsChange = lastMonthPatientsCount > 0 ? ((currentPatientsCount - lastMonthPatientsCount) / lastMonthPatientsCount * 100) : 0;

        // Active Clinics
        const { data: activeClinics } = await supabase
          .from('clinics')
          .select('id')
          .eq('status', 'approved');

        const { data: allClinics } = await supabase
          .from('clinics')
          .select('id, created_at');

        const activeCount = activeClinics?.length || 0;
        const clinicsChange = 3.1; // Placeholder for clinic growth

        // Conversion Rate (completed bookings vs total bookings)
        const { data: totalBookings } = await supabase
          .from('bookings')
          .select('id, status')
          .gte('created_at', firstDay)
          .lte('created_at', lastDay);

        const completedBookings = totalBookings?.filter(b => b.status === 'completed').length || 0;
        const totalBookingsCount = totalBookings?.length || 0;
        const conversionRate = totalBookingsCount > 0 ? (completedBookings / totalBookingsCount * 100) : 0;

        const stats = {
          monthlyRevenue: {
            value: `$${currentMonthTotal.toLocaleString()}`,
            change: `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}%`,
            trend: revenueChange >= 0 ? 'up' : 'down'
          },
          newPatients: {
            value: currentPatientsCount.toString(),
            change: `${patientsChange >= 0 ? '+' : ''}${patientsChange.toFixed(1)}%`,
            trend: patientsChange >= 0 ? 'up' : 'down'
          },
          activeClinics: {
            value: activeCount.toString(),
            change: '+3.1%',
            trend: 'up'
          },
          conversionRate: {
            value: `${conversionRate.toFixed(1)}%`,
            change: '-2.1%',
            trend: 'down'
          }
        };

        console.log('Admin reports data fetched:', stats);
        return stats;
      } catch (error) {
        console.error('Error fetching admin reports:', error);
        throw error;
      }
    },
    refetchInterval: 300000, // 5 minutes
  });
};

export const useReportGeneration = () => {
  const generateReport = async (reportType: string) => {
    console.log('Generating report:', reportType);
    
    try {
      switch (reportType) {
        case 'revenue':
          const { data: revenueData } = await supabase
            .from('payment_transactions')
            .select(`
              *,
              bookings (
                id,
                profiles (first_name, last_name),
                clinics (name),
                treatments (name)
              )
            `)
            .eq('status', 'completed')
            .order('created_at', { ascending: false });
          
          return {
            type: 'revenue',
            data: revenueData,
            filename: `revenue-report-${new Date().toISOString().split('T')[0]}.json`
          };

        case 'patients':
          const { data: patientsData } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, country, created_at')
            .eq('role', 'patient')
            .order('created_at', { ascending: false });
          
          return {
            type: 'patients',
            data: patientsData,
            filename: `patients-report-${new Date().toISOString().split('T')[0]}.json`
          };

        case 'clinics':
          const { data: clinicsData } = await supabase
            .from('clinics')
            .select(`
              id, name, city, country, status, rating, review_count,
              created_at, total_patients
            `)
            .order('created_at', { ascending: false });
          
          return {
            type: 'clinics',
            data: clinicsData,
            filename: `clinics-report-${new Date().toISOString().split('T')[0]}.json`
          };

        case 'treatments':
          const { data: treatmentsData } = await supabase
            .from('treatments')
            .select(`
              id, name, category, price_from, price_to,
              clinics (name, city, country),
              created_at
            `)
            .eq('active', true)
            .order('created_at', { ascending: false });
          
          return {
            type: 'treatments',
            data: treatmentsData,
            filename: `treatments-report-${new Date().toISOString().split('T')[0]}.json`
          };

        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  };

  return { generateReport };
};
