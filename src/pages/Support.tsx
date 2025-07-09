
import React, { useEffect, useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, MapPin, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCMSPage } from '@/hooks/useCMSPage';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Support = () => {
  const { data: pageData, isLoading: pageLoading } = useCMSPage('support-page', 'en');
  const { data: siteSettings, isLoading: settingsLoading } = useSiteSettings();

  const isLoading = pageLoading || settingsLoading;

  // Default support channels with data from site settings
  const getSupportChannels = () => [
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our medical coordinators',
      contact: siteSettings?.contact_phone || "+1 (555) 123-4567",
      availability: '24/7 Available'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get detailed answers to your questions',
      contact: siteSettings?.contact_email || "support@jawbreaker.com",
      availability: 'Response within 2 hours'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Instant help from our support team',
      contact: 'Chat widget on every page',
      availability: '24/7 Available'
    }
  ];

  const defaultFaqs = [
    {
      question: 'How do I book a treatment?',
      answer: 'Simply browse our treatments, select your preferred clinic, and click "Book Now". Our coordinators will guide you through the process.'
    },
    {
      question: 'What\'s included in the price?',
      answer: 'All packages include medical fees, accommodation, airport transfers, and a dedicated coordinator. Additional services are clearly marked.'
    },
    {
      question: 'Is my booking protected?',
      answer: 'Yes, all bookings are protected by our guarantee. We offer full refund protection and quality assurance.'
    },
    {
      question: 'What languages do you support?',
      answer: 'We provide support in English, Turkish, Russian, Arabic, German, and French. Our clinics offer multilingual staff.'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
  }

  const supportChannels = getSupportChannels();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {pageData?.title || t('support.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('support.subtitle')}
          </p>
        </div> */}

        {/* CMS Content */}
        {/* {pageData?.content && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          </div>
        )} */}

        {/* Contact Methods */}
        {/* <div className="grid md:grid-cols-3 gap-8 mb-12">
          {supportChannels.map((channel, index) => (
            <Card key={index}>
              <CardHeader className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <channel.icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>{channel.title}</CardTitle>
                <CardDescription>{channel.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-medium text-blue-600 mb-2">{channel.contact}</p>
                <p className="text-sm text-gray-500">{channel.availability}</p>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Emergency Contact */}
        {/* <Card className="mb-12 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              {t('support.emergencySupport')}
            </CardTitle>
            <CardDescription>
              {t('support.emergencyDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 font-bold text-lg">+1 (555) 911-HELP</p>
            <p className="text-red-600">{t('support.emergencyAvailability')}</p>
          </CardContent>
        </Card> */}

        {/* FAQs */}
        {/* <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">{t('support.faqTitle')}</h2>
          <div className="space-y-6">
            {defaultFaqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* Office Locations */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Our Offices
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">🇺🇸 United States</h3>
              <p className="text-gray-600">
                123 Health Avenue<br />
                New York, NY 10001<br />
                Whats App: {'+90 548 831213 7'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🇹🇷 Turkey</h3>
              <p className="text-gray-600">
                {siteSettings?.contact_address || 'Sağlık Caddesi No: 45, İstanbul, Turkey'}<br />
                Phone: {'+90 (212) 222222'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
