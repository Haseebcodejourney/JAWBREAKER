
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Share2, CheckCircle } from 'lucide-react';

interface BookingCardProps {
  treatment: any;
  activeCampaign: any;
  discountedPrice: number | null;
  getCategoryLabel: (category: string) => string;
  handleBookNow: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  treatment,
  activeCampaign,
  discountedPrice,
  getCategoryLabel,
  handleBookNow
}) => {
  return (
    <div className="sticky top-6">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          {/* Price Section */}
          <div className="text-center mb-6">
            {discountedPrice ? (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  USD {discountedPrice.toLocaleString()}
                </div>
                <div className="text-lg text-gray-500 line-through">
                  USD {treatment.price_from?.toLocaleString()}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  {activeCampaign?.discount_percentage 
                    ? `%${activeCampaign.discount_percentage} İndirim`
                    : `${activeCampaign?.discount_amount} USD İndirim`
                  }
                </div>
              </div>
            ) : (
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {treatment.price_from && treatment.price_to 
                  ? `USD ${treatment.price_from.toLocaleString()} - ${treatment.price_to.toLocaleString()}`
                  : 'Fiyat için iletişime geçin'
                }
              </div>
            )}
            <div className="text-gray-600">kişi başı</div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3 font-semibold"
              onClick={handleBookNow}
            >
              Bu Tedaviyi Rezerve Et
            </Button>

            <Button variant="outline" className="w-full text-lg py-3 border-2">
              Ücretsiz Danışmanlık
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center">
                <Heart className="w-4 h-4 mr-1" />
                Kaydet
              </Button>
              <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center">
                <Share2 className="w-4 h-4 mr-1" />
                Paylaş
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Ücretsiz konsültasyon</span>
            </div>
            <div className="flex items-center justify-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Gizli ücret yok</span>
            </div>
            <div className="flex items-center justify-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>24/7 destek</span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Hızlı Bilgiler</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Süre:</span>
                <span className="font-medium">{treatment.duration_days} gün</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">İyileşme:</span>
                <span className="font-medium">{treatment.recovery_days} gün</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kategori:</span>
                <span className="font-medium">{getCategoryLabel(treatment.category)}</span>
              </div>
              {treatment.success_rate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Başarı:</span>
                  <span className="font-medium text-green-600">%{treatment.success_rate}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCard;
