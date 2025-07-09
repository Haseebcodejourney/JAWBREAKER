
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  MapPin,
  DollarSign,
  Calendar,
  Target
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SegmentCreateModal from '@/components/SegmentCreateModal';

const CustomerSegmentation = () => {
  const { data: segmentData, isLoading } = useQuery({
    queryKey: ['customer-segmentation'],
    queryFn: async () => {
      console.log('Fetching customer segmentation data...');
      
      // Get country-based segmentation
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('country')
        .not('country', 'is', null);

      if (profilesError) {
        console.error('Error fetching profiles for segmentation:', profilesError);
        throw profilesError;
      }

      // Get booking-based segmentation
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          total_amount,
          currency,
          status,
          created_at,
          treatments (category)
        `);

      if (bookingsError) {
        console.error('Error fetching bookings for segmentation:', bookingsError);
        throw bookingsError;
      }

      // Process country segmentation
      const countrySegments = profilesData?.reduce((acc: Record<string, number>, profile) => {
        const country = profile.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {}) || {};

      // Process treatment category segmentation
      const categorySegments = bookingsData?.reduce((acc: Record<string, number>, booking) => {
        const category = booking.treatments?.category || 'Other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}) || {};

      // Process value-based segmentation
      const totalRevenue = bookingsData?.reduce((sum, booking) => 
        sum + (booking.total_amount || 0), 0) || 0;
      
      const avgOrderValue = bookingsData?.length ? totalRevenue / bookingsData.length : 0;

      return {
        countrySegments,
        categorySegments,
        totalCustomers: profilesData?.length || 0,
        totalRevenue,
        avgOrderValue,
        totalBookings: bookingsData?.length || 0
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const topCountries = Object.entries(segmentData?.countrySegments || {})
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);

  const topCategories = Object.entries(segmentData?.categorySegments || {})
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Müşteri Segmentasyonu</h2>
          <p className="text-gray-600">Müşteri grupları ve davranış analizleri</p>
        </div>
        <SegmentCreateModal />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">
                  {segmentData?.totalCustomers?.toLocaleString() || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${segmentData?.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${segmentData?.avgOrderValue?.toFixed(0) || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Rezervasyon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {segmentData?.totalBookings?.toLocaleString() || 0}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segmentation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Segmentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Coğrafi Segmentasyon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCountries.map(([country, count]) => (
                <div key={country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{country}</span>
                  <Badge variant="secondary">{String(count)} müşteri</Badge>
                </div>
              ))}
              {topCountries.length === 0 && (
                <p className="text-gray-500 text-center py-4">Veri bulunamadı</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Treatment Category Segmentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Tedavi Kategorisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCategories.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{category}</span>
                  <Badge variant="secondary">{String(count)} rezervasyon</Badge>
                </div>
              ))}
              {topCategories.length === 0 && (
                <p className="text-gray-500 text-center py-4">Veri bulunamadı</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerSegmentation;
