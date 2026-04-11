'use client';

import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface AppLayoutProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  hideFooter?: boolean;
}

export default function AppLayout({ children, rightPanel, hideFooter = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      <Navigation />
      
      {/* Ambient background */}
      <div className="fixed top-0 right-[-10%] h-[800px] w-[800px] bg-brand-muted/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/3" />
      <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-6 relative z-10 flex pt-6 pb-12 gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0 flex flex-col">
          {children}
        </div>

        {/* Optional Right Panel */}
        {rightPanel && (
          <aside className="hidden lg:flex w-80 shrink-0 flex-col gap-6 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pr-2 overflow-x-hidden">
            {rightPanel}
          </aside>
        )}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}
