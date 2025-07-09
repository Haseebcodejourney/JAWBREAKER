
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail, Globe, Award, Calendar, MessageCircle } from 'lucide-react';
import { useClinicById } from '@/hooks/useClinics';
import { Skeleton } from '@/components/ui/skeleton';

const ClinicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: clinic, isLoading, error } = useClinicById(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
            <Skeleton className="h-64 md:h-96 w-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Clinic not found</h2>
            <p className="text-gray-600">The clinic you're looking for doesn't exist or is not available.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
          <div className="relative h-64 md:h-96">
            <img 
              src={clinic.cover_image_url || 'https://images.unsplash.com/photo-1551601651-767bb2180d49?w=800&h=400&fit=crop'} 
              alt={clinic.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold">{clinic.name}</h1>
                  {clinic.verified && (
                    <Badge className="bg-green-600">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {clinic.city}, {clinic.country}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                    {clinic.rating} ({clinic.review_count} reviews)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About {clinic.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{clinic.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {clinic.languages?.map((language) => (
                        <Badge key={language} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Established</h4>
                    <p className="text-gray-600">{clinic.established_year || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accreditations */}
            {clinic.accreditations && clinic.accreditations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Accreditations & Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {clinic.accreditations.map((acc) => (
                      <Badge key={acc} className="bg-blue-100 text-blue-800">
                        <Award className="w-3 h-3 mr-1" />
                        {acc}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {clinic.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{clinic.phone}</span>
                  </div>
                )}
                {clinic.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{clinic.email}</span>
                  </div>
                )}
                {clinic.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-3 text-gray-400" />
                    <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {clinic.website}
                    </a>
                  </div>
                )}
                {clinic.address && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{clinic.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link to={`/booking/${clinic.id}`}>
                    <Button className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Consultation
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ClinicProfile;
