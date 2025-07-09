import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Award, Users, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const OasisTrainingSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Patient Safety First",
      description: "Every recommendation prioritizes patient well-being and safety protocols"
    },
    {
      icon: Award,
      title: "Clinical Excellence",
      description: "Trained on evidence-based medical practices and current guidelines"
    },
    {
      icon: Users,
      title: "Collaborative Care",
      description: "Designed to enhance, not replace, physician decision-making"
    }
  ];

  const certifications = [
    "HIPAA Compliant",
    "FDA Guidelines",
    "Medical Ethics",
    "Clinical Standards",
    "Safety Protocols"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>OASIS Certified AI</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Trained in
                <span className="block font-bold" style={{ color: '#2596be', letterSpacing: '2px', fontSize: '1.2em' }}>
                  OASIS
                </span>
              </h2>
              
              <div className="space-y-4">
                <p className="text-xl text-gray-600 leading-relaxed">
                  Our AI understands that effective healthcare systems ask what is{" "}
                  <span className="font-semibold text-blue-600 italic">safe</span>{" "}
                  for the patient,
                </p>
                <p className="text-xl text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-900">not</span> what they're doing today.
                </p>
              </div>
            </div>

            {/* Feature cards */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-x-2 bg-gradient-to-r from-white to-gray-50">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Compliance & Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, index) => (
                  <Badge 
                    key={index}
                    className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border-0 px-3 py-1"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            <Button className="bg-gradient-to-r to-[##96be25] text-white px-8 py-3 rounded-xl shadow-lg  transition-all duration-300" style={{backgroundColor:'#96be25'}}>
              Learn More About OASIS
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Right side - Illustration */}
          <div className="relative">
            {/* Main illustration container */}
            <Card className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-white border-0 shadow-2xl rounded-3xl p-8 overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                  {[...Array(64)].map((_, i) => (
                    <div 
                      key={i} 
                      className="border border-blue-200 animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Central AI Brain */}
              <div className="relative z-10 flex flex-col items-center space-y-6">
                {/* OASIS Logo/Symbol */}
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-[#2596be] rounded-full flex items-center justify-center shadow-2xl">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-[#2596be] bg-clip-text text-transparent">
                        OASIS
                      </div>
                    </div>
                  </div>
                  
                  {/* Orbiting elements */}
                  {[0, 120, 240].map((rotation, index) => (
                    <div
                      key={index}
                      className="absolute top-1/2 left-1/2 w-48 h-48 transform -translate-x-1/2 -translate-y-1/2"
                      style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
                    >
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                    </div>
                  ))}
                </div>

                {/* Training Data Indicators */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mx-auto">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-700">Safety Protocols</div>
                    <div className="text-xs text-gray-500">10M+ cases</div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mx-auto">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-700">Clinical Guidelines</div>
                    <div className="text-xs text-gray-500">500+ sources</div>
                  </div>
                </div>

                {/* Code snippet representation */}
                <Card className="w-full bg-gray-900 text-green-400 p-4 rounded-lg shadow-inner font-mono text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400">if</span>
                      <span className="text-white">(patient.safety</span>
                      <span className="text-yellow-400">===</span>
                      <span className="text-white">priority) {"{}"}</span>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <span className="text-purple-400">recommend</span>
                      <span className="text-white">(safestOption);</span>
                    </div>
                    <div className="text-white">{"}"}</div>
                    <div className="text-gray-500">// OASIS Protocol Active</div>
                  </div>
                </Card>
              </div>

              {/* Floating elements */}
              <div className="absolute top-4 right-4 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute bottom-8 left-6 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/3 left-4 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </Card>

            {/* Floating stats */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">99.7%</div>
                  <div className="text-xs text-gray-600">Safety Score</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Real-time</div>
                  <div className="text-xs text-gray-600">Analysis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OasisTrainingSection;
