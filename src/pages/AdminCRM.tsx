
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/ui/stats-card';
import LeadManagement from '@/components/crm/LeadManagement';
import CustomerSegmentation from '@/components/crm/CustomerSegmentation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Users, TrendingUp, Target, DollarSign } from 'lucide-react';

const AdminCRM = () => {
  // Mock stats data - replace with real data from your API
  const stats = [
    {
      title: "Toplam Lead",
      value: "2,847",
      change: {
        value: 12.5,
        type: "increase" as const,
        period: "last month"
      },
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Dönüşüm Oranı",
      value: "24.8%",
      change: {
        value: 3.2,
        type: "increase" as const,
        period: "last month"
      },
      icon: <Target className="w-5 h-5" />
    },
    {
      title: "Aylık Gelir",
      value: "$45,230",
      change: {
        value: 8.1,
        type: "increase" as const,
        period: "last month"
      },
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      title: "Aktif Leadler",
      value: "1,249",
      change: {
        value: 5.7,
        type: "increase" as const,
        period: "last month"
      },
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AdminSidebar />
        
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">CRM Dashboard</h1>
                  <p className="text-gray-600 mt-1">Müşteri ilişkileri ve satış süreçlerini yönetin</p>
                </div>
              </div>
            </div>

            {/* Demo Alert */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                CRM modülü şu anda demo modunda çalışmaktadır. Veritabanı migration'ları uygulandıktan sonra gerçek verilerle çalışacaktır.
              </AlertDescription>
            </Alert>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Main Content */}
            <Tabs defaultValue="leads" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
                <TabsTrigger value="leads" className="flex items-center gap-2 p-3">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Lead Yönetimi</span>
                  <span className="sm:hidden">Leadler</span>
                </TabsTrigger>
                <TabsTrigger value="segmentation" className="flex items-center gap-2 p-3">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Segmentasyon</span>
                  <span className="sm:hidden">Segment</span>
                </TabsTrigger>
                <TabsTrigger value="journeys" className="flex items-center gap-2 p-3">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Müşteri Yolculuğu</span>
                  <span className="sm:hidden">Yolculuk</span>
                </TabsTrigger>
                <TabsTrigger value="followup" className="flex items-center gap-2 p-3">
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">Otomatik Takip</span>
                  <span className="sm:hidden">Takip</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leads" className="space-y-6">
                <LeadManagement />
              </TabsContent>

              <TabsContent value="segmentation" className="space-y-6">
                <CustomerSegmentation />
              </TabsContent>

              <TabsContent value="journeys" className="space-y-6">
                <div className="text-center p-12 bg-white rounded-lg border border-gray-200">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Müşteri Yolculuğu</h3>
                  <p className="text-gray-500 mb-4">Bu modül yakında eklenecek</p>
                  <p className="text-sm text-gray-400">Müşteri deneyimi haritaları ve touchpoint analizleri</p>
                </div>
              </TabsContent>

              <TabsContent value="followup" className="space-y-6">
                <div className="text-center p-12 bg-white rounded-lg border border-gray-200">
                  <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Otomatik Takip Sistemi</h3>
                  <p className="text-gray-500 mb-4">Bu modül yakında eklenecek</p>
                  <p className="text-sm text-gray-400">E-posta otomasyonu ve lead nurturing kampanyaları</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminCRM;
