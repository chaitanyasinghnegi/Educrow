'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const checkAuth = async () => {
      const publicPaths = ['/', '/signin', '/signup', '/reset-password'];
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        if (!currentSession && !publicPaths.includes(pathname)) {
          router.push('/signin');
        }
      });
      subscription = data.subscription;
      
      if (!session && !publicPaths.includes(pathname)) {
        router.push('/signin');
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background text-text-primary">
        <svg className="animate-spin h-8 w-8 text-text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return null;
}
