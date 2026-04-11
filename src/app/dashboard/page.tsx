'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/AppLayout';
import FeatureCard from '@/components/FeatureCard';
import CircularProgress from '@/components/progress/CircularProgress';
import ProgressBar from '@/components/progress/ProgressBar';
import { supabase } from '@/lib/supabaseClient';

const features = [
  {
    title: 'Coding Problems',
    description: 'Practice with our curated collection of coding challenges',
    icon: '💻',
    link: '/problems',
  },
  {
    title: 'AI Assistant',
    description: 'Get help from our AI chatbot while coding',
    icon: '🤖',
    link: '/chatbot',
  },
  {
    title: 'Video Tutorials',
    description: 'Learn from our comprehensive video library',
    icon: '🎥',
    link: '/videos',
  },
  {
    title: 'Cheat Sheets',
    description: 'Quick reference guides for various programming concepts',
    icon: '📝',
    link: '/cheatsheets',
  },
];

interface DashboardStats {
  problemsSolved: number;
  totalProblems: number;
  videosWatched: number;
  streak: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Developer');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    problemsSolved: 0,
    totalProblems: 70, // Hardcoded for now based on our insert
    videosWatched: 0,
    streak: 0,
  });
  const [nextProblem, setNextProblem] = useState<{ id: number; title: string; difficulty: string } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUserId(session.user.id);
          if (session.user.user_metadata?.first_name) {
            setUserName(session.user.user_metadata.first_name);
          }

          // Fetch problems solved count
          const { count } = await supabase
            .from('submissions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id)
            .eq('status', 'passed');
            
          const problemsSolved = count || 0;

          // Compute streak (simple version)
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('completed_at')
            .eq('user_id', session.user.id)
            .eq('completed', true)
            .not('completed_at', 'is', null)
            .order('completed_at', { ascending: false });

          let streak = 0;
          if (progressData && progressData.length > 0) {
             // simplified streak calc for now
             streak = 1;
             // in a real app, group by UTC date and count consecutive days
          }

          // Find an unsolved problem for "Up Next"
          const { data: solvedIdsData } = await supabase
            .from('submissions')
            .select('problem_id')
            .eq('user_id', session.user.id)
            .eq('status', 'passed');
            
          const solvedIds = new Set(solvedIdsData?.map(s => s.problem_id) || []);
          
          const { data: allProblems } = await supabase
            .from('problems')
            .select('id, title, difficulty')
            .limit(50);
            
          let foundNext = null;
          if (allProblems) {
            foundNext = allProblems.find(p => !solvedIds.has(p.id)) || allProblems[0];
          }

          setStats({
            problemsSolved,
            totalProblems: 70,
            videosWatched: 0, // Placeholder
            streak
          });
          
          if (foundNext) {
            setNextProblem(foundNext);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const progressPercentage = Math.round((stats.problemsSolved / stats.totalProblems) * 100) || 0;

  const DashboardRightPanel = () => {
    return (
      <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {/* Learning Progress Widget */}
        <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-text-primary uppercase mb-5">Learning Progress</h3>
          <div className="flex items-center justify-between gap-4 mb-6">
            <CircularProgress progress={progressPercentage} size={70} strokeWidth={6} color="text-brand-light" trackColor="text-surface-2" />
            <div className="flex-1">
              <p className="text-text-primary font-medium">Platform Mastery</p>
              <p className="text-text-secondary text-sm">{stats.problemsSolved} of {stats.totalProblems} problems</p>
            </div>
          </div>
          <div className="pt-4 border-t border-border-subtle">
            <ProgressBar progress={progressPercentage} label="Overall Mastery" height="h-1.5" />
          </div>
        </div>

        {/* Streak Widget */}
        <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-8xl opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            🔥
          </div>
          <div className="flex items-center gap-4 mb-2 relative z-10">
            <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand text-xl border border-brand/20">
              ⚡
            </div>
            <div>
              <h3 className="text-text-primary font-semibold text-lg tracking-tight">{stats.streak} Day Streak</h3>
              <p className="text-text-secondary text-sm">{stats.streak > 0 ? "You are on fire!" : "Start solving to build a streak!"}</p>
            </div>
          </div>
        </div>

        {/* Recommended Next Step */}
        <div className="bg-surface-2 border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-text-primary uppercase mb-3">Up Next</h3>
          <div className="bg-surface-1 border border-border-subtle rounded-xl p-4">
            <p className="text-xs text-brand font-medium mb-1 tracking-wider uppercase">Problem Solving</p>
            <p className="text-text-primary font-medium text-sm mb-2 opacity-90 line-clamp-1">{nextProblem ? nextProblem.title : "Loading..."}</p>
            <button 
              onClick={() => nextProblem && router.push(`/problems/${nextProblem.id}`)}
              disabled={!nextProblem}
              className="w-full mt-2 bg-text-primary text-background py-2 rounded-lg text-sm font-semibold hover:bg-brand-light transition-colors disabled:opacity-50"
            >
              Start Problem
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <AuthGuard />
      <AppLayout rightPanel={!loading ? <DashboardRightPanel /> : null}>
        <div className="w-full flex-1 min-h-[80vh]">
          {loading ? (
             <div className="flex items-center justify-center h-full">
                <svg className="animate-spin h-8 w-8 text-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
             </div>
          ) : (
            <>
              {/* Header Section */}
              <section className="mb-10 animate-fade-in pt-4 md:pt-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 text-xs text-brand border border-brand-strong/30 rounded-full mb-4 font-medium uppercase tracking-wider bg-brand-muted/10">
                  Your Dashboard
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary tracking-tight mb-3">
                  Welcome back, <span className="text-brand-light">{userName}</span>
                </h1>
                <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
                  Continue your learning journey with our curated selection of resources. Jump back in or explore something new.
                </p>
              </section>

              {/* Quick Stats Banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fade-up">
                {[
                  { label: 'Problems Solved', value: stats.problemsSolved.toString(), unit: `/ ${stats.totalProblems}` },
                  { label: 'Platform Mastery', value: `${progressPercentage}%`, unit: '' },
                  { label: 'Videos Watched', value: stats.videosWatched.toString(), unit: '' },
                  { label: 'Global Rank', value: 'Unranked', unit: '' },
                ].map((stat, i) => (
                  <div key={i} className="bg-surface-1/50 border border-border rounded-2xl p-4 md:p-5 flex flex-col justify-center hover:bg-surface-2 transition-colors">
                    <span className="text-text-tertiary text-xs lg:text-sm font-semibold uppercase tracking-wider mb-2">{stat.label}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl lg:text-3xl font-semibold text-text-primary tracking-tight">{stat.value}</span>
                      {stat.unit && <span className="text-text-secondary text-sm">{stat.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Modules Grid */}
              <section className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text-primary tracking-tight">Learning Modules</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
                  {features.map((feature) => (
                    <FeatureCard key={feature.link} {...feature} />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </AppLayout>
    </>
  );
}
