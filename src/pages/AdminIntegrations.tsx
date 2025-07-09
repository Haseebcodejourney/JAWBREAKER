
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Info, Settings, CheckCircle, XCircle, Globe, Mail, CreditCard } from 'lucide-react';

const AdminIntegrations = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'Stripe Ödeme',
      description: 'Online ödeme işlemleri için Stripe entegrasyonu',
      icon: CreditCard,
      status: 'connected',
      enabled: true,
      category: 'payment'
    },
    {
      id: 2,
      name: 'SendGrid Email',
      description: 'Otomatik email gönderimi için SendGrid',
      icon: Mail,
      status: 'connected',
      enabled: true,
      category: 'communication'
    },
    {
      id: 3,
      name: 'Google Analytics',
      description: 'Web sitesi analitik verileri',
      icon: Globe,
      status: 'disconnected',
      enabled: false,
      category: 'analytics'
    },
    {
      id: 4,
      name: 'Zapier Webhook',
      description: 'Otomatik iş akışları için Zapier entegrasyonu',
      icon: Zap,
      status: 'connected',
      enabled: true,
      category: 'automation'
    }
  ]);

  const toggleIntegration = (id: number) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, enabled: !integration.enabled }
          : integration
      )
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'connected' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: string) => {
    return status === 'connected' 
      ? <CheckCircle className="w-4 h-4 text-green-600" />
      : <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment': return 'bg-blue-100 text-blue-800';
      case 'communication': return 'bg-purple-100 text-purple-800';
      case 'analytics': return 'bg-orange-100 text-orange-800';
      case 'automation': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AdminSidebar />
        
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Entegrasyonlar</h1>
                  <p className="text-gray-600 mt-1">Üçüncü parti servisleri yönetin</p>
                </div>
              </div>
              <Button className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Yeni Entegrasyon Ekle
              </Button>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Entegrasyonlar demo modunda gösterilmektedir. API anahtarları güvenli şekilde saklanmaktadır.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Entegrasyon</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Aktif</p>
                      <p className="text-2xl font-bold text-gray-900">8</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bağlantı Hatası</p>
                      <p className="text-2xl font-bold text-gray-900">1</p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Mevcut Entegrasyonlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <integration.icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                            <p className="text-sm text-gray-600">{integration.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={integration.enabled}
                          onCheckedChange={() => toggleIntegration(integration.id)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(integration.category)}>
                            {integration.category}
                          </Badge>
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status === 'connected' ? 'Bağlı' : 'Bağlantı Yok'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusIcon(integration.status)}
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
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

export default AdminIntegrations;
