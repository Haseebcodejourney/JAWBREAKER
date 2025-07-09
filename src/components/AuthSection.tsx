
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Shield } from 'lucide-react';

interface AuthSectionProps {
  user: any;
  userProfile: any;
  isAdmin: () => boolean;
  onSignOut: () => void;
}

const AuthSection: React.FC<AuthSectionProps> = ({ user, userProfile, isAdmin, onSignOut }) => {
  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Link to="/login">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 font-medium transition-all duration-300"
          >
            Log in
          </Button>
        </Link>
        <Link to="/register">
          <Button 
            size="sm"
            className="bg-gradient-to-r to-[#96be25]  hover:to-[#96be25] text-white shadow-lg  duration-300"
          >
            Sign up
          </Button>
        </Link>
      </div>
    );
  }

  const userInitials = userProfile?.first_name && userProfile?.last_name
    ? `${userProfile.first_name[0]}${userProfile.last_name[0]}`
    : user.email?.[0]?.toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-blue-50/80 transition-all duration-300 hover:scale-105">
          <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-blue-200 transition-all duration-300">
            <AvatarImage src={userProfile?.avatar_url} alt="Profile" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {userProfile?.first_name && userProfile?.last_name ? (
              <p className="font-medium">{userProfile.first_name} {userProfile.last_name}</p>
            ) : null}
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
            {userProfile?.role && (
              <p className="text-xs text-blue-600 font-medium">
                {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        
        {userProfile?.role === 'patient' && (
          <DropdownMenuItem asChild>
            <Link to="/patient/dashboard" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        
        {(userProfile?.role === 'clinic' || userProfile?.role === 'clinic_owner') && (
          <DropdownMenuItem asChild>
            <Link to="/clinic/dashboard" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Clinic Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        
        {(userProfile?.role === 'admin' || isAdmin()) && (
          <DropdownMenuItem asChild>
            <Link to="/admin/dashboard" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthSection;
