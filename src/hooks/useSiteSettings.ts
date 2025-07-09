
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteSettings {
  [key: string]: string;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      console.log('Fetching site settings...');
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }

      // Convert array to object for easier access
      const settings: SiteSettings = {};
      data?.forEach(setting => {
        settings[setting.setting_key] = setting.setting_value || '';
      });

      console.log('Site settings:', settings);
      return settings;
    },
  });
};
