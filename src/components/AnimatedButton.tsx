import Link from 'next/link';

interface AnimatedButtonProps {
  href: string;
  icon: string;
  name: string;
  delay?: number;
}

export default function AnimatedButton({ href, icon, name, delay = 0 }: AnimatedButtonProps) {
  return (
    <Link
      href={href}
      className="animated-button group relative overflow-hidden rounded-2xl bg-surface-1/50 backdrop-blur-sm border border-border p-8 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:bg-surface-2 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] block"
      style={{ '--delay': `${delay}ms` } as React.CSSProperties}
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-6xl mb-6 transform transition-transform duration-300 group-hover:scale-110 drop-shadow-md">
          {icon}
        </span>
        <h3 className="text-2xl font-semibold text-text-primary tracking-tight mb-4">{name}</h3>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-5 py-2.5 text-sm font-medium text-text-secondary transition-all duration-300 group-hover:bg-brand group-hover:text-background group-hover:border-transparent">
          View Tutorials
          <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
      <div className="absolute top-0 inset-x-0 h-[100px] bg-brand-muted/0 blur-[50px] rounded-full pointer-events-none opacity-0 transition-opacity duration-300 group-hover:bg-brand-muted/20 group-hover:opacity-100" />
    </Link>
  );
}
