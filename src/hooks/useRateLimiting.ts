
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

interface RateLimitInfo {
  endpoint: string;
  requestCount: number;
  windowStart: string;
  isLimited: boolean;
}

export const useRateLimiting = () => {
  const [rateLimits, setRateLimits] = useState<Record<string, RateLimitInfo>>({});
  const { toast } = useToast();

  const checkRateLimit = async (endpoint: string, limit: number = 10, windowMinutes: number = 15): Promise<boolean> => {
    try {
      // Simple client-side rate limiting for now
      const now = new Date();
      const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);
      
      const currentLimit = rateLimits[endpoint];
      
      if (currentLimit) {
        const limitWindowStart = new Date(currentLimit.windowStart);
        
        if (limitWindowStart > windowStart && currentLimit.requestCount >= limit) {
          toast({
            title: "Rate Limit Exceeded",
            description: `You can make maximum ${limit} requests per ${windowMinutes} minutes for this action.`,
            variant: "destructive"
          });
          return false;
        }
      }

      // Update rate limit
      setRateLimits(prev => ({
        ...prev,
        [endpoint]: {
          endpoint,
          requestCount: (currentLimit?.requestCount || 0) + 1,
          windowStart: currentLimit?.windowStart || now.toISOString(),
          isLimited: false
        }
      }));

      return true;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return true; // Allow on error
    }
  };

  // Reset rate limits every hour
  useEffect(() => {
    const interval = setInterval(() => {
      setRateLimits({});
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  return {
    rateLimits,
    checkRateLimit
  };
};
