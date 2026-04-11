'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function SignInPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user && data.session) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.user_metadata?.first_name || '',
          last_name: data.user.user_metadata?.last_name || '',
          phone_number: data.user.user_metadata?.phone_number || '',
        };
        sessionStorage.setItem('userData', JSON.stringify(userData));
        sessionStorage.setItem('userSession', JSON.stringify(data.session));
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-muted/40 blur-[100px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10 animate-fade-in flex flex-col lg:flex-row gap-12 items-center lg:items-start lg:justify-between py-12">
        <div className="text-center lg:text-left flex-1 lg:max-w-md pt-8">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-surface-2 border border-border text-text-primary hover:border-border-hover transition-colors mb-6 shadow-sm mx-auto lg:mx-0">
            <span className="font-semibold text-xl">E</span>
          </Link>
          <h2 className="text-4xl font-semibold text-text-primary tracking-tight">Welcome back</h2>
          <p className="mt-3 text-lg text-text-secondary">
            Pick up where you left off and continue your learning journey.
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-surface-1/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative">
            <div className="absolute top-4 right-6 text-sm text-text-secondary">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-medium text-brand hover:text-blue-400 transition-colors">
                Sign up
              </Link>
            </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-4 py-3 bg-surface-2 border border-border placeholder-text-tertiary text-text-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-border-strong focus:border-border-strong sm:text-sm transition-all shadow-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 bg-surface-2 border border-border placeholder-text-tertiary text-text-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-border-strong focus:border-border-strong sm:text-sm transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end">
              <Link href="/reset-password" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-background bg-text-primary hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                'Sign In'
              )}
            </button>
            
            {error && (
              <div className="text-status-error text-center text-sm font-medium bg-red-500/10 border border-red-500/20 py-2.5 rounded-lg mt-4">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}
