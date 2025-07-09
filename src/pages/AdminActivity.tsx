
import React from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Info, Users, Clock, Eye, AlertTriangle } from 'lucide-react';

const AdminActivity = () => {
  // Mock activity data
  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'Yeni rezervasyon oluşturdu',
      target: 'Diş Implantı',
      timestamp: '2 dakika önce',
      type: 'booking',
      severity: 'info'
    },
    {
      id: 2,
      user: 'Clinic Istanbul',
      action: 'Profil güncelledi',
      target: 'Klinik Bilgileri',
      timestamp: '15 dakika önce',
      type: 'update',
      severity: 'low'
    },
    {
      id: 3,
      user: 'Admin',
      action: 'Kullanıcı sildi',
      target: 'Test User',
      timestamp: '1 saat önce',
      type: 'delete',
      severity: 'high'
    },
    {
      id: 4,
      user: 'Jane Smith',
      action: 'Ödeme tamamladı',
      target: 'Saç Ekimi Paketi',
      timestamp: '2 saat önce',
      type: 'payment',
      severity: 'info'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Users className="w-4 h-4" />;
      case 'update': return <Eye className="w-4 h-4" />;
      case 'delete': return <AlertTriangle className="w-4 h-4" />;
      case 'payment': return <Clock className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AdminSidebar />
        
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Sistem Aktiviteleri</h1>
                  <p className="text-gray-600 mt-1">Kullanıcı aktiviteleri ve sistem loglarını izleyin</p>
                </div>
              </div>
            </div>

            {/* Demo Alert */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Aktivite izleme sistemi demo modunda çalışmaktadır. Gerçek aktivite verileri için audit_logs tablosu kullanılacaktır.
              </AlertDescription>
            </Alert>

            {/* Activity Feed */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Son Aktiviteler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${getSeverityColor(activity.severity)}`}>
                          {getActionIcon(activity.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.user}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                          <p className="text-xs text-gray-500 mt-1">Hedef: {activity.target}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminActivity;
