import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  FileText,
  CheckSquare,
  Settings,
  BarChart3,
  MessageSquare,
  UserCog,
  Shield,
  TrendingUp,
  Target,
  Mail,
  Calendar,
  Activity,
  Home,
  Bell,
  Globe,
  Database,
  Zap,
  Stethoscope
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      label: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: LayoutDashboard,
          isActive: location.pathname === '/admin'
        },
        {
          title: 'Reports',
          url: '/admin/reports',
          icon: BarChart3,
          isActive: location.pathname === '/admin/reports'
        }
      ]
    },
    {
      label: 'Customer Management',
      items: [
        {
          title: 'CRM',
          url: '/admin/crm',
          icon: Users,
          isActive: location.pathname === '/admin/crm',
          badge: 'New'
        },
        {
          title: 'Patients',
          url: '/admin/patients',
          icon: UserCog,
          isActive: location.pathname === '/admin/patients'
        }
      ]
    },
    {
      label: 'Business Operations',
      items: [
        {
          title: 'Clinics',
          url: '/admin/clinics',
          icon: Building2,
          isActive: location.pathname === '/admin/clinics'
        },
        {
          title: 'Doctors',
          url: '/admin/doctors',
          icon: Stethoscope,
          isActive: location.pathname === '/admin/doctors'
        },
        {
          title: 'Approvals',
          url: '/admin/approvals',
          icon: CheckSquare,
          isActive: location.pathname === '/admin/approvals',
          badge: '12'
        },
        {
          title: 'Transactions',
          url: '/admin/transactions',
          icon: CreditCard,
          isActive: location.pathname === '/admin/transactions'
        }
      ]
    },
    {
      label: 'Content & Marketing',
      items: [
        {
          title: 'CMS',
          url: '/admin/cms',
          icon: FileText,
          isActive: location.pathname === '/admin/cms'
        },
        {
          title: 'Campaigns',
          url: '/admin/campaigns',
          icon: Target,
          isActive: location.pathname === '/admin/campaigns'
        },
        {
          title: 'Messaging',
          url: '/admin/messaging',
          icon: MessageSquare,
          isActive: location.pathname === '/admin/messaging'
        }
      ]
    },
    {
      label: 'Communication & Notifications',
      items: [
        {
          title: 'Notifications',
          url: '/admin/notifications',
          icon: Bell,
          isActive: location.pathname === '/admin/notifications',
          badge: '23'
        }
      ]
    },
    {
      label: 'System & Integration',
      items: [
        {
          title: 'Settings',
          url: '/admin/settings',
          icon: Settings,
          isActive: location.pathname === '/admin/settings'
        },
        {
          title: 'Security',
          url: '/admin/security',
          icon: Shield,
          isActive: location.pathname === '/admin/security'
        },
        {
          title: 'Activity',
          url: '/admin/activity',
          icon: Activity,
          isActive: location.pathname === '/admin/activity'
        },
        {
          title: 'Integrations',
          url: '/admin/integrations',
          icon: Zap,
          isActive: location.pathname === '/admin/integrations'
        }
      ]
    }
  ];

  return (
    <Sidebar variant="sidebar" className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Admin Panel</h2>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        {/* Back to Homepage Button */}
        <div className="mt-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return to Homepage
            </Button>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            <SidebarGroupLabel className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={item.isActive}
                      className="w-full justify-start px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700 data-[active=true]:border-r-2 data-[active=true]:border-blue-600"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge 
                            variant={item.badge === 'New' ? 'default' : 'secondary'} 
                            className="text-xs px-2 py-0.5"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            {groupIndex < menuItems.length - 1 && <SidebarSeparator className="my-2" />}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@example.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export { AdminSidebar };
