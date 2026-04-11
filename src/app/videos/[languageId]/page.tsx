import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/AppLayout';
import DifficultyFilter from '@/components/DifficultyFilter';
import ProgressBar from '@/components/progress/ProgressBar';
import Link from 'next/link';
import { programmingLanguages } from '@/data/programming-languages';
import { videoTutorials } from '@/data/video-tutorials';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ languageId: string }>;
}

export async function generateStaticParams() {
  return programmingLanguages.map((lang) => ({ languageId: lang.id }));
}

export async function generateMetadata({ params }: Props) {
  const { languageId } = await params;
  const language = programmingLanguages.find((l) => l.id === languageId);
  return { title: `${language?.name || 'Language'} Tutorials - EduCrow` };
}

export default async function VideoLanguagePage({ params }: Props) {
  const { languageId } = await params;
  const language = programmingLanguages.find((l) => l.id === languageId);

  if (!language) notFound();

  const videos = videoTutorials.filter((v) => v.languageId === language.id);

  const VideoLanguageRightPanel = () => {
    return (
      <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-text-primary uppercase mb-4">{language.name} Track</h3>
          <div className="space-y-4">
            <ProgressBar progress={35} label="Basics" height="h-1.5" color="bg-brand" />
            <ProgressBar progress={10} label="Advanced" height="h-1.5" color="bg-brand-strong" />
          </div>
          <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-text-secondary">
            <span>Lessons: 4 / 12</span>
            <span className="text-brand font-medium">Keep going!</span>
          </div>
        </div>

        <div className="bg-surface-2 border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-text-primary uppercase mb-3">Next Up in {language.name}</h3>
          <div className="bg-surface-1/50 border border-border-subtle rounded-xl p-3">
            <p className="text-text-primary font-medium text-sm line-clamp-2">Closures and Scope chains in {language.name}</p>
            <p className="text-text-tertiary text-[10px] mt-2 font-mono">12 mins remaining</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <AuthGuard />
      <AppLayout rightPanel={<VideoLanguageRightPanel />}>
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 animate-fade-in pb-6 border-b border-border">
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors bg-surface-2 hover:bg-surface-3 px-4 py-2 border border-border rounded-lg w-fit"
            >
              <span>←</span> Back
            </Link>
            <h1 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight flex items-center gap-3">
              <span className="text-4xl inline-flex drop-shadow-md">{language.icon}</span>
              {language.name} Tutorials
            </h1>
          </div>

          <DifficultyFilter videos={videos} />
        </div>
      </AppLayout>
    </>
  );
}
