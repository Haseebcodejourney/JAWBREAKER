
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import AdvancedSearchFilters from '@/components/AdvancedSearchFilters';
import TreatmentCard from '@/components/TreatmentCard/TreatmentCard';
import { usePriceCampaigns } from '@/hooks/usePriceCampaigns';
import { useTreatmentPackages } from '@/hooks/useTreatmentPackages';

const AdvancedSearch = () => {
  const {
    filters,
    updateFilter,
    resetFilters,
    activeFiltersCount,
    results,
    loading,
    error
  } = useAdvancedSearch();
  
  const { data: campaigns } = usePriceCampaigns();
  const { data: packages } = useTreatmentPackages();
  
  const [showFilters, setShowFilters] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const getTreatmentCampaigns = (treatmentId: string) => {
    return campaigns?.filter(campaign => campaign.treatment_id === treatmentId) || [];
  };

  const getTreatmentPackages = (treatmentId: string) => {
    return packages?.filter(pkg => pkg.treatment_id === treatmentId) || [];
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Arama Hatası</h2>
            <p className="text-gray-600 mb-8">Arama yapılırken bir hata oluştu. Lütfen tekrar deneyin.</p>
            <Button onClick={() => window.location.reload()}>Sayfayı Yenile</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Tedavi adı, klinik veya şehir arayın..."
                  value={filters.query}
                  onChange={(e) => updateFilter('query', e.target.value)}
                  className="pl-10 text-lg py-3"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtreler
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
              
              <div className="flex items-center gap-1 bg-white rounded-lg p-1 border">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <AdvancedSearchFilters
              filters={filters}
              onFilterChange={updateFilter}
              onReset={resetFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {loading ? 'Aranıyor...' : `${results.length} sonuç bulundu`}
                </h2>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Filtreleri Temizle
                  </Button>
                )}
              </div>
              
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => updateFilter('sortBy', value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">İlgi Düzeyi</SelectItem>
                  <SelectItem value="price">Fiyat</SelectItem>
                  <SelectItem value="rating">En Yüksek Puan</SelectItem>
                  <SelectItem value="popularity">Popülerlik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                    <div className="h-48 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-6'
              }>
                {results.map((treatment) => (
                  <TreatmentCard
                    key={treatment.id}
                    treatment={treatment}
                    campaigns={getTreatmentCampaigns(treatment.id)}
                    packages={getTreatmentPackages(treatment.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-500 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2">Sonuç bulunamadı</h3>
                  <p>Arama kriterlerinizi değiştirmeyi deneyin.</p>
                </div>
                <Button onClick={resetFilters} variant="outline">
                  Tüm Filtreleri Temizle
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdvancedSearch;
