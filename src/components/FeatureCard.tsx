import Link from 'next/link';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export default function FeatureCard({ title, description, icon, link }: FeatureCardProps) {
  return (
    <Link
      href={link}
      className="block p-8 bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl card-hover relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="text-6xl blur-[1px]">{icon}</span>
      </div>
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="text-3xl mb-5 inline-flex p-3 bg-surface-2 rounded-xl shadow-sm border border-border-subtle group-hover:border-border transition-colors">{icon}</div>
          <h3 className="text-xl font-semibold text-text-primary tracking-tight mb-2">{title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
        </div>
        <div className="mt-8 flex items-center text-sm font-medium text-text-tertiary group-hover:text-text-primary transition-colors">
          <span>Explore</span>
          <svg className="w-4 h-4 ml-1 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
