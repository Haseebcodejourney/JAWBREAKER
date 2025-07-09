
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRateLimiting } from '@/hooks/useRateLimiting';
import { useToast } from '@/hooks/use-toast';

interface SecurityMiddlewareProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'admin' | 'clinic' | 'patient';
  rateLimitEndpoint?: string;
  rateLimitCount?: number;
}

const SecurityMiddleware: React.FC<SecurityMiddlewareProps> = ({
  children,
  requireAuth = false,
  requireRole,
  rateLimitEndpoint,
  rateLimitCount = 10
}) => {
  const { user, userProfile, loading } = useAuth();
  const { checkRateLimit } = useRateLimiting();
  const { toast } = useToast();

  useEffect(() => {
    if (loading) return;

    // Check authentication
    if (requireAuth && !user) {
      toast({
        title: "Login Required",
        description: "You need to sign in to view this page.",
        variant: "destructive"
      });
      window.location.href = '/auth';
      return;
    }

    // Check role authorization
    if (requireRole && userProfile?.role !== requireRole) {
      toast({
        title: "Yetkisiz Erişim",
        description: "Bu sayfayı görüntüleme yetkiniz bulunmuyor.",
        variant: "destructive"
      });
      window.history.back();
      return;
    }

    // Check rate limiting
    if (rateLimitEndpoint) {
      checkRateLimit(rateLimitEndpoint, rateLimitCount);
    }
  }, [loading, user, userProfile, requireAuth, requireRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (requireRole && userProfile?.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
};

export default SecurityMiddleware;
