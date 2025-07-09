
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Trash2,
  Send,
  Users,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationCreateModal from '@/components/NotificationCreateModal';

const AdminNotifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    deleteNotification, 
    isMarkingAsRead, 
    isDeleting 
  } = useNotifications();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['notification-stats'],
    queryFn: async () => {
      const { count: totalCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true });

      const { count: unreadCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      const { count: todayCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date().toISOString().split('T')[0] + 'T00:00:00.000Z');

      return {
        total: totalCount || 0,
        unread: unreadCount || 0,
        today: todayCount || 0,
        readRate: totalCount ? ((totalCount - (unreadCount || 0)) / totalCount * 100).toFixed(1) : 0
      };
    },
  });

  const filteredNotifications = notifications?.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleDelete = (notificationId: string) => {
    if (window.confirm('Bu bildirimi silmek istediğinizden emin misiniz?')) {
      deleteNotification(notificationId);
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gray-50">
          <AdminSidebar />
          
          <main className="flex-1 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Bildirim Yönetimi</h1>
                    <p className="text-gray-600 mt-1">Sistem bildirimlerini yönetin ve gönderme ayarları</p>
                  </div>
                </div>
                <NotificationCreateModal />
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Toplam Bildirim</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {statsLoading ? '...' : stats?.total || 0}
                        </p>
                      </div>
                      <Bell className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Okunmamış</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {statsLoading ? '...' : stats?.unread || 0}
                        </p>
                      </div>
                      <Eye className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Bugün Gönderilen</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {statsLoading ? '...' : stats?.today || 0}
                        </p>
                      </div>
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Okunma Oranı</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {statsLoading ? '...' : `${stats?.readRate || 0}%`}
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        placeholder="Bildirim ara..." 
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

              {/* Notifications List */}
              <Card>
                <CardHeader>
                  <CardTitle>Bildirimler ({filteredNotifications.length})</CardTitle>
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
                  ) : filteredNotifications.length > 0 ? (
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <div key={notification.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                          !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                {getTypeIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                  <Badge className={getTypeColor(notification.type)}>
                                    {notification.type}
                                  </Badge>
                                  {!notification.read && (
                                    <Badge variant="destructive">Yeni</Badge>
                                  )}
                                </div>
                                
                                <p className="text-gray-600 mb-3">{notification.message}</p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>
                                    Kullanıcı: {notification.user_id ? 
                                      `User ${notification.user_id.slice(0, 8)}...` : 
                                      'Sistem'
                                    }
                                  </span>
                                  <span>
                                    Tarih: {new Date(notification.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleMarkAsRead(notification.id)}
                                disabled={notification.read || isMarkingAsRead}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDelete(notification.id)}
                                disabled={isDeleting}
                              >
                                <Trash2 className="w-4 h-4" />
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
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Bildirim bulunamadı</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AdminNotifications;
