
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings,
  Globe,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Save
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const CMSSiteSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: currentSettings, isLoading } = useSiteSettings();
  const [settings, setSettings] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: { [key: string]: string }) => {
      console.log('Updating site settings:', newSettings);
      
      const updates = Object.entries(newSettings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update, { 
            onConflict: 'setting_key',
            ignoreDuplicates: false 
          });
        
        if (error) throw error;
      }

      return newSettings;
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Site ayarları başarıyla güncellendi",
      });
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
    onError: (error) => {
      console.error('Settings update error:', error);
      toast({
        title: "Hata",
        description: "Site ayarları güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Site Ayarları</h2>
          <p className="text-gray-600">Genel site ayarlarını yönetin</p>
        </div>
        <Button onClick={handleSave} disabled={updateSettingsMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {updateSettingsMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="contact">İletişim</TabsTrigger>
          <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="advanced">Gelişmiş</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Genel Ayarlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_title">Site Başlığı</Label>
                  <Input
                    id="site_title"
                    value={settings.site_title || ''}
                    onChange={(e) => handleInputChange('site_title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site_logo_url">Logo URL</Label>
                  <Input
                    id="site_logo_url"
                    value={settings.site_logo_url || ''}
                    onChange={(e) => handleInputChange('site_logo_url', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description">Site Açıklaması</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description || ''}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer_text">Footer Metni</Label>
                <Input
                  id="footer_text"
                  value={settings.footer_text || ''}
                  onChange={(e) => handleInputChange('footer_text', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                İletişim Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">E-posta</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Telefon</Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone || ''}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_address">Adres</Label>
                <Textarea
                  id="contact_address"
                  value={settings.contact_address || ''}
                  onChange={(e) => handleInputChange('contact_address', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Sosyal Medya Linkleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="social_facebook" className="flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </Label>
                  <Input
                    id="social_facebook"
                    value={settings.social_facebook || ''}
                    onChange={(e) => handleInputChange('social_facebook', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="social_instagram" className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Label>
                  <Input
                    id="social_instagram"
                    value={settings.social_instagram || ''}
                    onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_twitter" className="flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </Label>
                  <Input
                    id="social_twitter"
                    value={settings.social_twitter || ''}
                    onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_linkedin" className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Label>
                  <Input
                    id="social_linkedin"
                    value={settings.social_linkedin || ''}
                    onChange={(e) => handleInputChange('social_linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gelişmiş Ayarlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="analytics_code">Google Analytics Kodu</Label>
                <Textarea
                  id="analytics_code"
                  value={settings.analytics_code || ''}
                  onChange={(e) => handleInputChange('analytics_code', e.target.value)}
                  rows={5}
                  placeholder="Google Analytics veya diğer tracking kodlarını buraya ekleyin"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CMSSiteSettings;
