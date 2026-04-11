import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/AppLayout';
import AnimatedButton from '@/components/AnimatedButton';
import ProgressBar from '@/components/progress/ProgressBar';
import { programmingLanguages } from '@/data/programming-languages';

export const metadata = {
  title: 'Video Tutorials - EduCrow',
};

const VideosRightPanel = () => {
  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold tracking-wider text-text-primary uppercase mb-5">Learning Tracks</h3>
        
        <div className="space-y-5">
          <ProgressBar progress={80} label="Python Basics" height="h-1.5" color="bg-blue-500" />
          <ProgressBar progress={45} label="JavaScript Mastery" height="h-1.5" color="bg-yellow-500" />
          <ProgressBar progress={10} label="C++ Data Structures" height="h-1.5" color="bg-purple-500" />
        </div>
      </div>

      <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden group">
        <div className="flex flex-col items-center justify-center py-4 relative z-10 text-center">
          <div className="text-4xl mb-3">🎓</div>
          <h3 className="text-text-primary font-semibold text-lg tracking-tight mb-1">Keep it up!</h3>
          <p className="text-text-secondary text-sm">You watched 4 videos this week.</p>
        </div>
      </div>
    </div>
  );
};

export default function VideosPage() {
  return (
    <>
      <AuthGuard />
      <AppLayout rightPanel={<VideosRightPanel />}>
        <div className="w-full">
          <div className="mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight mb-4">Choose Your Language</h1>
            <p className="text-text-secondary text-lg">Select a programming language to explore its video tutorials and curated learning paths.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {programmingLanguages.map((language, index) => (
              <AnimatedButton
                key={language.id}
                href={`/videos/${language.id}`}
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
