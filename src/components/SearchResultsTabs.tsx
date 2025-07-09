
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ClinicCard from '@/components/ClinicCard';
import EnhancedTreatmentCard from '@/components/EnhancedTreatmentCard';
import { Building2, Stethoscope, AlertCircle } from 'lucide-react';

interface SearchResultsTabsProps {
  clinics: any[];
  treatments: any[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  clinicsLoading?: boolean;
  treatmentsLoading?: boolean;
  clinicsError?: Error | null;
  treatmentsError?: Error | null;
}

const SearchResultsTabs: React.FC<SearchResultsTabsProps> = ({
  clinics,
  treatments,
  activeTab,
  onTabChange,
  clinicsLoading = false,
  treatmentsLoading = false,
  clinicsError = null,
  treatmentsError = null
}) => {
  const convertClinicData = (clinic: any) => ({
    id: clinic.id,
    name: clinic.name || 'Unknown Clinic',
    city: clinic.city,
    country: clinic.country,
    cover_image_url: clinic.cover_image_url || 'https://images.unsplash.com/photo-1551601651-767bb2180d49?w=400&h=300&fit=crop',
    logo_url: clinic.logo_url,
    rating: clinic.rating || 0,
    review_count: clinic.review_count || 0,
    specialties: clinic.specialties || ['Hair Transplant', 'FUE', 'DHI'],
    verified: clinic.verified || false,
    featured: clinic.featured || false,
    description: clinic.description || '',
    languages: clinic.languages || ['English'],
    accreditations: clinic.accreditations || [],
    phone: clinic.phone,
    email: clinic.email,
    website: clinic.website,
    address: clinic.address
  });

  const handleViewTreatmentDetails = (treatmentId: string) => {
    window.location.href = `/treatment/${treatmentId}`;
  };

  const handleBookTreatment = (treatmentId: string) => {
    window.location.href = `/booking/${treatmentId}`;
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
          <div className="h-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  const ErrorAlert = ({ error, type }: { error: Error; type: string }) => (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Failed to load {type}. Please try refreshing the page. Error: {error.message}
      </AlertDescription>
    </Alert>
  );

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="clinics" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Clinics
          <Badge variant="secondary" className="ml-1">
            {clinics?.length || 0}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="treatments" className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4" />
          Treatments
          <Badge variant="secondary" className="ml-1">
            {treatments?.length || 0}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="clinics" className="space-y-6">
        {clinicsError && <ErrorAlert error={clinicsError} type="clinics" />}
        
        {clinicsLoading ? (
          <LoadingSkeleton />
        ) : clinics && clinics.length > 0 ? (
          <div className="space-y-6">
            {clinics.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={convertClinicData(clinic)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium mb-2 text-gray-700">No clinics found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="treatments" className="space-y-6">
        {treatmentsError && <ErrorAlert error={treatmentsError} type="treatments" />}
        
        {treatmentsLoading ? (
          <LoadingSkeleton />
        ) : treatments && treatments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((treatment) => (
              <EnhancedTreatmentCard
                key={treatment.id}
                treatment={treatment}
                campaigns={[]}
                packages={[]}
                onViewDetails={handleViewTreatmentDetails}
                onBookNow={handleBookTreatment}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Stethoscope className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium mb-2 text-gray-700">No treatments found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default SearchResultsTabs;
