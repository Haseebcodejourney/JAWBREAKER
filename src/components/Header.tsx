
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthSection from './AuthSection';
import MobileMenu from './MobileMenu';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Header = () => {
  const { user, signOut, userProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { data: siteSettings } = useSiteSettings();

  // English menu items
  const menuItems = [
    { id: '1', label: 'Home', url: '/', target: '_self' },
    { id: '2', label: 'Treatments', url: '/treatments', target: '_self' },
    { id: '3', label: 'Destinations', url: '/destinations', target: '_self' },
    { id: '4', label: 'Support', url: '/support', target: '_self' }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const siteTitle = 'JAW BREAKER';
  // Use custom logo if available, otherwise fallback to site settings
  const siteLogo = siteSettings?.site_logo_url || '/logo-jb.jpeg';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-16">
      {/* Glass background layer */}
      <div className="glass-header"></div>
      
      {/* Content layer */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/" className="flex items-center space-x-3 group">
            {siteLogo ? (
              <img src={siteLogo} alt={siteTitle} className="w-8 h-8 transition-transform group-hover:scale-105" style={{width:'63px',height:'auto'}}/>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-[#2596be] rounded-xl flex items-center justify-center shadow-lg transition-all group-hover:shadow-xl group-hover:scale-105">
                <Heart className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {siteTitle}
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link 
                key={item.id}
                to={item.url} 
                className="text-gray-700 hover:text-[#2596be] font-medium transition-colors duration-300 nav-link-hover"
                target={item.target}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <AuthSection
              user={user}
              userProfile={userProfile}
              isAdmin={isAdmin}
              onSignOut={handleSignOut}
            />

            <MobileMenu
              user={user}
              isAdmin={isAdmin}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
