
import React from 'react';
import HeroSection from '@/components/HeroSection';
import TreatmentCategories from '@/components/TreatmentCategories';
import FeaturedClinics from '@/components/FeaturedClinics';
import MedicalHistorySection from '@/components/MedicalHistorySection';
import OasisTrainingSection from '@/components/OasisTrainingSection';
import AIMedicalScribeSection from '@/components/AIMedicalScribeSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import SectionDivider from '@/components/SectionDivider';

const Index = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <TreatmentCategories />
      <SectionDivider variant="gradient" />
      <FeaturedClinics />
      <SectionDivider variant="wave" />
      <MedicalHistorySection />
      <SectionDivider variant="dots" />
      <OasisTrainingSection />
      <SectionDivider variant="gradient" />
      <AIMedicalScribeSection />
      <TestimonialsSection />
    </div>
  );
};

export default Index;
