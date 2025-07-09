import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserCog, 
  Search, 
  Filter, 
  MoreHorizontal,
  MapPin,
  Star,
  Eye,
  Edit,
  Calendar,
  Award,
  Video,
  Languages,
  DollarSign,
  Stethoscope,
  Trash2,
  UserX,
  CheckCircle
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDoctorProfiles } from '@/hooks/useDoctorProfiles';
import ProtectedRoute from '@/components/ProtectedRoute';
import DoctorEditModal from '@/components/DoctorEditModal';

const AdminDoctors = () => {
  const { data: doctors, isLoading, error, refetch } = useDoctorProfiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  if (error) {
    console.error('Error loading doctors:', error);
  }

  const filteredDoctors = doctors?.filter(doctor =>
    doctor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatLanguages = (languages: string[]) => {
    const langMap: { [key: string]: string } = {
      'en': 'İngilizce',
      'tr': 'Türkçe',
      'ar': 'Arapça',
      'es': 'İspanyolca',
      'fr': 'Fransızca',
      'de': 'Almanca',
      'ru': 'Rusça'
    };
    
    return languages.map(lang => langMap[lang] || lang).join(', ');
  };

  const handleViewDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setViewModalOpen(true);
  };

  const handleActivateDoctor = (doctorId: string) => {
    console.log('Activating doctor:', doctorId);
    // TODO: Implement doctor activation logic
  };

  const handleDeactivateDoctor = (doctorId: string) => {
    console.log('Deactivating doctor:', doctorId);
    // TODO: Implement doctor deactivation logic
  };

  const handleDeleteDoctor = (doctorId: string) => {
    console.log('Deleting doctor:', doctorId);
    // TODO: Implement doctor deletion logic with confirmation
  };

  const stats = {
    total: doctors?.length || 0,
    online: doctors?.filter(d => d.available_online).length || 0,
    experienced: doctors?.filter(d => (d.years_experience || 0) > 10).length || 0,
    certified: doctors?.filter(d => d.certifications && d.certifications.length > 0).length || 0
  };

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
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Doktor Yönetimi</h1>
                    <p className="text-gray-600 mt-1">Tüm doktor profillerini yönetin</p>
                  </div>
                </div>
                <Button className="flex items-center gap-2">
                  <UserCog className="w-4 h-4" />
                  Yeni Doktor Ekle
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Toplam Doktor</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      </div>
                      <UserCog className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Online Konsültasyon</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.online}</p>
                      </div>
                      <Video className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">10+ Yıl Deneyim</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.experienced}</p>
                      </div>
                      <Award className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Sertifikalı</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.certified}</p>
                      </div>
                      <Stethoscope className="w-8 h-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        placeholder="Doktor adı veya uzmanlık alanı ile ara..." 
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

              <Card>
                <CardHeader>
                  <CardTitle>Doktorlar ({filteredDoctors.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-32 bg-gray-200 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredDoctors.length > 0 ? (
                    <div className="space-y-4">
                      {filteredDoctors.map((doctor) => (
                        <div key={doctor.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={doctor.profile_image_url || ''} />
                                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                  {getInitials(doctor.first_name, doctor.last_name)}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-xl font-semibold text-gray-900">
                                    {doctor.title} {doctor.first_name} {doctor.last_name}
                                  </h3>
                                  {doctor.available_online && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      <Video className="w-3 h-3 mr-1" />
                                      Online
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-lg text-blue-600 font-medium mb-2">{doctor.specialization}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {doctor.years_experience || 0} yıl deneyim
                                  </div>
                                  {doctor.consultation_fee && (
                                    <div className="flex items-center">
                                      <DollarSign className="w-4 h-4 mr-1" />
                                      ${doctor.consultation_fee} konsültasyon
                                    </div>
                                  )}
                                  {doctor.languages && doctor.languages.length > 0 && (
                                    <div className="flex items-center">
                                      <Languages className="w-4 h-4 mr-1" />
                                      {formatLanguages(doctor.languages)}
                                    </div>
                                  )}
                                </div>

                                {doctor.bio && (
                                  <p className="text-gray-600 mb-3 line-clamp-2">{doctor.bio}</p>
                                )}

                                <div className="space-y-2">
                                  {doctor.education && doctor.education.length > 0 && (
                                    <div>
                                      <span className="text-sm font-medium text-gray-700">Eğitim: </span>
                                      <span className="text-sm text-gray-600">
                                        {doctor.education.slice(0, 2).join(', ')}
                                        {doctor.education.length > 2 && ` +${doctor.education.length - 2} daha`}
                                      </span>
                                    </div>
                                  )}

                                  {doctor.certifications && doctor.certifications.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {doctor.certifications.slice(0, 3).map((cert, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {cert}
                                        </Badge>
                                      ))}
                                      {doctor.certifications.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{doctor.certifications.length - 3} sertifika
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleViewDoctor(doctor)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <DoctorEditModal 
                                  doctor={doctor} 
                                  onUpdate={refetch}
                                />
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleActivateDoctor(doctor.id)}>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Aktifleştir
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeactivateDoctor(doctor.id)}>
                                      <UserX className="w-4 h-4 mr-2" />
                                      Deaktifleştir
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteDoctor(doctor.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Sil
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UserCog className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Doktor bulunamadı</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>

        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Doktor Detayları</DialogTitle>
              <DialogDescription>
                Doktor profilinin detaylı bilgileri
              </DialogDescription>
            </DialogHeader>
            {selectedDoctor && (
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={selectedDoctor.profile_image_url || ''} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                      {getInitials(selectedDoctor.first_name, selectedDoctor.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedDoctor.title} {selectedDoctor.first_name} {selectedDoctor.last_name}
                    </h2>
                    <p className="text-lg text-blue-600 font-medium mb-4">{selectedDoctor.specialization}</p>
                    {selectedDoctor.bio && (
                      <p className="text-gray-600 mb-4">{selectedDoctor.bio}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Genel Bilgiler</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{selectedDoctor.years_experience || 0} yıl deneyim</span>
                      </div>
                      {selectedDoctor.consultation_fee && (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                          <span>${selectedDoctor.consultation_fee} konsültasyon ücreti</span>
                        </div>
                      )}
                      {selectedDoctor.languages && selectedDoctor.languages.length > 0 && (
                        <div className="flex items-center">
                          <Languages className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{formatLanguages(selectedDoctor.languages)}</span>
                        </div>
                      )}
                      {selectedDoctor.available_online && (
                        <div className="flex items-center">
                          <Video className="w-4 h-4 mr-2 text-green-600" />
                          <span className="text-green-600">Online konsültasyon mevcut</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Eğitim ve Sertifikalar</h3>
                    {selectedDoctor.education && selectedDoctor.education.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Eğitim:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {selectedDoctor.education.map((edu: string, index: number) => (
                            <li key={index}>{edu}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedDoctor.certifications && selectedDoctor.certifications.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Sertifikalar:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedDoctor.certifications.map((cert: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AdminDoctors;
