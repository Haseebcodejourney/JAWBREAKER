
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminTransactions = () => {
  return useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      console.log('Fetching admin transactions...');
      
      const { data: transactions, error } = await supabase
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
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      console.log('Fetched transactions:', transactions);
      return transactions || [];
    },
  });
};

export const useTransactionStats = () => {
  return useQuery({
    queryKey: ['transaction-stats'],
    queryFn: async () => {
      console.log('Fetching transaction stats...');
      
      // Get total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('payment_transactions')
        .select('amount')
        .eq('status', 'completed');

      if (revenueError) {
        console.error('Error fetching revenue:', revenueError);
        throw revenueError;
      }

      const totalRevenue = revenueData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      const totalCommission = totalRevenue * 0.1; // Assuming 10% commission

      // Get today's transactions
      const today = new Date().toISOString().split('T')[0];
      const { data: todayTransactions, error: todayError } = await supabase
        .from('payment_transactions')
        .select('id')
        .gte('created_at', today + 'T00:00:00.000Z')
        .lt('created_at', today + 'T23:59:59.999Z');

      if (todayError) {
        console.error('Error fetching today transactions:', todayError);
      }

      // Get failed payments
      const { data: failedPayments, error: failedError } = await supabase
        .from('payment_transactions')
        .select('id')
        .eq('status', 'failed');

      if (failedError) {
        console.error('Error fetching failed payments:', failedError);
      }

      const stats = {
        totalRevenue,
        totalCommission,
        transactionsToday: todayTransactions?.length || 0,
        failedPayments: failedPayments?.length || 0
      };

      console.log('Transaction stats:', stats);
      return stats;
    },
  });
};
