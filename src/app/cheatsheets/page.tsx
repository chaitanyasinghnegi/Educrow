import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/AppLayout';
import AnimatedButton from '@/components/AnimatedButton';
import { programmingLanguages } from '@/data/programming-languages';

export const metadata = {
  title: 'Programming Cheatsheets - EduCrow',
};

const CheatsheetsRightPanel = () => {
  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold tracking-wider text-text-primary uppercase mb-4">Most Popular</h3>
        
        <div className="space-y-3">
          {[
            { tag: 'Array Methods', lang: 'JavaScript' },
            { tag: 'List Comprehension', lang: 'Python' },
            { tag: 'Pointer Basics', lang: 'C++' },
            { tag: 'Streams API', lang: 'Java' }
          ].map((item, idx) => (
            <div key={idx} className="group p-3 bg-surface-2 border border-border rounded-xl cursor-pointer hover:border-brand-strong transition-colors">
              <p className="text-sm font-medium text-text-primary group-hover:text-brand transition-colors">{item.tag}</p>
              <p className="text-xs text-text-secondary mt-1">{item.lang}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-muted/10 border border-brand-strong/20 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">💡</div>
          <h3 className="text-text-primary font-semibold text-lg tracking-tight">Pro Tip</h3>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">
          Cheatsheets are highly dense. Keep them open in a split window while solving problems to quickly recall syntax and built-in functions.
        </p>
      </div>
    </div>
  );
};

export default function CheatsheetsPage() {
  return (
    <>
      <AuthGuard />
      <AppLayout rightPanel={<CheatsheetsRightPanel />}>
        <div className="w-full">
          <div className="mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight mb-4">Programming Cheatsheets</h1>
            <p className="text-text-secondary text-lg">Select a programming language to view its quick reference guides for syntax, concepts, and common patterns.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {programmingLanguages.map((language, index) => (
              <AnimatedButton
                key={language.id}
                href={`/cheatsheets/${language.id}`}
                icon={language.icon}
                name={language.name}
                delay={(index + 1) * 100}
              />
            ))}
          </div>
        </div>
      </AppLayout>
    </>
  );
}
