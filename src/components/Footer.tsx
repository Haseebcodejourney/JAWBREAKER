
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Award, Users, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Popular Treatments',
      links: [
        { name: 'Hair Transplant', path: '/treatments?category=hair_transplant' },
        { name: 'Dental Treatments', path: '/treatments?category=dental' },
        { name: 'Plastic Surgery', path: '/treatments?category=cosmetic_surgery' },
        { name: 'Eye Surgery', path: '/treatments?category=eye_surgery' },
        { name: 'Orthopedics', path: '/treatments?category=orthopedic' },
        { name: 'Fertility Treatments', path: '/treatments?category=fertility' }
      ]
    },
    {
      title: 'Top Destinations',
      links: [
        { name: 'Turkey - Istanbul', path: '/treatments?destination=Turkey' },
        { name: 'Thailand - Bangkok', path: '/treatments?destination=Thailand' },
        { name: 'India - Mumbai', path: '/treatments?destination=India' },
        { name: 'Mexico - Tijuana', path: '/treatments?destination=Mexico' },
        { name: 'South Korea - Seoul', path: '/treatments?destination=South Korea' },
        { name: 'Germany - Munich', path: '/treatments?destination=Germany' }
      ]
    },
    {
      title: 'For Patients',
      links: [
        { name: 'How it Works', path: '/how-it-works' },
        { name: 'Find Treatments', path: '/treatments' },
        { name: 'Patient Reviews', path: '/reviews' },
        { name: 'Travel Guides', path: '/travel-guides' },
        { name: 'Insurance Help', path: '/insurance' },
        { name: 'Support Center', path: '/support' }
      ]
    },
    {
      title: 'For Clinics',
      links: [
        { name: 'Join as Provider', path: '/register' },
        { name: 'Clinic Dashboard', path: '/clinic/dashboard' },
        { name: 'Marketing Tools', path: '/marketing' },
        { name: 'Success Stories', path: '/success-stories' },
        { name: 'Pricing Plans', path: '/pricing' },
        { name: 'Integration API', path: '/api-docs' }
      ]
    }
  ];

  const trustIndicators = [
    { icon: Shield, text: 'Verified Clinics', desc: '2,500+ accredited providers' },
    { icon: Award, text: 'Quality Assured', desc: 'International standards' },
    { icon: Users, text: 'Trusted by 100K+', desc: 'Patients worldwide' },
    { icon: Heart, text: 'Safe & Secure', desc: 'GDPR & HIPAA compliant' }
  ];

  return (
    <footer className="bg-gray-900 text-white mt-20">
      {/* Trust Section */}
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Why Choose Us</h3>
            <p className="text-gray-300">Trusted by patients worldwide for quality care</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustIndicators.map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#96be25] rounded-lg mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-1">{item.text}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-300">Get the latest updates on treatments and offers</p>
            </div>
            <div className="lg:w-1/2 lg:pl-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#2596be]"
                />
                <Button className="!bg-[#96be25] hover:!bg-[#96be25] whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                By subscribing, you agree to our Privacy Policy and Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <img src="/logo-jb.jpeg" alt="Logo" className="w-8 h-8 rounded-lg object-cover" style={{width:'60px', height:'auto',borderRadius:'1px'}}/>
                <span className="text-xl font-bold">JAW BREAKER</span>
              </Link>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Connecting patients with world-class healthcare providers globally. 
                Your journey to better health starts here, with safety, quality, and savings guaranteed.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Global Healthcare Network</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>support@jawbreaker.com</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.path} 
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} JAW BREAKER. All rights reserved.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
                <Link to="/medical-disclaimer" className="text-gray-400 hover:text-white transition-colors">
                  Medical Disclaimer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
