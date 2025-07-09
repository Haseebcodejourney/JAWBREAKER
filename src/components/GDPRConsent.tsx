
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGDPRCompliance, ConsentType } from '@/hooks/useGDPRCompliance';
import { Shield, Trash2, Eye, BarChart3, Cookie } from 'lucide-react';

const GDPRConsent: React.FC = () => {
  const {
    consents,
    isLoading,
    updateConsent,
    hasConsent,
    requestDataDeletion
  } = useGDPRCompliance();

  const consentTypes: { key: ConsentType; title: string; description: string; icon: React.ReactNode }[] = [
    {
      key: 'data_processing',
      title: 'Veri İşleme',
      description: 'Kişisel verilerinizin platform hizmetleri için işlenmesine izin verirsiniz.',
      icon: <Shield className="w-5 h-5" />
    },
    {
      key: 'marketing',
      title: 'Pazarlama İletişimi',
      description: 'Size özel teklifler ve güncellemeler göndermemize izin verirsiniz.',
      icon: <Eye className="w-5 h-5" />
    },
    {
      key: 'analytics',
      title: 'Analitik Veriler',
      description: 'Platform deneyimini geliştirmek için kullanım verilerinizi toplamamıza izin verirsiniz.',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      key: 'cookies',
      title: 'Çerezler',
      description: 'Tarayıcı deneyiminizi kişiselleştirmek için çerezleri kullanmamıza izin verirsiniz.',
      icon: <Cookie className="w-5 h-5" />
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-6 h-6" />
            <span>Gizlilik ve Veri Koruma</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            GDPR uyumluluğu kapsamında veri kullanım izinlerinizi yönetin.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {consentTypes.map((type, index) => (
            <div key={type.key}>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-blue-600 mt-1">
                    {type.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{type.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={hasConsent(type.key)}
                  onCheckedChange={(checked) => updateConsent(type.key, checked)}
                  disabled={isLoading}
                />
              </div>
              {index < consentTypes.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium text-red-600 flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Veri Silme Talebi</span>
            </h3>
            <p className="text-sm text-gray-600">
              Tüm kişisel verilerinizin sistemden silinmesini talep edebilirsiniz. 
              Bu işlem geri alınamaz ve 30 gün içinde tamamlanır.
            </p>
            <Button
              variant="destructive"
              onClick={requestDataDeletion}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Verilerimi Sil</span>
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-2">
            <p>
              Bu ayarlar GDPR (Genel Veri Koruma Yönetmeliği) kapsamında haklarınızı korumak için tasarlanmıştır.
            </p>
            <p>
              Veri kullanımı hakkında daha fazla bilgi için Gizlilik Politikamızı inceleyebilirsiniz.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GDPRConsent;
