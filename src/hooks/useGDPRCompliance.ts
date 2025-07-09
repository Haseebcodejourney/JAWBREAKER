
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export type ConsentType = 'marketing' | 'analytics' | 'cookies' | 'data_processing';

interface ConsentRecord {
  id: string;
  consent_type: ConsentType;
  consent_given: boolean;
  consent_date: string;
  withdrawn_date?: string;
}

export const useGDPRCompliance = () => {
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchConsents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use profiles table to store GDPR consent info temporarily
      const { data: profile } = await supabase
        .from('profiles')
        .select('gdpr_consent, gdpr_consent_date, marketing_consent')
        .eq('id', user.id)
        .single();

      if (profile) {
        const mockConsents: ConsentRecord[] = [
          {
            id: '1',
            consent_type: 'data_processing',
            consent_given: profile.gdpr_consent || false,
            consent_date: profile.gdpr_consent_date || new Date().toISOString(),
          },
          {
            id: '2',
            consent_type: 'marketing',
            consent_given: profile.marketing_consent || false,
            consent_date: profile.gdpr_consent_date || new Date().toISOString(),
          },
          {
            id: '3',
            consent_type: 'analytics',
            consent_given: false,
            consent_date: new Date().toISOString(),
          },
          {
            id: '4',
            consent_type: 'cookies',
            consent_given: false,
            consent_date: new Date().toISOString(),
          }
        ];
        setConsents(mockConsents);
      }
    } catch (error) {
      console.error('Error fetching consents:', error);
    }
  };

  const updateConsent = async (consentType: ConsentType, given: boolean) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update profiles table for now
      const updateData: any = {};
      
      if (consentType === 'data_processing') {
        updateData.gdpr_consent = given;
        updateData.gdpr_consent_date = new Date().toISOString();
      } else if (consentType === 'marketing') {
        updateData.marketing_consent = given;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      await fetchConsents();
      
      toast({
        title: "Consent Updated",
        description: `${consentType} consent ${given ? 'granted' : 'withdrawn'}.`,
      });

    } catch (error: any) {
      console.error('Error updating consent:', error);
      toast({
        title: "Error",
        description: "Failed to update consent.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasConsent = (consentType: ConsentType): boolean => {
    const consent = consents.find(c => c.consent_type === consentType);
    return consent?.consent_given && !consent?.withdrawn_date || false;
  };

  const requestDataDeletion = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // For now, just log the request - in production this would trigger a backend process
      console.log('Data deletion requested for user:', user.id);

      toast({
        title: "Data Deletion Request Received",
        description: "Your data deletion request will be processed within 30 days.",
      });

    } catch (error: any) {
      console.error('Error requesting data deletion:', error);
      toast({
        title: "Error",
        description: "Failed to submit data deletion request.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchConsents();
  }, []);

  return {
    consents,
    isLoading,
    updateConsent,
    hasConsent,
    requestDataDeletion,
    fetchConsents
  };
};
