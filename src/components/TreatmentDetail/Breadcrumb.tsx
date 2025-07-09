
import React from 'react';
import { ChevronRight, Home, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbProps {
  treatmentName: string;
  onNavigateHome: () => void;
  onNavigateTreatments: () => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  treatmentName,
  onNavigateHome,
  onNavigateTreatments,
}) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onNavigateHome}
        className="flex items-center space-x-1 p-1 h-auto text-gray-600 hover:text-blue-600"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Button>
      
      <ChevronRight className="w-4 h-4" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onNavigateTreatments}
        className="flex items-center space-x-1 p-1 h-auto text-gray-600 hover:text-blue-600"
      >
        <Stethoscope className="w-4 h-4" />
        <span>Tedaviler</span>
      </Button>
      
      <ChevronRight className="w-4 h-4" />
      
      <span className="text-gray-900 font-medium max-w-xs truncate">
        {treatmentName}
      </span>
    </nav>
  );
};

export default Breadcrumb;
