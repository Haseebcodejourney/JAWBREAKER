
import React from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminStatsCards from '@/components/AdminStatsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecentData } from '@/hooks/useRecentData';
import BookingStatusBadge from '@/components/BookingStatusBadge';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminDashboard = () => {
  const { recentClinics, recentBookings } = useRecentData();

  return (
    <ProtectedRoute requireAdmin={true}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gray-50">
          <AdminSidebar />
          
          <main className="flex-1 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">System-wide statistics and recent activities</p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <AdminStatsCards />

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentBookings.isLoading ? (
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : recentBookings.data && recentBookings.data.length > 0 ? (
                      <div className="space-y-3">
                        {recentBookings.data.slice(0, 5).map((booking: any) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">
                                {booking.profiles?.first_name} {booking.profiles?.last_name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {booking.treatments?.name} at {booking.clinics?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(booking.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <BookingStatusBadge 
                                status={booking.status} 
                                paymentStatus={booking.payment_status}
                                size="sm"
                              />
                              <span className="text-sm font-medium">
                                {booking.currency} {booking.total_amount?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No data available</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pending Approvals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentClinics.isLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : recentClinics.data && recentClinics.data.filter((clinic: any) => clinic.status === 'pending').length > 0 ? (
                      <div className="space-y-3">
                        {recentClinics.data
                          .filter((clinic: any) => clinic.status === 'pending')
                          .slice(0, 5)
                          .map((clinic: any) => (
                          <div key={clinic.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div>
                              <p className="font-medium text-sm">{clinic.name}</p>
                              <p className="text-xs text-gray-600">
                                {clinic.city}, {clinic.country}
                              </p>
                              <p className="text-xs text-gray-500">
                                Applied: {new Date(clinic.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Pending
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No data available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
