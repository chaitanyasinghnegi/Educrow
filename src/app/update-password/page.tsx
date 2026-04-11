'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type UIState = 'loading' | 'form' | 'error' | 'success';

export default function UpdatePasswordPage() {
  const [uiState, setUiState] = useState<UIState>('loading');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setUiState('form');
      }
    });

    const timer = setTimeout(() => {
      setUiState((prev) => {
        if (prev === 'loading') return 'error';
        return prev;
      });
    }, 3000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const np = fd.get('new_password') as string;
    const cp = fd.get('confirm_password') as string;

    if (np.length < 6) { setError('Min 6 characters.'); return; }
    if (np !== cp) { setError("Passwords don't match."); return; }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: np });
      if (error) throw error;
      setUiState('success');
      await supabase.auth.signOut();
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('userSession');
      setTimeout(() => { window.location.href = '/signin'; }, 2000);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed.');
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
          <h2 className="text-4xl font-semibold text-text-primary tracking-tight">Set new password</h2>
          <p className="mt-3 text-lg text-text-secondary">
            Secure your account with a strong, unique password that you haven't used elsewhere.
          </p>
        </div>

        <div className="w-full max-w-md">
          {uiState === 'loading' && (
            <div className="text-center py-12 bg-surface-1/50 backdrop-blur-xl border border-border rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-secondary mx-auto mb-4" />
              <p className="text-sm text-text-secondary">Verifying reset link...</p>
            </div>
          )}

          {uiState === 'error' && (
            <div className="bg-surface-1/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] animate-fade-in">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-sm text-status-error text-center font-medium">
                  Invalid or expired link.{' '}
                  <Link href="/reset-password" className="underline hover:text-red-400 transition-colors">
                    Request a new one
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}

          {uiState === 'form' && (
            <div className="bg-surface-1/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] animate-fade-in">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-text-secondary mb-1.5">
                      New password
                    </label>
                    <input
                      id="new-password"
                      name="new_password"
                      type="password"
                      required
                      className="appearance-none block w-full px-4 py-3 bg-surface-2 border border-border placeholder-text-tertiary text-text-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-border-strong focus:border-border-strong sm:text-sm transition-all shadow-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-text-secondary mb-1.5">
                      Confirm password
                    </label>
                    <input
                      id="confirm-password"
                      name="confirm_password"
                      type="password"
                      required
                      className="appearance-none block w-full px-4 py-3 bg-surface-2 border border-border placeholder-text-tertiary text-text-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-border-strong focus:border-border-strong sm:text-sm transition-all shadow-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-background bg-text-primary hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none items-center gap-2"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>

                {error && (
                  <div className="text-status-error text-center text-sm font-medium bg-red-500/10 border border-red-500/20 py-2.5 rounded-lg mt-4">
                    {error}
                  </div>
                )}
              </form>
            </div>
          )}

          {uiState === 'success' && (
            <div className="bg-surface-1/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] animate-fade-in text-center">
              <div className="w-16 h-16 bg-status-success/10 border border-status-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Password Updated</h3>
              <p className="text-text-secondary">Your password has been changed. Redirecting to sign in...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
