
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, Calendar, TrendingUp, Users } from 'lucide-react';

interface TreatmentTabsProps {
  treatment: any;
}

const TreatmentTabs: React.FC<TreatmentTabsProps> = ({ treatment }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1 rounded-t-xl">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="details">Detaylar</TabsTrigger>
          <TabsTrigger value="clinic">Klinik</TabsTrigger>
          <TabsTrigger value="reviews">Yorumlar</TabsTrigger>
        </TabsList>
        
        <div className="p-6">
          <TabsContent value="overview" className="mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Bu Tedavi Hakkında</h3>
                <p className="text-gray-600 leading-relaxed">{treatment.description}</p>
              </div>

              {treatment.features && treatment.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Temel Özellikler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {treatment.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {treatment.included_services && treatment.included_services.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Paket İçeriği</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {treatment.included_services.map((service: string, index: number) => (
                      <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-semibold">Tedavi Süresi</div>
                      <div className="text-gray-600">{treatment.duration_days} gün</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-semibold">İyileşme Süresi</div>
                      <div className="text-gray-600">{treatment.recovery_days} gün</div>
                    </div>
                  </div>

                  {treatment.success_rate && (
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-semibold">Başarı Oranı</div>
                        <div className="text-gray-600">%{treatment.success_rate}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="clinic" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {treatment.clinics?.logo_url ? (
                  <img 
                    src={treatment.clinics.logo_url} 
                    alt={treatment.clinics.name}
                    className="w-16 h-16 rounded-lg object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{treatment.clinics?.name}</h3>
                  <p className="text-gray-600 mb-3">{treatment.clinics?.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {treatment.clinics?.established_year && (
                      <div>
                        <span className="font-medium">Kuruluş:</span> {treatment.clinics.established_year}
                      </div>
                    )}
                    {treatment.clinics?.languages && (
                      <div>
                        <span className="font-medium">Diller:</span> {treatment.clinics.languages.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <p>Klinik iletişim bilgileri rezervasyon sürecinde paylaşılacaktır.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Henüz yorum bulunmuyor</h3>
              <p>Bu tedavi için ilk yorumu siz yazabilirsiniz.</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TreatmentTabs;
