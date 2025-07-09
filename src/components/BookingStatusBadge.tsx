
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertTriangle, DollarSign } from 'lucide-react';

interface BookingStatusBadgeProps {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'disputed';
  paymentStatus?: 'pending' | 'processing' | 'released' | 'refunded';
  size?: 'sm' | 'md' | 'lg';
}

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ 
  status, 
  paymentStatus,
  size = 'md' 
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: 'Pending',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'confirmed':
        return {
          icon: CheckCircle,
          label: 'Confirmed',
          variant: 'default' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'Completed',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          label: 'Cancelled',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'disputed':
        return {
          icon: AlertTriangle,
          label: 'Disputed',
          variant: 'destructive' as const,
          className: 'bg-orange-100 text-orange-800 border-orange-200'
        };
      default:
        return {
          icon: Clock,
          label: 'Unknown',
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const getPaymentConfig = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'pending':
        return {
          icon: DollarSign,
          label: 'Payment Pending',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'processing':
        return {
          icon: DollarSign,
          label: 'Processing Payment',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'released':
        return {
          icon: DollarSign,
          label: 'Paid',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'refunded':
        return {
          icon: DollarSign,
          label: 'Refunded',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig(status);
  const paymentConfig = paymentStatus ? getPaymentConfig(paymentStatus) : null;
  
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className="flex flex-wrap gap-2">
      <Badge 
        variant={statusConfig.variant}
        className={`${statusConfig.className} ${textSize} flex items-center gap-1`}
      >
        <statusConfig.icon className={iconSize} />
        {statusConfig.label}
      </Badge>
      
      {paymentConfig && (
        <Badge 
          variant="outline"
          className={`${paymentConfig.className} ${textSize} flex items-center gap-1`}
        >
          <paymentConfig.icon className={iconSize} />
          {paymentConfig.label}
        </Badge>
      )}
    </div>
  );
};

export default BookingStatusBadge;
