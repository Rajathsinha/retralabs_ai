import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<AuthError | null>;
  signInWithGoogle: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<AuthError | null>;
  signUp: (email: string, password: string, name: string) => Promise<AuthError | null>;
  signOut: () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string; address?: string }) => Promise<AuthError | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* Initial session */
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    /* Listen for changes */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ── Email + Password ── */
  const signInWithPassword = async (email: string, password: string): Promise<AuthError | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error;
  };

  /* ── Google OAuth ── */
  const signInWithGoogle = async (): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  /* ── Magic Link ── */
  const signInWithMagicLink = async (email: string): Promise<AuthError | null> => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    return error;
  };

  /* ── Sign Up ── */
  const signUp = async (email: string, password: string, name: string): Promise<AuthError | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    return error;
  };

  /* ── Sign Out ── */
  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  /* ── Update profile metadata ── */
  const updateProfile = async (data: { name?: string; phone?: string; address?: string }): Promise<AuthError | null> => {
    const { error } = await supabase.auth.updateUser({ data });
    return error;
  };

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      signInWithPassword, signInWithGoogle, signInWithMagicLink,
      signUp, signOut, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
