'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import StepTracker from '@/components/progress/StepTracker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignUpPage() {
  const [error, setError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(Array(8).fill(''));
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const pendingEmail = useRef('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startResendTimer = () => {
    setResendDisabled(true);
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSignupLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    const phone_number = formData.get('phone_number') as string;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name, last_name, phone_number } },
      });
      if (error) throw error;
      if (data.user) {
        pendingEmail.current = email;
        setOtpVisible(true);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
        startResendTimer();
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSignupLoading(false);
    }
  };

  const getOtpCode = () => otpValues.join('');

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otpValues];
    next[index] = digit;
    setOtpValues(next);
    if (digit && index < 7) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    const next = [...otpValues];
    for (let i = 0; i < Math.min(pasted.length, 8 - index); i++) {
      next[index + i] = pasted[i];
    }
    setOtpValues(next);
    const nextFocus = Math.min(index + pasted.length, 7);
    inputRefs.current[nextFocus]?.focus();
  };

  const handleVerify = async () => {
    const token = getOtpCode();
    if (token.length !== 8) return;
    setOtpError('');
    setVerifyLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: pendingEmail.current,
        token,
        type: 'signup',
      });
      if (error) throw error;
      if (data.session) {
        sessionStorage.setItem('userData', JSON.stringify({
          id: data.user?.id,
          email: data.user?.email,
          first_name: data.user?.user_metadata?.first_name || '',
          last_name: data.user?.user_metadata?.last_name || '',
          phone_number: data.user?.user_metadata?.phone_number || '',
        }));
        sessionStorage.setItem('userSession', JSON.stringify(data.session));
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      setOtpError((err as Error).message || 'Invalid verification code. Please try again.');
      setOtpValues(Array(8).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: pendingEmail.current });
      if (error) throw error;
      startResendTimer();
      setOtpError('');
    } catch (err: unknown) {
      setOtpError((err as Error).message || 'Failed to resend code.');
    }
  };

  const otpComplete = getOtpCode().length === 8;

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
          <h2 className="text-4xl font-semibold text-text-primary tracking-tight">Create your account</h2>
          <p className="mt-3 text-lg text-text-secondary">
            Join thousands of developers learning and practicing with EduCrow.
          </p>

          <div className="mt-12 hidden lg:block">
            <StepTracker
              currentStepId={otpVisible ? 'verify' : 'account'}
              steps={[
                { id: 'account', label: 'Basic Info', description: 'Setup your profile details' },
                { id: 'verify', label: 'Verify Email', description: 'Confirm your email address' },
                { id: 'start', label: 'Start Learning', description: 'Explore tutorials and challenges' },
              ]}
            />
          </div>
        </div>

        <div className="w-full max-w-md">
          {/* Mobile step tracker */}
          <div className="mb-8 lg:hidden">
            <StepTracker
              currentStepId={otpVisible ? 'verify' : 'account'}
              steps={[
                { id: 'account', label: 'Basic Info' },
                { id: 'verify', label: 'Verify Email' },
              ]}
            />
          </div>
          
          <div className="bg-surface-1/50 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative">
            <div className="absolute top-4 right-6 text-sm text-text-secondary">
              Already have an account?{' '}
              <Link href="/signin" className="font-medium text-brand hover:text-blue-400 transition-colors">
                Sign in
              </Link>
            </div>

          <form className="space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              {[
                { id: 'first_name', label: 'First Name', type: 'text', placeholder: 'John' },
                { id: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Doe' },
                { id: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
                { id: 'phone_number', label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 8900' },
                { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium text-text-secondary mb-1.5 cursor-pointer">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    required
                    className="appearance-none block w-full px-4 py-3 bg-surface-2 border border-border placeholder-text-tertiary text-text-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-border-strong focus:border-border-strong sm:text-sm transition-all shadow-sm"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
            
            <button
              type="submit"
              disabled={signupLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-background bg-text-primary hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none items-center gap-2"
            >
              {signupLoading ? (
                <>
                  <span>Creating account...</span>
                  <svg className="animate-spin h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </>
              ) : (
                'Sign Up'
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
      </div>      {/* OTP Modal */}
      {otpVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" />
          <div className="relative bg-surface-1 border border-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 max-w-md w-full animate-fade-in z-10">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-surface-2 border border-border mb-6">
                <svg className="h-8 w-8 text-text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-text-primary mb-2">Check your email</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                We&apos;ve sent an 8-digit verification code to
                <br />
                <span className="font-medium text-text-primary">{pendingEmail.current}</span>
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {otpValues.map((val, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={val}
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  className="w-10 h-12 bg-surface-2 text-center text-lg font-medium text-text-primary border border-border rounded-lg focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-border-strong transition-all shadow-sm"
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={(e) => handleOtpPaste(index, e)}
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={!otpComplete || verifyLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-background bg-text-primary hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none items-center gap-2 mb-4"
            >
              {verifyLoading ? (
                <>
                  <span>Verifying...</span>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </>
              ) : (
                'Verify & Continue'
              )}
            </button>

            {otpError && (
              <div className="text-status-error text-center text-sm font-medium bg-red-500/10 border border-red-500/20 py-2.5 rounded-lg mb-4">
                {otpError}
              </div>
            )}

            <div className="text-center text-sm text-text-secondary">
              Didn&apos;t receive the code?{' '}
              {resendDisabled ? (
                <span>Resend in {countdown}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  className="font-medium text-text-primary hover:text-brand transition-colors"
                >
                  Click to resend
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
