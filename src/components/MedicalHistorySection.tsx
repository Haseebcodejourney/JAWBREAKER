import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, Brain, TrendingUp } from 'lucide-react';

const MedicalHistorySection = () => {
  const conditions = [
    { name: 'Insomnia', color: 'bg-blue-500', position: { top: '10%', right: '20%' } },
    { name: 'Depression', color: 'bg-blue-400', position: { top: '15%', right: '5%' } },
    { name: 'Atrial fibrillation', color: 'bg-blue-300', position: { top: '25%', left: '15%' } },
    { name: 'Anxiety', color: 'bg-blue-200', position: { top: '30%', right: '25%' } },
    { name: 'Diabetes', color: 'bg-blue-100', position: { top: '35%', left: '5%' } },
    { name: 'Hyperlipidemia', color: 'bg-blue-200', position: { top: '40%', left: '25%' } },
    { name: 'Hypertension', color: 'bg-blue-300', position: { top: '45%', right: '15%' } },
    { name: 'Fractures', color: 'bg-blue-600', position: { top: '50%', left: '10%' } },
    { name: 'Covid-19', color: 'bg-blue-200', position: { top: '55%', right: '30%' } },
    { name: 'Incontinence', color: 'bg-blue-500', position: { top: '60%', right: '10%' } },
    { name: 'Falls', color: 'bg-blue-600', position: { top: '65%', left: '20%' } },
    { name: 'MRSA', color: 'bg-blue-200', position: { top: '70%', left: '35%' } },
    { name: 'Cellulitis', color: 'bg-blue-300', position: { top: '75%', right: '20%' } },
    { name: 'Sleep apnea', color: 'bg-blue-400', position: { top: '80%', left: '15%' } },
    { name: 'Chronic kidney disease', color: 'bg-blue-200', position: { top: '85%', right: '5%' } },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Illustration */}
          <div className="relative">
            {/* Doctor illustration */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8" style={{ color: '#2596be' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Medical Analysis</h3>
                  <p className="text-gray-600">Comprehensive health assessment</p>
                </div>
              </div>
              
              {/* Stacked documents illustration */}
              <div className="relative mx-auto w-48 h-32 mb-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-40 h-6 bg-white border-2 border-gray-200 rounded-sm shadow-sm"
                    style={{
                      bottom: `${i * 3}px`,
                      left: `${i * 2}px`,
                      transform: `rotate(${i * -1}deg)`,
                    }}
                  >
                    <div className="flex space-x-1 p-1">
                      <div className="w-2 h-1 bg-gray-300 rounded"></div>
                      <div className="w-8 h-1 bg-gray-300 rounded"></div>
                      <div className="w-4 h-1 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
                <FileText className="absolute -top-4 -right-4 w-8 h-8 text-blue-500" />
              </div>
            </div>

            {/* Floating conditions cloud */}
            <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-8 h-80 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
              {conditions.map((condition, index) => (
                <Badge
                  key={index}
                  className={`absolute ${condition.color} text-white border-0 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer text-xs px-3 py-1`}
                  style={condition.position}
                >
                  {condition.name}
                </Badge>
              ))}
              
              {/* Central connecting lines */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2596be' }}></div>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-16 h-px bg-gradient-to-r from-blue-400 to-transparent"
                    style={{
                      transform: `rotate(${i * 60}deg)`,
                      transformOrigin: 'left center',
                    }}
                  ></div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full text-sm font-medium" style={{ color: '#2596be' }}>
                <Search className="w-4 h-4" />
                <span>Advanced Medical Analysis</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Document their
                <span className="block" style={{ color: '#2596be' }}>entire history</span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Using medical records, our AI system is able to find{" "}
                <span className="font-semibold" style={{ color: '#2596be' }}>45% more conditions</span>{" "}
                compared to traditional clinical assessment methods.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" style={{ color: '#2596be' }} />
                  </div>
                <h3 className="font-semibold" style={{ color: '#222B45' }}>Pattern Recognition</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Identifies hidden patterns and connections across medical history
                </p>
              </Card>

              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-50 to-white">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">AI-Powered Insights</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Machine learning algorithms analyze comprehensive health data
                </p>
              </Card>
            </div>

            {/* Statistics */}
            <div className="flex items-center space-x-8 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#2596be' }}>45%</div>
                <div className="text-sm text-gray-600">More Conditions Found</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Analysis Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MedicalHistorySection;
