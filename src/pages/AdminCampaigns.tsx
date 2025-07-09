
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Target, Info, Plus, Search, Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';

const AdminCampaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock campaign data
  const campaigns = [
    {
      id: 1,
      name: 'Yaz Diş Beyazlatma Kampanyası',
      type: 'discount',
      status: 'active',
      discount: 25,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      usedCount: 45,
      maxUses: 100,
      revenue: 12500
    },
    {
      id: 2,
      name: 'Saç Ekimi Erken Rezervasyon',
      type: 'early_bird',
      status: 'active',
      discount: 15,
      startDate: '2024-05-15',
      endDate: '2024-07-15',
      usedCount: 23,
      maxUses: 50,
      revenue: 34500
    },
    {
      id: 3,
      name: 'Estetik Cerrahi Paketi',
      type: 'bundle',
      status: 'scheduled',
      discount: 30,
      startDate: '2024-08-01',
      endDate: '2024-09-30',
      usedCount: 0,
      maxUses: 75,
      revenue: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'scheduled': return 'Planlanmış';
      case 'expired': return 'Süresi Dolmuş';
      default: return 'Bilinmiyor';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Kampanya Yönetimi</h1>
                  <p className="text-gray-600 mt-1">Pazarlama kampanyalarını oluşturun ve yönetin</p>
                </div>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Yeni Kampanya
              </Button>
            </div>

            {/* Demo Alert */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Kampanya yönetimi sistemi demo modunda çalışmaktadır. Gerçek kampanya verileri için price_campaigns tablosu kullanılacaktır.
              </AlertDescription>
            </Alert>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Aktif Kampanyalar</p>
                      <p className="text-2xl font-bold text-gray-900">2</p>
                    </div>
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Kullanım</p>
                      <p className="text-2xl font-bold text-gray-900">68</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                      <p className="text-2xl font-bold text-gray-900">₺47,000</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Dönüşüm Oranı</p>
                      <p className="text-2xl font-bold text-gray-900">%32</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Kampanya ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Campaigns List */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Kampanyalar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                          <Badge className={getStatusColor(campaign.status)}>
                            {getStatusText(campaign.status)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{campaign.discount}% İndirim</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{campaign.startDate} - {campaign.endDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{campaign.usedCount}/{campaign.maxUses} Kullanım</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>₺{campaign.revenue.toLocaleString()} Gelir</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Düzenle</Button>
                        <Button variant="outline" size="sm">İstatistikler</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminCampaigns;
