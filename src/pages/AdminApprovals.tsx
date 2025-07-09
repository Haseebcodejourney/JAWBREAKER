
import React from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Building, 
  FileText, 
  Stethoscope
} from 'lucide-react';
import { usePendingClinics } from '@/hooks/usePendingClinics';
import { usePendingDocuments } from '@/hooks/usePendingDocuments';
import { usePendingTreatments } from '@/hooks/usePendingTreatments';
import ClinicApproval from '@/components/ClinicApproval';
import DocumentReview from '@/components/DocumentReview';
import TreatmentApproval from '@/components/TreatmentApproval';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminApprovals = () => {
  const { data: pendingClinics, isLoading: clinicsLoading, refetch: refetchClinics } = usePendingClinics();
  const { data: pendingDocuments, isLoading: documentsLoading, refetch: refetchDocuments } = usePendingDocuments();
  const { data: pendingTreatments, isLoading: treatmentsLoading, refetch: refetchTreatments } = usePendingTreatments();

  const totalPendingReviews = (pendingClinics?.length || 0) + (pendingDocuments?.length || 0) + (pendingTreatments?.length || 0);

  return (
    <ProtectedRoute requireAdmin={true}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold">Onaylar ve İncelemeler</h1>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Bekleyen İncelemeler</p>
                      <p className="text-2xl font-bold text-gray-900">{totalPendingReviews}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Building className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Klinik Başvuruları</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingClinics?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Belge İncelemeleri</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingDocuments?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Stethoscope className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Tedavi Onayları</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingTreatments?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Approval Tabs */}
            <Tabs defaultValue="clinics" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="clinics">
                  Klinik Başvuruları ({pendingClinics?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="documents">
                  Belge İncelemeleri ({pendingDocuments?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="treatments">
                  Tedavi Onayları ({pendingTreatments?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="clinics">
                <Card>
                  <CardHeader>
                    <CardTitle>Bekleyen Klinik Başvuruları</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clinicsLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                          </div>
                        ))}
                      </div>
                    ) : pendingClinics && pendingClinics.length > 0 ? (
                      <div className="space-y-6">
                        {pendingClinics.map((clinic) => (
                          <ClinicApproval 
                            key={clinic.id} 
                            clinic={clinic} 
                            onStatusChange={refetchClinics} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Bekleyen klinik başvurusu yok</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Bekleyen Belge İncelemeleri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {documentsLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
                          </div>
                        ))}
                      </div>
                    ) : pendingDocuments && pendingDocuments.length > 0 ? (
                      <div className="space-y-4">
                        {pendingDocuments.map((document) => (
                          <DocumentReview 
                            key={document.id} 
                            document={document} 
                            onStatusChange={refetchDocuments} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Bekleyen belge incelemesi yok</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="treatments">
                <Card>
                  <CardHeader>
                    <CardTitle>Tedavi Onayları</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {treatmentsLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                          </div>
                        ))}
                      </div>
                    ) : pendingTreatments && pendingTreatments.length > 0 ? (
                      <div className="space-y-6">
                        {pendingTreatments.map((treatment) => (
                          <TreatmentApproval 
                            key={treatment.id} 
                            treatment={treatment} 
                            onStatusChange={refetchTreatments} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Bekleyen tedavi onayı yok</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AdminApprovals;
