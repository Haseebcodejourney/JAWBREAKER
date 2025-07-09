
import React from 'react';
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCMSPage } from '@/hooks/useCMSPage';

const Terms = () => {
  const { language } = useLanguage();
  const { data: pageData, isLoading } = useCMSPage('terms-page', language);

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
        <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-700">
          By accessing and using JAW BREAKER's services, you accept and agree to be bound by 
          the terms and provision of this agreement.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">2. Service Description</h2>
        <div className="text-gray-700 space-y-4">
          <p>JAW BREAKER provides:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Medical tourism booking and coordination services</li>
            <li>Connection between patients and verified healthcare providers</li>
            <li>Travel and accommodation arrangement assistance</li>
            <li>24/7 support and emergency assistance</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          3. Medical Disclaimer
        </h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-gray-700">
            <strong>Important:</strong> JAW BREAKER is a booking platform and does not provide 
            medical advice, diagnosis, or treatment.
          </p>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {pageData?.title || 'Terms of Service'}
            </h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Last updated: {pageData?.updated_at ? new Date(pageData.updated_at).toLocaleDateString() : new Date().toLocaleDateString()}
          </p>

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

export default Terms;
