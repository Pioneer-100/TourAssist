'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  username: string;
  email: string;
  nationality: string;
  avatar_url: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, nationality: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithSocial: (provider: 'google' | 'github') => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch profile details with client-side self-healing auto-provisioning fallback
  const fetchProfile = async (userId: string) => {
    try {
      console.log(`🔍 [fetchProfile] Fetching profile for ID: ${userId}`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('⚠️ [fetchProfile] Error querying profiles table:', error.message);
        
        // SELF-HEALING FALLBACK: If no row is returned (PGRST116 or single object coercion fail),
        // we dynamically insert a profile row directly from the client side!
        const isNoRowErr = error.message.includes('coerce') || 
                           error.message.includes('single') || 
                           error.code === 'PGRST116';

        if (isNoRowErr) {
          console.log('🔄 [fetchProfile] Profile row missing in database. Auto-provisioning profile...');
          
          // Get the current authenticated user instance to extract email and signup metadata
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            const username = currentUser.user_metadata?.username || currentUser.email?.split('@')[0] || 'traveler';
            const nationality = currentUser.user_metadata?.nationality || 'International';
            const avatarUrl = currentUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.id}`;
            
            console.log('⚙️ [fetchProfile] Provisioning metadata:', { username, nationality, avatarUrl });
            
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: currentUser.id,
                username,
                email: currentUser.email,
                nationality,
                avatar_url: avatarUrl
              })
              .select()
              .single();

            if (insertError) {
              console.error('❌ [fetchProfile] Auto-provisioning failed:', insertError.message);
              setProfile(null);
            } else {
              console.log('✅ [fetchProfile] Profile successfully self-healed and created:', newProfile);
              setProfile(newProfile);
            }
          } else {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } else {
        console.log('✅ [fetchProfile] Profile fetched successfully:', data);
        setProfile(data);
      }
    } catch (err) {
      console.error('❌ [fetchProfile] Exception caught:', err);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // 1. Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string, nationality: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            nationality,
          },
        },
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signInWithSocial = async (provider: 'google' | 'github') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signInWithSocial, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
}
