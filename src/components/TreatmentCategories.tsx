
import React from 'react';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { useNavigate } from 'react-router-dom';
import { 
  Scissors, 
  Smile, 
  Heart, 
  Eye, 
  Baby, 
  Stethoscope,
  Users,
  TrendingUp
} from 'lucide-react';

const categories = [
  {
    id: 'hair_transplant',
    name: 'Hair Transplant',
    description: 'Advanced hair restoration procedures with expert surgeons',
    icon: <Scissors className="w-6 h-6" />,
    image: '/placeholder.svg',
    stats: '2,500+ procedures',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'dental',
    name: 'Dental Care',
    description: 'Complete dental treatments and cosmetic dentistry',
    icon: <Smile className="w-6 h-6" />,
    image: '/placeholder.svg',
    stats: '5,000+ treatments',
    color: 'bg-green-500',
    bgColor: 'bg-green-50'
  },
  {
    id: 'cosmetic_surgery',
    name: 'Cosmetic Surgery',
    description: 'Aesthetic and reconstructive surgical procedures',
    icon: <Heart className="w-6 h-6" />,
    image: '/placeholder.svg',
    stats: '1,800+ surgeries',
    color: 'bg-pink-500',
    bgColor: 'bg-pink-50'
  },
  {
    id: 'eye_surgery',
    name: 'Eye Surgery',
    description: 'Vision correction and advanced eye treatments',
    icon: <Eye className="w-6 h-6" />,
    image: '/placeholder.svg',
    stats: '3,200+ procedures',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'fertility',
    name: 'Fertility Treatments',
    description: 'IVF and comprehensive reproductive health services',
    icon: <Baby className="w-6 h-6" />,
    image: '/placeholder.svg',
    stats: '1,200+ treatments',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'general_surgery',
    name: 'General Surgery',
    description: 'Wide range of surgical procedures and treatments',
    icon: <Stethoscope className="w-6 h-6" />,
    image: '/placeholder.svg',
    stats: '4,500+ operations',
    color: 'bg-teal-500',
    bgColor: 'bg-teal-50'
  }
];

const TreatmentCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/treatments?category=${categoryId}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Treatment Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of medical treatments across various specialties. 
            Each category features certified clinics and experienced medical professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`${category.bgColor} rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white`}>
                  {category.icon}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{category.stats}</div>
                  <div className="text-xs text-gray-500">procedures</div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#2596be] transition-colors">
                {category.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {category.description}
              </p>
              
              <button className="inline-flex items-center text-[#2596be] hover:text-[#217ca6] font-medium text-sm group-hover:underline">
                Explore Treatments
                <TrendingUp className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/search')}
            className="text-[#2596be] hover:text-[#217ca6] font-medium underline"
          >
            See All of our treatment & Price
          </button>
        </div>
      </div>
    </section>
  );
};

export default TreatmentCategories;
