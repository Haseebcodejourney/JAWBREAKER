
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Star, MapPin, Clock, DollarSign, Search } from 'lucide-react';
import { SearchFilters, useLocationData, usePopularFeatures } from '@/hooks/useAdvancedSearch';

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: any) => void;
  onReset: () => void;
  activeFiltersCount: number;
}

const categories = [
  { value: 'hair_transplant', label: 'Saç Ekimi' },
  { value: 'dental', label: 'Diş Tedavisi' },
  { value: 'cosmetic_surgery', label: 'Estetik Cerrahi' },
  { value: 'eye_surgery', label: 'Göz Ameliyatı' },
  { value: 'orthopedic', label: 'Ortopedi' },
  { value: 'cardiology', label: 'Kardiyoloji' },
  { value: 'fertility', label: 'Fertilite' },
  { value: 'bariatric_surgery', label: 'Bariatrik Cerrahi' },
  { value: 'oncology', label: 'Onkoloji' },
  { value: 'other', label: 'Diğer' }
];

const durationRanges = [
  { value: '1-3', label: '1-3 gün' },
  { value: '4-7', label: '4-7 gün' },
  { value: '8-14', label: '1-2 hafta' },
  { value: '15-30', label: '2-4 hafta' },
  { value: '31', label: '1 ay+' }
];

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  activeFiltersCount
}) => {
  const { data: locationData } = useLocationData();
  const { data: popularFeatures } = usePopularFeatures();

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    onFilterChange('features', newFeatures);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtreler
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              Temizle
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Arama */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Arama
          </Label>
          <Input
            placeholder="Tedavi adı veya açıklama..."
            value={filters.query}
            onChange={(e) => onFilterChange('query', e.target.value)}
          />
        </div>

        {/* Kategori */}
        <div className="space-y-2">
          <Label>Kategori</Label>
          <Select 
            value={filters.category} 
            onValueChange={(value) => onFilterChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tümü</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Konum */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Konum
          </Label>
          
          <Select 
            value={filters.country} 
            onValueChange={(value) => onFilterChange('country', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ülke seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tüm ülkeler</SelectItem>
              {locationData?.countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filters.city} 
            onValueChange={(value) => onFilterChange('city', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Şehir seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tüm şehirler</SelectItem>
              {locationData?.cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fiyat Aralığı */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Fiyat Aralığı
          </Label>
          <div className="px-2">
            <Slider
              value={[filters.priceMin, filters.priceMax]}
              onValueChange={([min, max]) => {
                onFilterChange('priceMin', min);
                onFilterChange('priceMax', max);
              }}
              max={100000}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>${filters.priceMin.toLocaleString()}</span>
              <span>${filters.priceMax.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Puan */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Minimum Puan
          </Label>
          <Select 
            value={filters.rating.toString()} 
            onValueChange={(value) => onFilterChange('rating', parseFloat(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Puan seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tümü</SelectItem>
              <SelectItem value="4">4+ Yıldız</SelectItem>
              <SelectItem value="4.5">4.5+ Yıldız</SelectItem>
              <SelectItem value="5">5 Yıldız</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Süre */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Tedavi Süresi
          </Label>
          <Select 
            value={filters.duration} 
            onValueChange={(value) => onFilterChange('duration', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Süre seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tümü</SelectItem>
              {durationRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Özellikler */}
        {popularFeatures && popularFeatures.length > 0 && (
          <div className="space-y-3">
            <Label>Popüler Özellikler</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {popularFeatures.slice(0, 10).map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={filters.features.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={feature} className="text-sm cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sadece Onaylı Klinikler */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="verified"
            checked={filters.verified}
            onCheckedChange={(checked) => onFilterChange('verified', checked)}
          />
          <Label htmlFor="verified" className="text-sm cursor-pointer">
            Sadece onaylı klinikler
          </Label>
        </div>

        {/* Aktif Filtreler */}
        {activeFiltersCount > 0 && (
          <div className="space-y-2">
            <Label>Aktif Filtreler</Label>
            <div className="flex flex-wrap gap-2">
              {filters.query && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  "{filters.query}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => onFilterChange('query', '')} />
                </Badge>
              )}
              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find(c => c.value === filters.category)?.label}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => onFilterChange('category', '')} />
                </Badge>
              )}
              {filters.country && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.country}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => onFilterChange('country', '')} />
                </Badge>
              )}
              {filters.features.map((feature) => (
                <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleFeatureToggle(feature)} />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSearchFilters;
