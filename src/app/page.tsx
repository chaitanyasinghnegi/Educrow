import Link from 'next/link';

export const metadata = {
  title: 'EduCrow - Learn, Code, Grow',
};

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center py-24">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-muted blur-[120px] rounded-[100%] pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border text-sm text-text-secondary mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span>The next generation of learning</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-semibold mb-8 tracking-tight text-text-primary leading-[1.1]">
            Master programming<br />
            <span className="text-text-secondary">with intentional practice.</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-12 text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Your comprehensive learning platform. Join our community of developers, access curated coding challenges, and enhance your skills with expert-led tutorials.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-text-primary text-background rounded-full font-medium transition-all duration-300 min-w-[160px] hover:scale-[1.02] hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Start Learning
            </Link>
            <Link
              href="/signin"
              className="px-8 py-3 bg-surface-1 border border-border text-text-primary rounded-full font-medium transition-all duration-300 min-w-[160px] hover:bg-surface-2 hover:border-border-hover"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-32 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '200ms', opacity: 0 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-8 card-hover relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-3">Coding Challenges</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Practice with real-world programming problems and integrated editor.</p>
            </div>
            
            <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-8 card-hover relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="4" y1="10" x2="20" y2="10"></line><line x1="10" y1="4" x2="10" y2="20"></line></svg>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-3">Learning Resources</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Access comprehensive tutorials, videos, and detailed guides.</p>
            </div>
            
            <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-8 card-hover relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-3">Community</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Connect with fellow developers and solve problems collaboratively.</p>
            </div>
            
            <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-8 card-hover relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-3">Track Progress</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Monitor your learning journey with our smart progression system.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
