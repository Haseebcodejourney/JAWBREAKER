
import React from 'react';
import { AlertTriangle, Stethoscope, Shield, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCMSPage } from '@/hooks/useCMSPage';

const MedicalDisclaimer = () => {
  const { language } = useLanguage();
  const { data: pageData, isLoading } = useCMSPage('medical-disclaimer-page', language);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Yükleniyor..." />
      </div>
    );
  }

  // Fallback content if no CMS data
  const defaultContent = (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Platform Purpose
        </h2>
        <p className="text-gray-700">
          JAW BREAKER is a medical tourism booking platform that connects patients with 
          healthcare providers worldwide. We facilitate bookings, travel arrangements, and 
          coordination services but <strong>do not provide medical care, advice, diagnosis, or treatment</strong>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">No Medical Advice</h2>
        <div className="text-gray-700 space-y-4">
          <p>
            The information provided on our platform, including treatment descriptions, 
            clinic profiles, and educational content, is for informational purposes only and 
            should not be considered medical advice.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="font-semibold text-yellow-800 mb-2">Always Consult Healthcare Professionals</p>
            <ul className="list-disc pl-6 space-y-1 text-yellow-700">
              <li>Before making any medical decisions</li>
              <li>For diagnosis of medical conditions</li>
              <li>For treatment recommendations</li>
              <li>Before traveling for medical procedures</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Stethoscope className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {pageData?.title || 'Medical Disclaimer'}
            </h1>
          </div>
          
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-8">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="font-semibold text-red-800">Important Medical Notice</p>
            </div>
            <p className="text-red-700">
              This disclaimer is legally required and important for your safety. Please read carefully.
            </p>
          </div>

          {pageData?.content ? (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          ) : (
            defaultContent
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
