
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Users,
  Building,
  Activity,
  FileDown,
  Loader2
} from 'lucide-react';
import { useAdminReports, useReportGeneration } from '@/hooks/useAdminReports';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminReports = () => {
  const { data: reportStats, isLoading, error } = useAdminReports();
  const { generateReport } = useReportGeneration();
  const { toast } = useToast();
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const handleGenerateReport = async (reportType: string, reportTitle: string) => {
    setGeneratingReport(reportType);
    
    try {
      const reportData = await generateReport(reportType);
      
      // Create and download the report file
      const blob = new Blob([JSON.stringify(reportData.data, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = reportData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Rapor İndirildi",
        description: `${reportTitle} raporu başarıyla indirildi.`,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Hata",
        description: "Rapor oluşturulurken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setGeneratingReport(null);
    }
  };

  const handleExportAll = async () => {
    setGeneratingReport('all');
    
    try {
      const reportTypes = [
        { type: 'revenue', title: 'Gelir Analizi' },
        { type: 'patients', title: 'Hasta Demografileri' },
        { type: 'clinics', title: 'Klinik Performansı' },
        { type: 'treatments', title: 'Tedavi Popülaritesi' }
      ];

      for (const report of reportTypes) {
        await handleGenerateReport(report.type, report.title);
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      toast({
        title: "Tüm Raporlar İndirildi",
        description: "Tüm raporlar başarıyla indirildi.",
      });
    } catch (error) {
      console.error('Error exporting all reports:', error);
      toast({
        title: "Hata",
        description: "Raporlar dışa aktarılırken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setGeneratingReport(null);
    }
  };

  const reportTypes = [
    {
      title: 'Gelir Analizi',
      description: 'Klinik, tedavi ve zaman periyoduna göre detaylı gelir dökümü',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      type: 'revenue'
    },
    {
      title: 'Hasta Demografileri',
      description: 'Yaş, konum ve tedavi tercihlerine göre hasta dağılımı',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      type: 'patients'
    },
    {
      title: 'Klinik Performansı',
      description: 'Klinik sıralamaları, değerlendirmeler ve rezervasyon dönüşüm oranları',
      icon: Building,
      color: 'bg-purple-100 text-purple-600',
      type: 'clinics'
    },
    {
      title: 'Tedavi Popülaritesi',
      description: 'En çok rezerve edilen tedaviler ve mevsimsel trendler',
      icon: BarChart3,
      color: 'bg-orange-100 text-orange-600',
      type: 'treatments'
    }
  ];

  if (error) {
    console.error('Error loading reports:', error);
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold">Raporlar ve Analizler</h1>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" disabled>
                  <Calendar className="w-4 h-4 mr-2" />
                  Tarih Aralığı
                </Button>
                <Button 
                  onClick={handleExportAll}
                  disabled={generatingReport === 'all'}
                >
                  {generatingReport === 'all' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Tümünü Dışa Aktar
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : reportStats ? (
                [
                  {
                    title: 'Aylık Gelir',
                    data: reportStats.monthlyRevenue,
                    icon: DollarSign
                  },
                  {
                    title: 'Yeni Hastalar',
                    data: reportStats.newPatients,
                    icon: Users
                  },
                  {
                    title: 'Aktif Klinikler',
                    data: reportStats.activeClinics,
                    icon: Building
                  },
                  {
                    title: 'Dönüşüm Oranı',
                    data: reportStats.conversionRate,
                    icon: Activity
                  }
                ].map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.data.value}</p>
                          <p className={`text-sm ${stat.data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.data.change} geçen aydan
                          </p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.data.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                          <stat.icon className={`w-6 h-6 ${stat.data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-4 text-center py-8">
                  <p className="text-gray-500">Rapor verileri yüklenemedi</p>
                </div>
              )}
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {reportTypes.map((report, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${report.color}`}>
                        <report.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                        <p className="text-gray-600 mb-4">{report.description}</p>
                        <div className="flex space-x-2">
                          <Button size="sm" disabled>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Raporu Görüntüle
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleGenerateReport(report.type, report.title)}
                            disabled={generatingReport === report.type}
                          >
                            {generatingReport === report.type ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4 mr-2" />
                            )}
                            Dışa Aktar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Hızlı Rapor İşlemleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2"
                    onClick={() => handleGenerateReport('revenue', 'Günlük Özet')}
                    disabled={generatingReport === 'revenue'}
                  >
                    {generatingReport === 'revenue' ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <TrendingUp className="w-6 h-6" />
                    )}
                    <span>Günlük Özet</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2"
                    onClick={() => handleGenerateReport('patients', 'Haftalık Rapor')}
                    disabled={generatingReport === 'patients'}
                  >
                    {generatingReport === 'patients' ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Calendar className="w-6 h-6" />
                    )}
                    <span>Haftalık Rapor</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2"
                    onClick={() => handleGenerateReport('clinics', 'Aylık Analiz')}
                    disabled={generatingReport === 'clinics'}
                  >
                    {generatingReport === 'clinics' ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <BarChart3 className="w-6 h-6" />
                    )}
                    <span>Aylık Analiz</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AdminReports;
