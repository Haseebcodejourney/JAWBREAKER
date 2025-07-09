
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      flag: '🇺🇸',
      treatment: 'Hair Transplant',
      clinic: 'Istanbul Hair Institute',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b107?w=150&h=150&fit=crop&crop=face',
      review: 'Outstanding experience from start to finish. The clinic was professional, the results exceeded my expectations, and I saved over $8,000 compared to US prices. The team spoke perfect English and made me feel comfortable throughout.',
      savings: 8500,
      beforeAfter: true
    },
    {
      id: 2,
      name: 'James Miller',
      location: 'London, UK',
      flag: '🇬🇧',
      treatment: 'Dental Implants',
      clinic: 'Bangkok Dental Spa',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      review: 'Incredible value and quality! Got 6 dental implants for the price of 2 back home. The facility was like a luxury hotel, and the dentist was trained in the US. Flying to Thailand was worth every penny.',
      savings: 12000,
      beforeAfter: true
    },
    {
      id: 3,
      name: 'Maria Gonzalez',
      location: 'Madrid, Spain',
      flag: '🇪🇸',
      treatment: 'Breast Augmentation',
      clinic: 'Mumbai Cosmetic Center',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      review: 'The surgeon was incredibly skilled and the aftercare was exceptional. I stayed in a beautiful recovery suite for a week. The results look natural and exactly what I wanted. Great communication throughout.',
      savings: 6800,
      beforeAfter: true
    },
    {
      id: 4,
      name: 'David Chen',
      location: 'Sydney, Australia',
      flag: '🇦🇺',
      treatment: 'LASIK Eye Surgery',
      clinic: 'Vision Plus Turkey',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      review: 'Life-changing procedure! No more glasses after 20+ years. The technology was cutting-edge, and the surgeon explained everything clearly. Perfect vision now and saved thousands compared to Australia.',
      savings: 4200,
      beforeAfter: false
    },
    {
      id: 5,
      name: 'Emma Wilson',
      location: 'Toronto, Canada',
      flag: '🇨🇦',
      treatment: 'Rhinoplasty',
      clinic: 'Aesthetic Istanbul',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      review: 'Amazing transformation! The surgeon understood exactly what I wanted. Recovery was smooth with great support from the medical team. The platform made everything seamless from booking to aftercare.',
      savings: 7500,
      beforeAfter: true
    },
    {
      id: 6,
      name: 'Michael Schmidt',
      location: 'Berlin, Germany',
      flag: '🇩🇪',
      treatment: 'Knee Replacement',
      clinic: 'Ortho Excellence India',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      review: 'Excellent orthopedic care at a fraction of German prices. The hospital was world-class, surgeon was German-trained, and physiotherapy was included. Walking pain-free now!',
      savings: 15000,
      beforeAfter: false
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Real Stories, Real Results
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Over 100,000 patients have trusted us with their healthcare journey. 
            Here's what they have to say about their experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                      <span className="text-sm">{testimonial.flag}</span>
                    </div>
                    <p className="text-xs text-gray-600">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>

                <div className="mb-3">
                  <Badge variant="outline" className="mr-2 text-xs">
                    {testimonial.treatment}
                  </Badge>
                  {testimonial.beforeAfter && (
                    <Badge variant="secondary" className="text-xs">
                      Before/After Available
                    </Badge>
                  )}
                </div>

                <div className="relative mb-4">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-blue-200" />
                  <p className="text-gray-700 text-sm leading-relaxed pl-4">
                    {testimonial.review}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Clinic:</span>
                    <span className="font-medium">{testimonial.clinic}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-600">Saved:</span>
                    <span className="font-bold text-green-600">
                      ${testimonial.savings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-md">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-bold text-gray-900">4.8/5</span>
            </div>
            <div className="text-gray-400">|</div>
            <div className="text-gray-600">Based on 50,000+ verified reviews</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
