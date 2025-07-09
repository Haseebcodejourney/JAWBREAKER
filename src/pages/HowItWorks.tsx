
import React from 'react';
import { CheckCircle, Clock, Shield, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: CheckCircle,
      title: "Find Your Treatment",
      description: "Browse our verified clinics and treatments. Compare prices, read reviews, and find the perfect match for your needs."
    },
    {
      icon: Clock,
      title: "Book Consultation",
      description: "Schedule a free consultation with our expert coordinators. Get personalized treatment plans and travel arrangements."
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your booking is protected with our guarantee. We handle all the details so you can focus on your health journey."
    },
    {
      icon: Heart,
      title: "Your Journey Begins",
      description: "Travel with confidence knowing everything is arranged. From airport pickup to post-treatment care."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12" >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How JAW BREAKER Works</h1>
          <p className="text-xl text-gray-600">Your journey to better health made simple</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-[#e3f3fa] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-[#2596be]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Why Choose JAW BREAKER?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">✓ Verified Clinics</h3>
              <p className="text-gray-600 mb-4">All our partner clinics are thoroughly vetted and internationally accredited.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✓ Transparent Pricing</h3>
              <p className="text-gray-600 mb-4">No hidden costs. All prices include medical fees, accommodation, and transfers.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✓ 24/7 Support</h3>
              <p className="text-gray-600 mb-4">Our medical coordinators are available around the clock for your peace of mind.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✓ Quality Guarantee</h3>
              <p className="text-gray-600 mb-4">We guarantee the quality of care and offer full refund protection.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
