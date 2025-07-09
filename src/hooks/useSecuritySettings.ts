
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
  sessionTimeout: number;
  maxLoginAttempts: number;
}

interface SecurityActivity {
  id: string;
  user_email: string;
  action: string;
  target: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  ip_address?: string;
}

export const useSecuritySettings = () => {
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true
    },
    sessionTimeout: 3600,
    maxLoginAttempts: 5
  });
  const [activities, setActivities] = useState<SecurityActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSecurityActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedActivities: SecurityActivity[] = data?.map(log => ({
        id: log.id,
        user_email: 'system@example.com', // Would need to join with profiles
        action: log.action,
        target: log.table_name || 'Unknown',
        timestamp: new Date(log.created_at).toLocaleString(),
        severity: getSeverityFromAction(log.action),
        ip_address: log.ip_address?.toString()
      })) || [];

      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching security activities:', error);
      toast({
        title: "Hata",
        description: "Güvenlik aktiviteleri yüklenirken hata oluştu",
        variant: "destructive"
      });
    }
  };

  const getSeverityFromAction = (action: string): 'low' | 'medium' | 'high' => {
    if (action.includes('DELETE') || action.includes('failed')) return 'high';
    if (action.includes('UPDATE') || action.includes('login')) return 'medium';
    return 'low';
  };

  const updateSecuritySettings = async (newSettings: Partial<SecuritySettings>) => {
    try {
      setSettings(prev => ({ ...prev, ...newSettings }));
      
      // In a real implementation, you would save these to a settings table
      // For now, we'll just update local state
      
      toast({
        title: "Başarılı",
        description: "Güvenlik ayarları güncellendi",
      });
    } catch (error) {
      console.error('Error updating security settings:', error);
      toast({
        title: "Hata",
        description: "Güvenlik ayarları güncellenirken hata oluştu",
        variant: "destructive"
      });
    }
  };

  const getActiveUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, updated_at')
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active users:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchSecurityActivities();
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    settings,
    activities,
    isLoading,
    updateSecuritySettings,
    fetchSecurityActivities,
    getActiveUsers
  };
};
