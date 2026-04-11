export default function Footer() {
  return (
    <footer className="bg-surface-0 border-t border-border mt-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-text-primary font-bold shadow-sm">
              E
            </div>
            <span className="font-semibold text-text-primary tracking-tight">EduCrow</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-text-secondary">
              © {new Date().getFullYear()} EduCrow. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
