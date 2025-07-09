
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country?: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  score: number;
  interested_treatments?: string[];
  budget_range?: string;
  preferred_date?: string;
  notes?: string;
  assigned_to?: string;
  last_contact_date?: string;
  conversion_date?: string;
  created_at: string;
  updated_at: string;
}

export const useLeads = (filters?: {
  status?: string;
  source?: string;
  assigned_to?: string;
}) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      console.log('Fetching leads...');
      
      // For now, return mock data until the database migration is applied
      // Once the leads table exists, this will be replaced with real data
      const mockLeads: Lead[] = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          country: 'USA',
          source: 'website',
          status: 'new',
          score: 0,
          interested_treatments: ['dental'],
          budget_range: '5000-10000',
          notes: 'Interested in dental implants',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+1234567891',
          country: 'Canada',
          source: 'referral',
          status: 'contacted',
          score: 25,
          interested_treatments: ['cosmetic_surgery'],
          budget_range: '10000-20000',
          notes: 'Looking for rhinoplasty procedure',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      // Apply filters
      let filteredLeads = mockLeads;
      
      if (filters?.status) {
        filteredLeads = filteredLeads.filter(lead => lead.status === filters.status);
      }
      if (filters?.source) {
        filteredLeads = filteredLeads.filter(lead => lead.source === filters.source);
      }
      if (filters?.assigned_to) {
        filteredLeads = filteredLeads.filter(lead => lead.assigned_to === filters.assigned_to);
      }
      
      return filteredLeads;
      
      /* TODO: Uncomment this when the leads table exists in the database
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.source) {
        query = query.eq('source', filters.source);
      }
      if (filters?.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }
      
      return data || [];
      */
    }
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
      // For now, simulate creation until database is ready
      console.log('Creating lead:', leadData);
      return { id: Date.now().toString(), ...leadData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      
      /* TODO: Uncomment this when the leads table exists
      const { data, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
      */
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...leadData }: Partial<Lead> & { id: string }) => {
      // For now, simulate update until database is ready
      console.log('Updating lead:', id, leadData);
      return { id, ...leadData, updated_at: new Date().toISOString() };
      
      /* TODO: Uncomment this when the leads table exists
      const { data, error } = await supabase
        .from('leads')
        .update({ ...leadData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
      */
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // For now, simulate deletion until database is ready
      console.log('Deleting lead:', id);
      
      /* TODO: Uncomment this when the leads table exists
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      */
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
};
