
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { signIn, user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    
    if (user && userProfile) {
      console.log('User and profile loaded:', { user: user.email, role: userProfile.role });
      
      const from = location.state?.from?.pathname;
      
      if (userProfile.role === 'admin') {
        const destination = from === '/admin/dashboard' ? from : '/admin/dashboard';
        console.log('Redirecting admin to:', destination);
        navigate(destination, { replace: true });
      } else {
        const destination = from && from !== '/login' ? from : '/';
        console.log('Redirecting user to:', destination);
        navigate(destination, { replace: true });
      }
    } else if (user && !userProfile) {
      console.log('User loaded but profile missing, waiting...');
    }
  }, [user, userProfile, loading, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log('Submitting login form...');
      const { error } = await signIn(formData.email, formData.password);
      
      if (!error) {
        console.log('Login successful, auth context will handle navigation...');
      }
    } catch (error) {
      console.error('Login form error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = () => {
    setFormData({
      email: 'deniz@dxdglobal.com',
      password: 'Admin123!'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div> */}
            <span className="text-2xl font-bold text-gray-900">JAW BREAKER</span>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <p className="text-gray-600">Sign in to your account</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" disabled={isLoading} />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-[#2596be] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full !bg-[#96be25] hover:!bg-[#96be25]"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Test Admin User:</p>
              <p className="text-sm text-blue-600">Email: haseebcodejourney@gmail.com</p>
              <p className="text-sm text-blue-600">Password: Admin123!</p>
              <Button 
                type="button"
                onClick={handleTestLogin}
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                disabled={isLoading}
              >
                Fill Test Credentials
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#2596be] hover:underline font-medium">
                  Sign up for free
                  
                </Link>
                
              </p>
            </div>
            <p style={{textAlign: 'center',display:'flex',justifyContent:'center', marginTop:'10px'}}>(WhatsApp: +90 548 83 12 13 7)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
