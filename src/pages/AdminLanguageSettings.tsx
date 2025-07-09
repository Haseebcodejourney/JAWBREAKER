
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Globe, Settings, Users, Shield, Check, X } from 'lucide-react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminLanguageSettings = () => {
  const { language, setLanguage, availableLanguages, t, setIsAdmin } = useLanguage();
  const [systemLanguage, setSystemLanguage] = useState(language);
  const [forceSystemLanguage, setForceSystemLanguage] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsAdmin(true);
    localStorage.setItem('user-role', 'admin');
    
    const savedSystemLanguage = localStorage.getItem('system-language');
    const forceSystem = localStorage.getItem('force-system-language') === 'true';
    
    if (savedSystemLanguage) {
      setSystemLanguage(savedSystemLanguage);
    }
    setForceSystemLanguage(forceSystem);
  }, [setIsAdmin]);

  const handleSaveSystemLanguage = () => {
    localStorage.setItem('system-language', systemLanguage);
    localStorage.setItem('force-system-language', forceSystemLanguage.toString());
    
    if (forceSystemLanguage) {
      setLanguage(systemLanguage);
    }
    
    toast({
      title: "Başarılı",
      description: forceSystemLanguage 
        ? `Sistem dili ${availableLanguages.find(l => l.code === systemLanguage)?.name} olarak ayarlandı ve tüm kullanıcılar için zorlandı.`
        : `Sistem dili ${availableLanguages.find(l => l.code === systemLanguage)?.name} olarak ayarlandı. Kullanıcılar kendi tercihlerini seçebilir.`,
    });
  };

  const handleResetToUserPreferences = () => {
    localStorage.removeItem('system-language');
    localStorage.removeItem('force-system-language');
    setForceSystemLanguage(false);
    
    const userLanguage = localStorage.getItem('preferred-language') || 'tr';
    setLanguage(userLanguage);
    setSystemLanguage(userLanguage);
    
    toast({
      title: "Başarılı",
      description: 'Kullanıcı dil tercihleri geri yüklendi',
    });
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gray-50">
          <AdminSidebar />
          
          <main className="flex-1 p-4 lg:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dil Ayarları</h1>
                    <p className="text-gray-600 mt-1">Sistem geneli dil ayarlarını yönetin</p>
                  </div>
                </div>
                <Globe className="w-8 h-8 text-blue-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sistem Dili Ayarları */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="w-5 h-5" />
                      <span>Sistem Dili Ayarları</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="system-language">Sistem Dili</Label>
                      <Select value={systemLanguage} onValueChange={setSystemLanguage}>
                        <SelectTrigger id="system-language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableLanguages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              <div className="flex items-center space-x-2">
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="force-system">Tüm kullanıcılar için zorla</Label>
                        <p className="text-sm text-gray-600">
                          Kullanıcıların kendi dil tercihlerini geçersiz kılar
                        </p>
                      </div>
                      <Switch
                        id="force-system"
                        checked={forceSystemLanguage}
                        onCheckedChange={setForceSystemLanguage}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleSaveSystemLanguage} className="flex-1">
                        <Shield className="w-4 h-4 mr-2" />
                        Kaydet
                      </Button>
                      <Button variant="outline" onClick={handleResetToUserPreferences}>
                        Sıfırla
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Mevcut Durum */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Mevcut Durum</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Aktif Sistem Dili:</span>
                        <div className="flex items-center space-x-2">
                          <span>{availableLanguages.find(l => l.code === language)?.flag}</span>
                          <span className="font-medium">{availableLanguages.find(l => l.code === language)?.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Zorunlu Sistem Dili:</span>
                        <div className="flex items-center space-x-2">
                          {forceSystemLanguage ? (
                            <>
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 font-medium">Aktif</span>
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-500">Pasif</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Kullanıcı Seçimi:</span>
                        <div className="flex items-center space-x-2">
                          {!forceSystemLanguage ? (
                            <>
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 font-medium">İzin Veriliyor</span>
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 text-red-500" />
                              <span className="text-red-500 font-medium">Kısıtlı</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Desteklenen Diller:</h4>
                      <div className="space-y-2">
                        {availableLanguages.map(lang => (
                          <div key={lang.code} className="flex items-center justify-between p-2 bg-white border rounded-lg">
                            <div className="flex items-center space-x-2">
                              <span>{lang.flag}</span>
                              <span className="font-medium">{lang.name}</span>
                              <span className="text-sm text-gray-500">({lang.code.toUpperCase()})</span>
                            </div>
                            {language === lang.code && (
                              <div className="flex items-center space-x-1">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-green-600 text-sm font-medium">Aktif</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Dil Yönetimi Bilgileri */}
              <Card>
                <CardHeader>
                  <CardTitle>Dil Yönetimi Rehberi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-green-600">✓ Admin Yetkileri:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Sistem geneli dil ayarlarını değiştirebilirsiniz</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Kullanıcı tercihlerini geçersiz kılabilirsiniz</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Tüm çeviriler otomatik olarak uygulanır</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Dil kilidleme özelliğini kullanabilirsiniz</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 text-blue-600">ℹ Kullanıcı Deneyimi:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Kullanıcılar kendi dillerini seçebilir</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Tercihler tarayıcıda güvenle saklanır</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Admin zorlaması kullanıcı tercihini geçersiz kılar</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Kilit simgesi kısıtlı durumu gösterir</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AdminLanguageSettings;
