import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Search, 
  Filter, 
  MoreHorizontal,
  MapPin,
  Users,
  Star,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useAdminClinics } from '@/hooks/useAdminClinics';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AdminClinicModal from '@/components/AdminClinicModal';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ClinicEditModal from '@/components/ClinicEditModal';

const AdminClinics = () => {
  const { data: clinics, isLoading, error, refetch } = useAdminClinics();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading2, setIsLoading2] = useState(false);
  const { toast } = useToast();

  if (error) {
    console.error('Error loading clinics:', error);
  }

  const filteredClinics = clinics?.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = selectedTab === 'all' || 
      (selectedTab === 'approved' && clinic.status === 'approved') ||
      (selectedTab === 'pending' && clinic.status === 'pending') ||
      (selectedTab === 'featured' && clinic.featured);
    
    return matchesSearch && matchesTab;
  }) || [];

  const stats = {
    total: clinics?.length || 0,
    approved: clinics?.filter(c => c.status === 'approved').length || 0,
    pending: clinics?.filter(c => c.status === 'pending').length || 0,
    featured: clinics?.filter(c => c.featured).length || 0
  };

  const handleViewDetails = (clinic: any) => {
    setSelectedClinic(clinic);
    setShowDetailsModal(true);
  };

  const handleApproveClinic = async (clinic: any) => {
    setSelectedClinic(clinic);
    setShowApprovalDialog(true);
  };

  const confirmApproval = async () => {
    if (!selectedClinic) return;
    
    setIsLoading2(true);
    try {
      const { error } = await supabase
        .from('clinics')
        .update({ status: 'approved' })
        .eq('id', selectedClinic.id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: `${selectedClinic.name} başarıyla onaylandı.`,
      });

      refetch();
      setShowApprovalDialog(false);
    } catch (error) {
      console.error('Error approving clinic:', error);
      toast({
        title: "Hata",
        description: "Klinik onaylanırken hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading2(false);
    }
  };

  const handleRejectClinic = async (clinic: any) => {
    setSelectedClinic(clinic);
    setShowRejectionDialog(true);
  };

  const confirmRejection = async () => {
    if (!selectedClinic || !rejectionReason.trim()) return;
    
    setIsLoading2(true);
    try {
      const { error } = await supabase
        .from('clinics')
        .update({ status: 'rejected' })
        .eq('id', selectedClinic.id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: `${selectedClinic.name} reddedildi.`,
      });

      refetch();
      setShowRejectionDialog(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting clinic:', error);
      toast({
        title: "Hata",
        description: "Klinik reddedilirken hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading2(false);
    }
  };

  const handleToggleFeatured = async (clinic: any) => {
    try {
      const { error } = await supabase
        .from('clinics')
        .update({ featured: !clinic.featured })
        .eq('id', clinic.id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: `${clinic.name} ${clinic.featured ? 'öne çıkandan kaldırıldı' : 'öne çıkana eklendi'}.`,
      });

      refetch();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast({
        title: "Hata",
        description: "İşlem gerçekleştirilirken hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClinic = async (clinic: any) => {
    try {
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', clinic.id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: `${clinic.name} silindi.`,
      });

      refetch();
    } catch (error) {
      console.error('Error deleting clinic:', error);
      toast({
        title: "Hata",
        description: "Klinik silinirken hata oluştu.",
        variant: "destructive",
      });
    }
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
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Klinik Yönetimi</h1>
                    <p className="text-gray-600 mt-1">Tüm klinikleri yönetin ve inceleyin</p>
                  </div>
                </div>
                <AdminClinicModal onClinicAdded={refetch} />
              </div>

              {/* İstatistik Kartları */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Toplam Klinik</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      </div>
                      <Building className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Onaylanmış</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                      </div>
                      <Award className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                      </div>
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Öne Çıkan</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
                      </div>
                      <Star className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Arama ve Filtre */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        placeholder="Klinik adı, şehir veya ülke ile ara..." 
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

              {/* Klinikler Tablosu */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Klinikler</CardTitle>
                    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                      <TabsList>
                        <TabsTrigger value="all">Tümü</TabsTrigger>
                        <TabsTrigger value="approved">Onaylanmış</TabsTrigger>
                        <TabsTrigger value="pending">Bekleyen</TabsTrigger>
                        <TabsTrigger value="featured">Öne Çıkan</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
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
                  ) : filteredClinics.length > 0 ? (
                    <div className="space-y-4">
                      {filteredClinics.map((clinic) => (
                        <div key={clinic.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <Building className="w-8 h-8 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                                  {clinic.verified && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      Doğrulanmış
                                    </Badge>
                                  )}
                                  {clinic.featured && (
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                      Öne Çıkan
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {clinic.city}, {clinic.country}
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                    {clinic.rating || 0} ({clinic.review_count || 0} değerlendirme)
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {clinic.staff_count || 0} personel
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {clinic.established_year && `${new Date().getFullYear() - clinic.established_year} yıl deneyim`}
                                  </div>
                                </div>

                                {clinic.description && (
                                  <p className="text-gray-600 mt-2 line-clamp-2">{clinic.description}</p>
                                )}

                                <div className="flex items-center gap-4 mt-3">
                                  {clinic.email && (
                                    <div className="flex items-center text-sm text-gray-500">
                                      <Mail className="w-4 h-4 mr-1" />
                                      {clinic.email}
                                    </div>
                                  )}
                                  {clinic.phone && (
                                    <div className="flex items-center text-sm text-gray-500">
                                      <Phone className="w-4 h-4 mr-1" />
                                      {clinic.phone}
                                    </div>
                                  )}
                                </div>

                                {clinic.specialties && clinic.specialties.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {clinic.specialties.slice(0, 3).map((specialty) => (
                                      <Badge key={specialty} variant="outline" className="text-xs">
                                        {specialty}
                                      </Badge>
                                    ))}
                                    {clinic.specialties.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{clinic.specialties.length - 3} daha
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <Badge 
                                variant={clinic.status === 'approved' ? 'default' : 'secondary'}
                                className={clinic.status === 'approved' ? 'bg-green-600' : 'bg-yellow-500'}
                              >
                                {clinic.status === 'approved' ? 'Onaylandı' : 'Bekliyor'}
                              </Badge>

                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleViewDetails(clinic)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                
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
                                  onUpdate={refetch}
                                />
                                
                                {clinic.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="text-green-600 border-green-600 hover:bg-green-50"
                                      onClick={() => handleApproveClinic(clinic)}
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="text-red-600 border-red-600 hover:bg-red-50"
                                      onClick={() => handleRejectClinic(clinic)}
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleToggleFeatured(clinic)}>
                                      <Star className="w-4 h-4 mr-2" />
                                      {clinic.featured ? 'Öne Çıkandan Kaldır' : 'Öne Çıkar'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteClinic(clinic)}
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
                      <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Klinik bulunamadı</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>

        {/* Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedClinic?.name} - Detayları</DialogTitle>
            </DialogHeader>
            {selectedClinic && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Şehir:</strong> {selectedClinic.city}</div>
                  <div><strong>Ülke:</strong> {selectedClinic.country}</div>
                  <div><strong>Email:</strong> {selectedClinic.email}</div>
                  <div><strong>Telefon:</strong> {selectedClinic.phone}</div>
                  <div><strong>Kuruluş:</strong> {selectedClinic.established_year}</div>
                  <div><strong>Personel:</strong> {selectedClinic.staff_count}</div>
                </div>
                {selectedClinic.description && (
                  <div>
                    <strong>Açıklama:</strong>
                    <p className="mt-1 text-gray-600">{selectedClinic.description}</p>
                  </div>
                )}
                {selectedClinic.address && (
                  <div>
                    <strong>Adres:</strong>
                    <p className="mt-1 text-gray-600">{selectedClinic.address}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Approval Dialog */}
        <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Kliniği Onayla</AlertDialogTitle>
              <AlertDialogDescription>
                <strong>{selectedClinic?.name}</strong> klinikini onaylamak istediğinizden emin misiniz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmApproval}
                disabled={isLoading2}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading2 ? 'Onaylanıyor...' : 'Onayla'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Rejection Dialog */}
        <AlertDialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Kliniği Reddet</AlertDialogTitle>
              <AlertDialogDescription>
                <strong>{selectedClinic?.name}</strong> klinikini reddetme sebebinizi belirtin:
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4">
              <Textarea
                placeholder="Ret sebebi (gerekli)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmRejection}
                disabled={!rejectionReason.trim() || isLoading2}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading2 ? 'Reddediliyor...' : 'Reddet'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AdminClinics;
