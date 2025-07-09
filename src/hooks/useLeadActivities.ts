
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
  description: string;
  outcome?: string;
  scheduled_date?: string;
  completed_date?: string;
  created_by?: string;
  created_at: string;
}

export const useLeadActivities = (leadId?: string) => {
  return useQuery({
    queryKey: ['lead-activities', leadId],
    queryFn: async () => {
      console.log('Fetching lead activities...');
      
      // Mock data until database migration is applied
      const mockActivities: LeadActivity[] = [
        {
          id: '1',
          lead_id: leadId || '1',
          activity_type: 'call',
          description: 'Initial consultation call',
          outcome: 'Interested in dental implants',
          completed_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ];
      
      return leadId ? mockActivities.filter(activity => activity.lead_id === leadId) : mockActivities;
      
      /* TODO: Uncomment this when the lead_activities table exists
      let query = supabase
        .from('lead_activities')
        .select(`
          *,
          profiles!created_by (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (leadId) {
        query = query.eq('lead_id', leadId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching lead activities:', error);
        throw error;
      }
      
      return data || [];
      */
    },
    enabled: !!leadId
  });
};

export const useCreateLeadActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activityData: Omit<LeadActivity, 'id' | 'created_at'>) => {
      // Mock creation until database is ready
      console.log('Creating lead activity:', activityData);
      return { id: Date.now().toString(), ...activityData, created_at: new Date().toISOString() };
      
      /* TODO: Uncomment this when the lead_activities table exists
      const { data, error } = await supabase
        .from('lead_activities')
        .insert(activityData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
      */
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-activities'] });
    }
  });
};
