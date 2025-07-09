import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Stethoscope, 
  FileText, 
  Zap, 
  Shield, 
  Clock, 
  Users, 
  TrendingUp,
  Cpu,
  Activity,
  Heart,
  ArrowRight,
  Sparkles,
  Bot
} from 'lucide-react';

const AIMedicalScribeSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stagger animation for elements with smoother timing
          const elements = [0, 1, 2, 3, 4, 5, 6, 7];
          elements.forEach((index) => {
            setTimeout(() => {
              setAnimatedElements(prev => new Set([...prev, index]));
            }, index * 150); // Faster staggering for smoother feel
          });
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const section = document.getElementById('ai-scribe-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze medical data in real-time",
      color: "from-blue-500 to-[#2596be]"
    },
    {
      icon: FileText,
      title: "Smart Documentation",
      description: "Automatically generates comprehensive medical notes and reports",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security ensuring patient data protection",
      color: "from-green-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Instant analysis and feedback during patient consultations",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  const stats = [
    { value: "99.7%", label: "Accuracy Rate", icon: TrendingUp },
    { value: "85%", label: "Time Saved", icon: Clock },
    { value: "10k+", label: "Doctors Trust Us", icon: Users },
    { value: "24/7", label: "AI Support", icon: Bot }
  ];

  const floatingElements = [
    { icon: Heart, position: "top-10 left-10", delay: "0s" },
    { icon: Activity, position: "top-20 right-20", delay: "1s" },
    { icon: Stethoscope, position: "top-40 left-20", delay: "2s" },
    { icon: Cpu, position: "bottom-20 right-10", delay: "1.5s" },
    { icon: Brain, position: "bottom-40 left-10", delay: "0.5s" },
    { icon: Sparkles, position: "top-60 right-40", delay: "2.5s" }
  ];

  return (
    <section 
      id="ai-scribe-section"
      className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]" />
      </div>

      {/* Floating animated elements */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className={`absolute ${element.position} opacity-20 animate-float hover:opacity-40 transition-opacity duration-300`}
          style={{
            animationDelay: element.delay,
            animationDuration: `${3 + index * 0.5}s`
          }}
        >
          <element.icon className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      ))}

      {/* Additional floating particles */}
      {[...Array(12)].map((_, index) => (
        <div
          key={`particle-${index}`}
          className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${4 + Math.random() * 2}s`
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div 
              className={`space-y-6 transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                <Bot className="w-4 h-4" />
                <span>AI Medical Assistant</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Say hello to your
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  AI medical scribe.
                </span>
              </h2>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                Smarter notes, better care.
              </p>
              
              <p className="text-lg text-blue-200 leading-relaxed">
                Transform your medical documentation with AI-powered intelligence that understands 
                context, learns from patterns, and enhances patient care quality.
              </p>
            </div>

            <div 
              className={`transition-all duration-1000 delay-300 ${
                animatedElements.has(1) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <Button className="relative bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden group">
                <span className="relative z-10 flex items-center">
                  Try AI Scribe - it's free
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            </div>

            {/* Stats */}
            <div 
              className={`grid grid-cols-2 gap-4 pt-8 transition-all duration-1000 delay-500 ${
                animatedElements.has(2) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <stat.icon className="w-5 h-5 text-cyan-400" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                  </div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Interactive AI Visualization */}
          <div className="relative">
            {/* Main AI Brain Visualization */}
            <div 
              className={`relative transition-all duration-1000 delay-700 ${
                animatedElements.has(3) ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90'
              }`}
            >
              <Card className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden">
                {/* Central AI Core */}
                <div className="relative flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-[#2596be] rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                    
                    {/* Orbiting elements */}
                    {[0, 60, 120, 180, 240, 300].map((rotation, index) => (
                      <div
                        key={index}
                        className="absolute top-1/2 left-1/2 w-40 h-40 transform -translate-x-1/2 -translate-y-1/2 animate-spin"
                        style={{ 
                          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                          animationDuration: '20s',
                          animationDelay: `${index * 0.5}s`
                        }}
                      >
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full shadow-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-700 ${
                        animatedElements.has(4 + index) ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                      }`}
                      style={{ transitionDelay: `${800 + index * 200}ms` }}
                    >
                      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-3`}>
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-white text-sm mb-2">{feature.title}</h3>
                        <p className="text-blue-200 text-xs leading-relaxed">{feature.description}</p>
                      </Card>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Floating accent elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl p-3 shadow-xl animate-bounce">
                <Sparkles className="w-6 h-6 text-white" />
              </div>

              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3 shadow-xl animate-pulse">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl -z-10"></div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div 
          className={`mt-20 text-center transition-all duration-1000 delay-1200 ${
            animatedElements.has(5) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-4 mb-8">
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
              Machine Learning
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
              Natural Language Processing
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
              Medical AI
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
              Healthcare Innovation
            </Badge>
          </div>
          
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Join thousands of healthcare professionals who trust our AI to enhance their practice 
            and improve patient outcomes through intelligent automation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIMedicalScribeSection;
