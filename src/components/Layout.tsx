
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileNavigation from './MobileNavigation';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  hideHeader = false, 
  hideFooter = false, 
  className = '' 
}) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isBookingRoute = location.pathname.startsWith('/booking');
  const isSearchRoute = location.pathname.startsWith('/search') || location.pathname.startsWith('/advanced-search');
  const isAuthRoute = location.pathname === '/auth';
  
  // Admin routes have their own layout
  if (isAdminRoute) {
    return <div className="w-full">{children}</div>;
  }
  
  // Search routes, auth routes, and booking routes manage their own headers
  if (isSearchRoute || isAuthRoute || isBookingRoute) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen flex flex-col ${className}`}>
      {!hideHeader && <Header />}
      
      {/* Add padding-top to account for fixed header */}
      <main className={`flex-grow w-full ${!hideHeader ? 'pt-16' : ''}`}>
        {children}
      </main>
      
      {!hideFooter && <Footer />}
      
      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default Layout;
