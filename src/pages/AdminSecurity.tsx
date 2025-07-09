import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSecuritySettings } from '@/hooks/useSecuritySettings';
import { 
  Shield, 
  Users, 
  Key, 
  Activity, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Settings,
  UserCheck,
  Ban,
  Info
} from 'lucide-react';

const AdminSecurity = () => {
  const { settings, activities, isLoading, updateSecuritySettings } = useSecuritySettings();
  const [localSettings, setLocalSettings] = useState(settings);

  // Mock data for demonstration - in real app, get from useSecuritySettings hook
  const securityStats = [
    {
      title: "Toplam Kullanıcı",
      value: "1,247",
      status: "normal",
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Aktif Oturumlar",
      value: "89",
      status: "normal",
      icon: <Activity className="w-5 h-5" />
    },
    {
      title: "Şüpheli Aktivite",
      value: "3",
      status: "warning",
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      title: "Engellenen IP",
      value: "12",
      status: "info",
      icon: <Ban className="w-5 h-5" />
    }
  ];

  const activeUsers = [
    {
      id: 1,
      email: "admin@example.com",
      role: "admin",
      lastActive: "2 min ago",
      status: "online",
      location: "Istanbul, TR"
    },
    {
      id: 2,
      email: "clinic@example.com",
      role: "clinic",
      lastActive: "5 min ago",
      status: "online",
      location: "Ankara, TR"
    },
    {
      id: 3,
      email: "patient@example.com",
      role: "patient",
      lastActive: "1 hour ago",
      status: "away",
      location: "Berlin, DE"
    }
  ];

  const handleSaveSettings = () => {
    updateSecuritySettings(localSettings);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

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
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Güvenlik Yönetimi</h1>
                  <p className="text-gray-600 mt-1">Sistem güvenliği ve kullanıcı erişimlerini yönetin</p>
                </div>
              </div>
            </div>

            {/* Demo Alert */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Güvenlik modülü demo modunda çalışmaktadır. Gerçek güvenlik ayarları için sistem yöneticisine başvurun.
              </AlertDescription>
            </Alert>

            {/* Security Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {securityStats.map((stat, index) => (
                <Card key={index} className="border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${getStatusColor(stat.status)}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content */}
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
                <TabsTrigger value="users" className="flex items-center gap-2 p-3">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Kullanıcı Yönetimi</span>
                  <span className="sm:hidden">Kullanıcılar</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 p-3">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Güvenlik Ayarları</span>
                  <span className="sm:hidden">Ayarlar</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2 p-3">
                  <Activity className="w-4 h-4" />
                  <span className="hidden sm:inline">Aktivite İzleme</span>
                  <span className="sm:hidden">Aktivite</span>
                </TabsTrigger>
                <TabsTrigger value="access" className="flex items-center gap-2 p-3">
                  <Key className="w-4 h-4" />
                  <span className="hidden sm:inline">Erişim Kontrolü</span>
                  <span className="sm:hidden">Erişim</span>
                </TabsTrigger>
              </TabsList>

              {/* User Management */}
              <TabsContent value="users" className="space-y-6">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                      Aktif Kullanıcılar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                  {user.role}
                                </Badge>
                                <span className="text-sm text-gray-500">{user.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">Son Aktivite</p>
                              <p className="text-sm text-gray-500">{user.lastActive}</p>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${
                              user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-green-600" />
                        İki Faktörlü Kimlik Doğrulama
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="2fa">2FA Durumu</Label>
                          <p className="text-sm text-gray-500 mt-1">
                            Sistemde iki faktörlü kimlik doğrulama
                          </p>
                        </div>
                        <Switch
                          id="2fa"
                          checked={localSettings.twoFactorEnabled}
                          onCheckedChange={(checked) => 
                            setLocalSettings(prev => ({ ...prev, twoFactorEnabled: checked }))
                          }
                        />
                      </div>
                      {localSettings.twoFactorEnabled && (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            İki faktörlü kimlik doğrulama aktif. Kullanıcılar giriş yaparken SMS veya e-posta kodu gerekecek.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5 text-blue-600" />
                        Şifre Politikası
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="minLength">Minimum Uzunluk</Label>
                        <Input
                          id="minLength"
                          type="number"
                          value={localSettings.passwordPolicy.minLength}
                          onChange={(e) => setLocalSettings(prev => ({
                            ...prev,
                            passwordPolicy: {
                              ...prev.passwordPolicy,
                              minLength: parseInt(e.target.value)
                            }
                          }))}
                          className="mt-1"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="uppercase">Büyük Harf Gerekli</Label>
                          <Switch
                            id="uppercase"
                            checked={localSettings.passwordPolicy.requireUppercase}
                            onCheckedChange={(checked) => setLocalSettings(prev => ({
                              ...prev,
                              passwordPolicy: {
                                ...prev.passwordPolicy,
                                requireUppercase: checked
                              }
                            }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="numbers">Rakam Gerekli</Label>
                          <Switch
                            id="numbers"
                            checked={localSettings.passwordPolicy.requireNumbers}
                            onCheckedChange={(checked) => setLocalSettings(prev => ({
                              ...prev,
                              passwordPolicy: {
                                ...prev.passwordPolicy,
                                requireNumbers: checked
                              }
                            }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="symbols">Sembol Gerekli</Label>
                          <Switch
                            id="symbols"
                            checked={localSettings.passwordPolicy.requireSymbols}
                            onCheckedChange={(checked) => setLocalSettings(prev => ({
                              ...prev,
                              passwordPolicy: {
                                ...prev.passwordPolicy,
                                requireSymbols: checked
                              }
                            }))}
                          />
                        </div>
                      </div>
                      <Button onClick={handleSaveSettings} className="w-full mt-4">
                        Ayarları Kaydet
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Activity Monitoring */}
              <TabsContent value="activity" className="space-y-6">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      Son Güvenlik Aktiviteleri
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : activities.length === 0 ? (
                      <div className="text-center p-8 text-gray-500">
                        Henüz güvenlik aktivitesi bulunmuyor
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activities.slice(0, 5).map((activity) => (
                          <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <div>
                                <p className="font-medium text-gray-900">{activity.action}</p>
                                <p className="text-sm text-gray-500">
                                  {activity.user_email} → {activity.target}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getSeverityColor(activity.severity)}>
                                {activity.severity}
                              </Badge>
                              <span className="text-sm text-gray-500">{activity.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Access Control */}
              <TabsContent value="access" className="space-y-6">
                <div className="text-center p-12 bg-white rounded-lg border border-gray-200">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Erişim Kontrolü</h3>
                  <p className="text-gray-500 mb-4">Bu modül yakında eklenecek</p>
                  <p className="text-sm text-gray-400">IP kısıtlamaları, coğrafi erişim kontrolü ve API anahtarı yönetimi</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminSecurity;
