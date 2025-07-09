
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const NavigationMenus = () => {
  const { t } = useLanguage();

  const treatments = [
    { 
      name: t('treatment.hairTransplant'), 
      icon: '💇‍♂️', 
      popular: true, 
      path: '/treatments?category=hair_transplant' 
    },
    { 
      name: t('treatment.dental'), 
      icon: '🦷', 
      popular: true, 
      path: '/treatments?category=dental' 
    },
    { 
      name: t('treatment.plasticSurgery'), 
      icon: '✨', 
      popular: true, 
      path: '/treatments?category=cosmetic_surgery' 
    },
    { 
      name: t('treatment.eyeSurgery'), 
      icon: '👁️', 
      popular: false, 
      path: '/treatments?category=eye_surgery' 
    },
    { 
      name: t('treatment.fertility'), 
      icon: '👶', 
      popular: false, 
      path: '/treatments?category=fertility' 
    },
    { 
      name: t('treatment.cardiology'), 
      icon: '❤️', 
      popular: false, 
      path: '/treatments?category=cardiology' 
    }
  ];

  const destinations = [
    { country: 'Turkey', city: 'Istanbul', flag: '🇹🇷', treatments: '2,500+ clinics', path: '/treatments?destination=Turkey' },
    { country: 'Thailand', city: 'Bangkok', flag: '🇹🇭', treatments: '1,200+ clinics', path: '/treatments?destination=Thailand' },
    { country: 'India', city: 'Mumbai', flag: '🇮🇳', treatments: '800+ clinics', path: '/treatments?destination=India' },
    { country: 'Mexico', city: 'Tijuana', flag: '🇲🇽', treatments: '600+ clinics', path: '/treatments?destination=Mexico' }
  ];

  return (
    <div className="hidden md:flex items-center space-x-8">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{t('nav.treatments')}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-6 w-80">
                <div className="row-span-3">
                  <div className="mb-2 text-sm font-medium text-gray-600">Popular Treatments</div>
                  {treatments.map((treatment) => (
                    <NavigationMenuLink
                      key={treatment.name}
                      asChild
                    >
                      <Link 
                        to={treatment.path}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{treatment.icon}</span>
                          <div>
                            <div className="text-sm font-medium leading-none flex items-center gap-2">
                              {treatment.name}
                              {treatment.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>{t('nav.destinations')}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-6 w-96 grid-cols-2">
                {destinations.map((dest) => (
                  <NavigationMenuLink
                    key={dest.country}
                    asChild
                  >
                    <Link 
                      to={dest.path}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{dest.flag}</span>
                        <div>
                          <div className="text-sm font-medium leading-none">{dest.country}</div>
                          <div className="text-xs text-gray-500">{dest.treatments}</div>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Link to="/treatments" className="text-gray-700 hover:text-blue-600 transition-colors">
        {t('nav.allTreatments')}
      </Link>
      <Link to="/search" className="text-gray-700 hover:text-blue-600 transition-colors">
        {t('nav.findClinics')}
      </Link>
    </div>
  );
};

export default NavigationMenus;
