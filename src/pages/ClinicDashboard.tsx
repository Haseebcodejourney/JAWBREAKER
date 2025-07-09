import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Star,
  Phone,
  Mail,
  Globe,
  Edit,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import ClinicEditModal from '@/components/ClinicEditModal';

const ClinicDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Fetch clinic data
  const { data: clinic, isLoading: clinicLoading } = useQuery({
    queryKey: ['clinic-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['clinic-bookings'],
    queryFn: async () => {
      if (!clinic?.id) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          treatments:treatment_id(name, price_from),
          profiles:patient_id(first_name, last_name, email)
        `)
        .eq('clinic_id', clinic.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!clinic?.id,
  });

  // Fetch treatments
  const { data: treatments, isLoading: treatmentsLoading } = useQuery({
    queryKey: ['clinic-treatments'],
    queryFn: async () => {
      if (!clinic?.id) return [];
      
      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .eq('clinic_id', clinic.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!clinic?.id,
  });

  // Fetch reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['clinic-reviews'],
    queryFn: async () => {
      if (!clinic?.id) return [];
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:patient_id(first_name, last_name)
        `)
        .eq('clinic_id', clinic.id)
        .eq('verified', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!clinic?.id,
  });

  // Calculate statistics
  const stats = {
    totalBookings: bookings?.length || 0,
    pendingBookings: bookings?.filter(b => b.status === 'pending').length || 0,
    confirmedBookings: bookings?.filter(b => b.status === 'confirmed').length || 0,
    totalRevenue: bookings
      ?.filter(b => b.payment_status === 'released')
      ?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0,
    totalTreatments: treatments?.length || 0,
    activeTreatments: treatments?.filter(t => t.active).length || 0,
    averageRating: clinic?.rating || 0,
    totalReviews: reviews?.length || 0
  };

  if (clinicLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Klinik Bulunamadı</h2>
        <p className="text-gray-600 text-center mb-6">Henüz bir klinik profiliniz yok. Lütfen önce klinik kaydınızı tamamlayın.</p>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Klinik Oluştur
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Bekliyor', variant: 'secondary' as const },
      confirmed: { label: 'Onaylandı', variant: 'default' as const },
      completed: { label: 'Tamamlandı', variant: 'default' as const },
      cancelled: { label: 'İptal', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Bekliyor', variant: 'secondary' as const },
      processing: { label: 'İşleniyor', variant: 'default' as const },
      released: { label: 'Ödendi', variant: 'default' as const },
      refunded: { label: 'İade', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Klinik Paneli</h1>
              <p className="text-gray-600 mt-1">Klinik yönetimi ve rezervasyon takibi</p>
            </div>
            <div className="flex items-center gap-3">
              <ClinicEditModal 
                clinic={{
                  id: clinic.id,
                  name: clinic.name,
                  description: clinic.description,
                  phone: clinic.phone,
                  email: clinic.email,
                  website: clinic.website,
                  address: clinic.address
                }} 
              />
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Tedavi Ekle
              </Button>
            </div>
          </div>

          {/* Clinic Info Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{clinic.name.charAt(0)}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{clinic.name}</h2>
                      <div className="flex items-center gap-4 mt-2 text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {clinic.city}, {clinic.country}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {clinic.rating?.toFixed(1) || '0.0'} ({clinic.review_count || 0} değerlendirme)
                        </div>
                      </div>
                    </div>
                    <Badge variant={clinic.status === 'approved' ? 'default' : 'secondary'}>
                      {clinic.status === 'approved' ? 'Onaylandı' : 'Bekliyor'}
                    </Badge>
                  </div>
                  
                  {clinic.description && (
                    <p className="text-gray-600 mb-4">{clinic.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {clinic.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {clinic.phone}
                      </div>
                    )}
                    {clinic.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {clinic.email}
                      </div>
                    )}
                    {clinic.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-gray-400" />
                        <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Rezervasyon</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aktif Tedaviler</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeTreatments}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ortalama Puan</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bookings">Rezervasyonlar</TabsTrigger>
              <TabsTrigger value="treatments">Tedaviler</TabsTrigger>
              <TabsTrigger value="reviews">Değerlendirmeler</TabsTrigger>
              <TabsTrigger value="analytics">Analitik</TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <CardTitle>Rezervasyonlar</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input 
                          placeholder="Rezervasyon ara..." 
                          className="pl-10 w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrele
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-gray-200 rounded mb-2"></div>
                        </div>
                      ))}
                    </div>
                  ) : bookings && bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {booking.treatments?.name || 'Tedavi'}
                                </h3>
                                {getStatusBadge(booking.status)}
                                {getPaymentStatusBadge(booking.payment_status)}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div>
                                  <strong>Hasta:</strong> {booking.profiles?.first_name} {booking.profiles?.last_name}
                                </div>
                                <div>
                                  <strong>Tarih:</strong> {booking.preferred_date ? new Date(booking.preferred_date).toLocaleDateString('tr-TR') : 'Belirtilmedi'}
                                </div>
                                <div>
                                  <strong>Tutar:</strong> {booking.total_amount ? `$${booking.total_amount}` : 'Belirtilmedi'}
                                </div>
                              </div>
                              
                              {booking.notes && (
                                <div className="mt-2 text-sm text-gray-600">
                                  <strong>Notlar:</strong> {booking.notes}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                Detay
                              </Button>
                              <Button size="sm">
                                İletişim
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Henüz rezervasyon yok</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Treatments Tab */}
            <TabsContent value="treatments">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Tedaviler</CardTitle>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Yeni Tedavi
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {treatmentsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-20 bg-gray-200 rounded mb-2"></div>
                        </div>
                      ))}
                    </div>
                  ) : treatments && treatments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {treatments.map((treatment) => (
                        <div key={treatment.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">{treatment.name}</h3>
                            <Badge variant={treatment.active ? 'default' : 'secondary'}>
                              {treatment.active ? 'Aktif' : 'Pasif'}
                            </Badge>
                          </div>
                          
                          {treatment.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{treatment.description}</p>
                          )}
                          
                          <div className="space-y-2 text-sm">
                            {treatment.price_from && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Fiyat:</span>
                                <span className="font-medium">${treatment.price_from}{treatment.price_to && treatment.price_to !== treatment.price_from ? ` - $${treatment.price_to}` : ''}</span>
                              </div>
                            )}
                            {treatment.duration_days && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Süre:</span>
                                <span className="font-medium">{treatment.duration_days} gün</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-1" />
                              Düzenle
                            </Button>
                            <Button size="sm">
                              Detay
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Henüz tedavi eklenmedi</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Değerlendirmeler</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviewsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-24 bg-gray-200 rounded mb-2"></div>
                        </div>
                      ))}
                    </div>
                  ) : reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900">
                                  {review.profiles?.first_name} {review.profiles?.last_name}
                                </h4>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">
                                {new Date(review.created_at).toLocaleDateString('tr-TR')}
                              </p>
                            </div>
                          </div>
                          
                          {review.title && (
                            <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                          )}
                          
                          {review.content && (
                            <p className="text-gray-600">{review.content}</p>
                          )}
                          
                          {review.response_from_clinic && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-900 mb-1">Klinik Yanıtı:</p>
                              <p className="text-sm text-blue-800">{review.response_from_clinic}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Henüz değerlendirme yok</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rezervasyon İstatistikleri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Bekleyen</span>
                        <Badge variant="secondary">{stats.pendingBookings}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Onaylanan</span>
                        <Badge>{stats.confirmedBookings}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gelir Analizi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ${stats.totalRevenue.toLocaleString()}
                      </div>
                      <p className="text-gray-600">Toplam Gelir</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ClinicDashboard;
