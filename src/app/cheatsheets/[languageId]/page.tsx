import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/AppLayout';
import CheatsheetCard from '@/components/CheatsheetCard';
import Link from 'next/link';
import { programmingLanguages } from '@/data/programming-languages';
import { cheatsheets } from '@/data/cheatsheets';
import { notFound } from 'next/navigation';
import CheatsheetActions from './CheatsheetActions';

interface Props {
  params: Promise<{ languageId: string }>;
}

export async function generateStaticParams() {
  return programmingLanguages.map((lang) => ({ languageId: lang.id }));
}

export async function generateMetadata({ params }: Props) {
  const { languageId } = await params;
  const language = programmingLanguages.find((l) => l.id === languageId);
  return { title: `${language?.name || 'Language'} Cheatsheets - EduCrow` };
}

export default async function CheatsheetLanguagePage({ params }: Props) {
  const { languageId } = await params;
  const language = programmingLanguages.find((l) => l.id === languageId);

  if (!language) notFound();

  const languageCheatsheets = cheatsheets.filter((sheet) => sheet.languageId === language.id);

  const CheatsheetLanguageRightPanel = () => {
    return (
      <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-text-primary uppercase mb-3">Quick Actions</h3>
          <CheatsheetActions languageName={language.name} />
        </div>

        <div className="bg-brand-muted/10 border border-brand-strong/20 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-text-primary uppercase mb-2 text-brand">Did you know?</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {language.name} has a rich ecosystem of libraries. Check out the "Core Libraries" cheatsheet for a quick overview of built-in modules.
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <AuthGuard />
      <AppLayout rightPanel={<CheatsheetLanguageRightPanel />}>
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 animate-fade-in pb-6 border-b border-border">
            <Link
              href="/cheatsheets"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors bg-surface-2 hover:bg-surface-3 px-4 py-2 border border-border rounded-lg w-fit"
            >
              <span>←</span> Back
            </Link>
            <h1 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight flex items-center gap-3">
              <span className="text-4xl inline-flex drop-shadow-md">{language.icon}</span>
              {language.name} Cheatsheets
            </h1>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {languageCheatsheets.map((sheet) => (
              <CheatsheetCard key={sheet.id} sheet={sheet} />
            ))}
            
            {languageCheatsheets.length === 0 && (
              <div className="col-span-full py-16 text-center bg-surface-1/30 rounded-2xl border border-border border-dashed">
                <p className="text-text-secondary">No cheatsheets available yet for this language.</p>
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </>
  );
}
