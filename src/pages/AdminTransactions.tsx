
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  CreditCard,
  Eye,
  Download,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useAdminTransactions, useTransactionStats } from '@/hooks/useAdminTransactions';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminTransactions = () => {
  const { data: transactions, isLoading, error } = useAdminTransactions();
  const { data: stats, isLoading: statsLoading } = useTransactionStats();
  const [searchTerm, setSearchTerm] = useState('');

  if (error) {
    console.error('Error loading transactions:', error);
  }

  const filteredTransactions = transactions?.filter(transaction =>
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transaction.bookings?.profiles?.first_name && 
     `${transaction.bookings.profiles.first_name} ${transaction.bookings.profiles.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (transaction.bookings?.clinics?.name && 
     transaction.bookings.clinics.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <ProtectedRoute requireAdmin={true}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold">Transaction Management</h1>
              </div>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {statsLoading ? '...' : `$${stats?.totalRevenue?.toLocaleString() || 0}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {statsLoading ? '...' : `$${stats?.totalCommission?.toLocaleString() || 0}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Transactions Today</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {statsLoading ? '...' : stats?.transactionsToday || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingDown className="w-8 h-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Failed Payments</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {statsLoading ? '...' : stats?.failedPayments || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter Bar */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      placeholder="Search transactions by ID, patient, or clinic..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded mb-2"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredTransactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Treatment</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="font-mono text-sm">{transaction.id.slice(0, 8)}...</div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {transaction.bookings?.profiles?.first_name} {transaction.bookings?.profiles?.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{transaction.bookings?.clinics?.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{transaction.bookings?.treatments?.name || 'N/A'}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {transaction.currency} {transaction.amount?.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                              {transaction.payment_method || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                transaction.status === 'completed' ? 'default' : 
                                transaction.status === 'pending' ? 'secondary' : 
                                'destructive'
                              }
                              className={
                                transaction.status === 'completed' ? 'bg-green-600' :
                                transaction.status === 'pending' ? 'bg-yellow-500' :
                                'bg-red-600'
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(transaction.created_at || '').toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No transactions found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AdminTransactions;
