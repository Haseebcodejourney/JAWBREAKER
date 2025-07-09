
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const MobileNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const { t } = useLanguage();

  // Don't show mobile navigation on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const getDashboardPath = () => {
    if (!user) return '/auth';
    
    if (userProfile?.role === 'admin') return '/admin/dashboard';
    if (userProfile?.role === 'clinic' || userProfile?.role === 'clinic_owner') return '/clinic/dashboard';
    return '/patient/dashboard';
  };

  const navigationItems = [
    { icon: Home, label: t('nav.home') || 'Home', path: '/' },
    { icon: Search, label: t('nav.findClinics') || 'Find Clinics', path: '/treatments' },
    { icon: Calendar, label: 'Bookings', path: getDashboardPath() },
    { icon: User, label: 'Profile', path: getDashboardPath() },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="flex justify-around items-center py-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-white shadow-lg"
        >
          {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mobile Slide-out Menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 md:hidden transform transition-transform">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Menu</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {user && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">
                    {userProfile?.first_name} {userProfile?.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded capitalize">
                    {userProfile?.role}
                  </span>
                </div>
              )}

              <nav className="space-y-2">
                <Link
                  to="/"
                  className="block py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.home') || 'Home'}
                </Link>
                <Link
                  to="/treatments"
                  className="block py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.treatments') || 'Treatments'}
                </Link>
                <Link
                  to="/search"
                  className="block py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.findClinics') || 'Find Clinics'}
                </Link>
                
                {user ? (
                  <>
                    <Link
                      to="/patient/dashboard"
                      className="block py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('nav.dashboard') || 'Dashboard'}
                    </Link>
                    {(userProfile?.role === 'clinic' || userProfile?.role === 'clinic_owner') && (
                      <Link
                        to="/clinic/dashboard"
                        className="block py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Clinic Dashboard
                      </Link>
                    )}
                    {userProfile?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="block py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('nav.signIn') || 'Sign In'}
                    </Link>
                    <Link
                      to="/register"
                      className="block py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('nav.signUp') || 'Sign Up'}
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNavigation;
