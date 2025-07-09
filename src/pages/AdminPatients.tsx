
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Eye,
  Edit
} from 'lucide-react';
import { useAdminPatientsWithBookings } from '@/hooks/useAdminPatients';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ProtectedRoute from '@/components/ProtectedRoute';
import PatientEditModal from '@/components/PatientEditModal';
import PatientDetailModal from '@/components/PatientDetailModal';
import PatientAddModal from '@/components/PatientAddModal';

const AdminPatients = () => {
  const { data: patients, isLoading, error, refetch } = useAdminPatientsWithBookings();
  const [searchTerm, setSearchTerm] = useState('');

  if (error) {
    console.error('Error loading patients:', error);
  }

  const filteredPatients = patients?.filter(patient =>
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.country && patient.country.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <ProtectedRoute requireAdmin={true}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold">Hasta Yönetimi</h1>
                  <p className="text-gray-600 mt-1">Hasta bilgilerini görüntüleyin ve yönetin</p>
                </div>
              </div>
              <PatientAddModal onPatientAdded={refetch} />
            </div>

            {/* Search and Filter Bar */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      placeholder="Hasta ara (ad, email, ülke)..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtreler
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Patients Table */}
            <Card>
              <CardHeader>
                <CardTitle>Tüm Hastalar ({filteredPatients.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded mb-2"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredPatients.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hasta</TableHead>
                        <TableHead>İletişim</TableHead>
                        <TableHead>Konum</TableHead>
                        <TableHead>Rezervasyonlar</TableHead>
                        <TableHead>Son Aktivite</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {patient.first_name} {patient.last_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Kayıt: {new Date(patient.created_at || '').toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                {patient.email}
                              </div>
                              {patient.phone && (
                                <div className="flex items-center text-sm">
                                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                  {patient.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {patient.country || 'Belirtilmemiş'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-medium">{patient.totalBookings}</div>
                              <div className="text-sm text-gray-500">toplam</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-1" />
                              {patient.lastBooking 
                                ? new Date(patient.lastBooking).toLocaleDateString()
                                : 'Rezervasyon yok'
                              }
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={patient.status === 'active' ? 'default' : 'secondary'}
                              className={patient.status === 'active' ? 'bg-green-600' : 'bg-gray-500'}
                            >
                              {patient.status === 'active' ? 'Aktif' : 'Pasif'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <PatientDetailModal patient={patient} />
                              <PatientEditModal patient={patient} />
                              <Button size="sm" variant="outline">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Hasta bulunamadı</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AdminPatients;
