
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Building, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminStatsCards = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('Fetching admin dashboard stats...');
      
      // Get total patients
      const { count: totalPatients } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total clinics
      const { count: totalClinics } = await supabase
        .from('clinics')
        .select('*', { count: 'exact', head: true });

      // Get approved clinics
      const { count: approvedClinics } = await supabase
        .from('clinics')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Get pending clinics
      const { count: pendingClinics } = await supabase
        .from('clinics')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get total bookings
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Get today's bookings
      const today = new Date().toISOString().split('T')[0];
      const { count: todayBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today + 'T00:00:00.000Z')
        .lt('created_at', today + 'T23:59:59.999Z');

      // Get total revenue
      const { data: revenueData } = await supabase
        .from('payment_transactions')
        .select('amount')
        .eq('status', 'completed');

      const totalRevenue = revenueData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      return {
        totalPatients: totalPatients || 0,
        totalClinics: totalClinics || 0,
        approvedClinics: approvedClinics || 0,
        pendingClinics: pendingClinics || 0,
        totalBookings: totalBookings || 0,
        todayBookings: todayBookings || 0,
        totalRevenue
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Toplam Hasta',
      value: stats?.totalPatients || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Toplam Klinik',
      value: stats?.totalClinics || 0,
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Onaylanmış Klinik',
      value: stats?.approvedClinics || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Bekleyen Onay',
      value: stats?.pendingClinics || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStatsCards;
