'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const email = new FormData(e.currentTarget).get('email') as string;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password',
      });
      if (error) throw error;
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      setError((err as Error).message || 'An error occurred.');
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
          <h2 className="text-4xl font-semibold text-text-primary tracking-tight">Recover access</h2>
          <p className="mt-3 text-lg text-text-secondary">
            Enter your email and we'll send you a secure link to reset your password.
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-surface-1/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative">
            <form className="space-y-6" onSubmit={handleSubmit}>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-background bg-text-primary hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none items-center gap-2"
              >
                {loading ? (
                  <>
                    <span>Sending...</span>
                    <svg className="animate-spin h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>

              {error && (
                <div className="text-status-error text-center text-sm font-medium bg-red-500/10 border border-red-500/20 py-2.5 rounded-lg mt-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-status-success/10 border border-status-success/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-status-success text-center">Check your email — we sent a reset link.</p>
                </div>
              )}
            </form>
          </div>

          <div className="text-center mt-6">
            <Link href="/signin" className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-2">
              <span>←</span> Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
