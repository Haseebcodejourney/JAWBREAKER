
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, MessageCircle, Heart, FileText, 
  CreditCard, Star, MapPin, Clock, User,
  Bell, Settings, LogOut
} from 'lucide-react';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  const upcomingBookings = [
    {
      id: 1,
      clinic: 'Istanbul Hair Institute',
      treatment: 'Hair Transplant - FUE',
      date: '2024-02-15',
      time: '10:00 AM',
      location: 'Istanbul, Turkey',
      status: 'confirmed',
      price: 2500
    },
    {
      id: 2,
      clinic: 'Bangkok Dental Spa',
      treatment: 'Dental Implants',
      date: '2024-03-20',
      time: '2:00 PM',
      location: 'Bangkok, Thailand',
      status: 'pending',
      price: 1800
    }
  ];

  const conversations = [
    {
      id: 1,
      clinic: 'Istanbul Hair Institute',
      lastMessage: 'Your treatment is confirmed for February 15th',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      clinic: 'Bangkok Dental Spa',
      lastMessage: 'Please send your recent X-rays',
      time: '1 day ago',
      unread: false
    }
  ];

  const savedClinics = [
    {
      id: 1,
      name: 'Mumbai Cosmetic Center',
      location: 'Mumbai, India',
      specialties: ['Plastic Surgery', 'Breast Augmentation'],
      rating: 4.7,
      priceFrom: 899
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Welcome back, John!</h1>
                <p className="text-sm text-gray-600">Patient Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saved</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{booking.treatment}</h4>
                            <p className="text-gray-600">{booking.clinic}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {booking.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {booking.time}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {booking.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                              className={booking.status === 'confirmed' ? 'bg-green-600' : ''}
                            >
                              {booking.status}
                            </Badge>
                            <p className="text-lg font-bold text-blue-600 mt-2">
                              ${booking.price}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm">View Details</Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm">Cancel</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversations.map((conv) => (
                    <div key={conv.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{conv.clinic}</h4>
                        <p className="text-sm text-gray-600">{conv.lastMessage}</p>
                        <p className="text-xs text-gray-500 mt-1">{conv.time}</p>
                      </div>
                      {conv.unread && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Clinics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedClinics.map((clinic) => (
                    <div key={clinic.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{clinic.name}</h4>
                          <p className="text-gray-600 text-sm">{clinic.location}</p>
                          <div className="flex items-center mt-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                            <span className="text-sm">{clinic.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">
                            From ${clinic.priceFrom}
                          </p>
                          <Button size="sm" className="mt-2">View Details</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No documents uploaded yet</p>
                  <Button className="mt-4">Upload Documents</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No payments yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard;
