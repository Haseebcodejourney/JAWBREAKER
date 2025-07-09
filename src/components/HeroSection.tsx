
import React from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Shield, Clock } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <section className="relative bg-white py-16 px-4 overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: '#222B45' }}>
            Find Your Perfect{" "}
            <span style={{ color: '#2596be' }}>Medical</span>
            <br />
            <span style={{ color: '#2596be' }}>Treatment</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover world-class medical treatments at affordable prices. 
            Connect with certified clinics and experienced doctors worldwide.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <SearchInput
                placeholder="Search for Treatments"
                onSearch={handleSearch}
                className="text-base flex-1"
              />
              {/* <Button 
                className="btn-primary px-8 py-3"
                onClick={() => navigate('/treatments')}
              >
                Search
              </Button> */}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="btn-primary px-8 py-3"
              onClick={() => navigate('/treatments')}
              style={{backgroundColor:'#96be25'}}
            >
              Browse Treatments
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3"
              onClick={() => navigate('/how-it-works')}
            >
              How It Works
            </Button>
          </div>

          {/* Trust Indicators - 3 features in a row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Shield className="w-10 h-10" style={{ color: '#2596be' }} />
              </div>
              <h3 className="font-semibold mb-2 text-lg" style={{ color: '#222B45' }}>Service Offers</h3>
              <p className="text-gray-600 text-sm">We offer the highest quality care and experience throughout your journey</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Heart className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2 text-lg" style={{ color: '#222B45' }}>Easy Care</h3>
              <p className="text-gray-600 text-sm">We make healthcare accessible and affordable for everyone around the world</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <Clock className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2 text-lg" style={{ color: '#222B45' }}>Quick Process</h3>
              <p className="text-gray-600 text-sm">We provide fast and convenient booking and consultation process</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
