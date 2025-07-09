
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Shield } from 'lucide-react';

interface MobileMenuProps {
  user: any;
  isAdmin: () => boolean;
  onSignOut: () => void;
}

const MobileMenu = ({ user, isAdmin, onSignOut }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="sm">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col space-y-4 mt-6">
          <Link to="/treatments?category=hair_transplant" className="text-lg font-medium">Hair Transplant</Link>
          <Link to="/treatments?category=dental" className="text-lg font-medium">Dental Treatments</Link>
          <Link to="/treatments?category=cosmetic_surgery" className="text-lg font-medium">Plastic Surgery</Link>
          <Link to="/treatments?destination=Turkey" className="text-lg font-medium">Turkey</Link>
          <Link to="/treatments?destination=Thailand" className="text-lg font-medium">Thailand</Link>
          <Link to="/treatments" className="text-lg font-medium">All Treatments</Link>
          <Link to="/search" className="text-lg font-medium">Find Clinics</Link>
          <div className="pt-4 border-t">
            {user ? (
              <>
                {isAdmin() ? (
                  <Link to="/admin/dashboard">
                    <Button className="w-full mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Button>
                  </Link>
                ) : (
                  <Link to="/patient/dashboard">
                    <Button className="w-full mb-2">Dashboard</Button>
                  </Link>
                )}
                <Button variant="outline" className="w-full" onClick={onSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button className="w-full mb-2">Sign Up</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
