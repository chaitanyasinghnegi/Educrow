'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabaseClient';

const links = [
  { href: '/dashboard', text: 'Dashboard' },
  { href: '/problems', text: 'Problems' },
  { href: '/chatbot', text: 'AI Help' },
  { href: '/videos', text: 'Tutorials' },
  { href: '/cheatsheets', text: 'Cheat Sheets' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.first_name) {
        setUserFirstName(session.user.user_metadata.first_name);
      }
    };
    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('userSession');
    await supabase.auth.signOut();
    window.location.href = '/signin';
  };

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-md border-border-strong shadow-[0_4px_30px_rgba(0,0,0,0.1)]' 
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="text-xl font-semibold tracking-tight text-text-primary flex items-center gap-2">
            <span className="bg-text-primary text-background rounded-sm w-6 h-6 flex items-center justify-center text-sm">E</span>
            EduCrow
          </Link>
          <div className="hidden md:flex space-x-1 items-center bg-surface-1/50 rounded-full px-2 py-1 border border-border">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-surface-3 text-text-primary shadow-sm' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                  }`}
                >
                  {link.text}
                </Link>
              );
            })}
          </div>
          <div className="hidden md:flex items-center">
            {userFirstName && (
              <Link href="/profile" className="text-sm text-text-secondary mr-4 hover:text-text-primary transition-colors">
                Hi, <span className="font-medium text-text-primary">{userFirstName}</span>
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-1.5 text-sm font-medium text-text-primary border border-border rounded-md hover:bg-surface-2 hover:border-border-strong transition-all"
            >
              Sign Out
            </button>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-text-primary p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface-1 border-b border-border absolute w-full shadow-lg">
          <div className="px-5 pt-3 pb-5 space-y-2">
            {userFirstName && (
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm text-text-secondary border-b border-border-subtle mb-2 hover:bg-surface-2 rounded-lg transition-colors"
              >
                Signed in as <span className="font-medium text-text-primary">{userFirstName}</span>
              </Link>
            )}
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive 
                      ? 'bg-surface-3 text-text-primary' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                  }`}
                >
                  {link.text}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="w-full mt-4 flex items-center justify-center p-3 text-sm font-medium text-text-primary border border-border rounded-lg hover:bg-surface-2 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
