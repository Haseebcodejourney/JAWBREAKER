import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cleanupAuthState, handleRobustSignIn } from '@/utils/authUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userProfile: any;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: () => boolean;
  isClinicOwner: () => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log('Fetching user profile for:', userId, 'retry:', retryCount);
      
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        if (retryCount < 2) {
          return fetchUserProfile(userId, retryCount + 1);
        }
        return;
      }
      
      console.log('User profile fetched successfully:', data);
      setUserProfile(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      if (retryCount < 2) {
        setTimeout(() => fetchUserProfile(userId, retryCount + 1), 1000);
      }
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  const isClinicOwner = () => {
    return userProfile?.role === 'clinic_owner';
  };

  const hasRole = (role: string) => {
    return userProfile?.role === role;
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 100);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await handleRobustSignIn(email, password);
      
      if (error) {
        console.error('Sign in error:', error);
        let errorMessage = "Sign in failed. Please check your credentials.";
        
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password.";
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = "Please verify your email address.";
        }
        
        toast({
          title: "Sign In Error",
          description: errorMessage,
          variant: "destructive",
        });
        return { error };
      }

      console.log('Sign in successful:', data?.user?.email);
      toast({
        title: "Welcome!",
        description: "Successfully signed in.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Sign in catch error:', error);
      toast({
        title: "Sign In Error",
        description: error.message || "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message?.includes('User already registered')) {
          errorMessage = "This email address is already registered.";
        }
        
        toast({
          title: "Registration Error",
          description: errorMessage,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Account created!",
        description: "Please check your email and verify your account.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out...');
      
      setUser(null);
      setSession(null);
      setUserProfile(null);
      
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Global signout failed, continuing...');
      }
      
      toast({
        title: "Signed out",
        description: "Successfully signed out.",
      });
      
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    userProfile,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    isAdmin,
    isClinicOwner,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
