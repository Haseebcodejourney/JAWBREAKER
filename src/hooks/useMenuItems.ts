
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  menu_type: string;
  parent_id?: string;
  sort_order: number;
  target: string;
  is_active: boolean;
  translation_key?: string;
}

export const useMenuItems = (menuType: string = 'main') => {
  return useQuery({
    queryKey: ['menu-items', menuType],
    queryFn: async () => {
      console.log('Fetching menu items for type:', menuType);
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('menu_type', menuType)
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching menu items:', error);
        throw error;
      }

      console.log('Menu items:', data);
      return data || [];
    },
  });
};
