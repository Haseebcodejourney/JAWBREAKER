
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const suggestions = [
    { 
      icon: Home, 
      title: 'Home', 
      description: "Return to our homepage and explore medical tourism options",
      path: "/" 
    },
    { 
      icon: Search, 
      title: 'Find Clinics', 
      description: "Search for treatments and clinics worldwide",
      path: "/treatments" 
    },
    { 
      icon: HelpCircle, 
      title: "Get Help", 
      description: "Contact our support team for assistance",
      path: "/support" 
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl font-bold text-gray-300 mb-4 animate-fade-in">404</h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {suggestions.map((suggestion, index) => (
            <Link
              key={index}
              to={suggestion.path}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center group hover:-translate-y-1"
            >
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <suggestion.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h3>
              <p className="text-sm text-gray-600">{suggestion.description}</p>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline" 
            className="flex items-center gap-2 px-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Link to="/">
            <Button className="flex items-center gap-2 px-6 !bg-[#96be25] hover:!bg-[#96be25]">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
        </div>

        <div className="text-sm text-gray-500 bg-white/50 rounded-lg p-4 max-w-2xl mx-auto">
          <p>Error Code: 404 | Path: {location.pathname}</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
