
import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCMSPage } from '@/hooks/useCMSPage';

const Privacy = () => {
  const { language } = useLanguage();
  const { data: pageData, isLoading } = useCMSPage('privacy-page', language);

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
          <FileText className="w-5 h-5" />
          Information We Collect
        </h2>
        <div className="text-gray-700 space-y-4">
          <p>We collect information you provide directly to us, such as when you:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create an account or book a treatment</li>
            <li>Contact us for support or information</li>
            <li>Subscribe to our newsletter</li>
            <li>Submit reviews or feedback</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          How We Use Your Information
        </h2>
        <div className="text-gray-700 space-y-4">
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Communicate with you about products, services, and promotions</li>
            <li>Monitor and analyze trends and usage</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Information Sharing
        </h2>
        <div className="text-gray-700 space-y-4">
          <p>We may share your information in the following situations:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With healthcare providers to facilitate your treatment</li>
            <li>With service providers who assist us in our operations</li>
            <li>To comply with legal obligations</li>
            <li>With your consent or at your direction</li>
          </ul>
          <p className="bg-blue-50 p-4 rounded-lg">
            <strong>Important:</strong> We never sell your personal information to third parties.
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
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {pageData?.title || 'Privacy Policy'}
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

export default Privacy;
