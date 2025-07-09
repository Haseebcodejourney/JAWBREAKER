
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const LeadManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch leads from bookings and profiles
  const { data: leads, isLoading } = useQuery({
    queryKey: ['crm-leads'],
    queryFn: async () => {
      console.log('Fetching CRM leads...');
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles (first_name, last_name, email, phone, country),
          clinics (name),
          treatments (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }

      // Transform bookings into lead format
      const leadsData = bookings?.map(booking => ({
        id: booking.id,
        name: `${booking.profiles?.first_name || ''} ${booking.profiles?.last_name || ''}`.trim(),
        email: booking.profiles?.email || '',
        phone: booking.profiles?.phone || '',
        country: booking.profiles?.country || '',
        treatment: booking.treatments?.name || '',
        clinic: booking.clinics?.name || '',
        status: booking.status,
        amount: booking.total_amount,
        currency: booking.currency,
        created_at: booking.created_at,
        source: 'Website'
      })) || [];

      console.log('CRM leads:', leadsData);
      return leadsData;
    },
  });

  const filteredLeads = leads?.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.treatment.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Yönetimi</h2>
          <p className="text-gray-600">Potansiyel müşterileri takip edin ve yönetin</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Lead Ekle
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Lead ara..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtreler
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>Leadler ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredLeads.length > 0 ? (
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{lead.name || 'İsimsiz Lead'}</h3>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                        {lead.email && (
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {lead.email}
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {lead.phone}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span><strong>Tedavi:</strong> {lead.treatment}</span>
                        <span><strong>Klinik:</strong> {lead.clinic}</span>
                        {lead.amount && (
                          <span><strong>Miktar:</strong> {lead.currency} {lead.amount.toLocaleString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Henüz lead bulunamadı</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadManagement;
