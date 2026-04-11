'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/AppLayout';
import ProgressBar from '@/components/progress/ProgressBar';
import CircularProgress from '@/components/progress/CircularProgress';
import { supabase } from '@/lib/supabaseClient';

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedIds, setSolvedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Fetch User Progress
        if (session?.user) {
          const { data: solvedData } = await supabase
            .from('submissions')
            .select('problem_id')
            .eq('user_id', session.user.id)
            .eq('status', 'passed');
            
          if (solvedData) {
            setSolvedIds(new Set(solvedData.map(s => s.problem_id)));
          }
        }

        // Fetch Problems
        const { data: problemsData, error } = await supabase
          .from('problems')
          .select('id, title, description, difficulty, tags')
          .order('id', { ascending: true });

        if (error) throw error;
        if (problemsData) setProblems(problemsData);
        
      } catch (err) {
        console.error('Error fetching problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    problems.forEach(p => p.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
      const matchesTag = !selectedTag || (p.tags && p.tags.includes(selectedTag));
      return matchesSearch && matchesDifficulty && matchesTag;
    });
  }, [problems, searchQuery, difficultyFilter, selectedTag]);

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const currentProblems = filteredProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination effect
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, difficultyFilter, selectedTag]);

  const ProblemsRightPanel = () => {
    const easyTotal = problems.filter(p => p.difficulty === 'Easy').length || 1; // avoid /0
    const mediumTotal = problems.filter(p => p.difficulty === 'Medium').length || 1;
    const hardTotal = problems.filter(p => p.difficulty === 'Hard').length || 1;

    const easySolved = problems.filter(p => p.difficulty === 'Easy' && solvedIds.has(p.id)).length;
    const mediumSolved = problems.filter(p => p.difficulty === 'Medium' && solvedIds.has(p.id)).length;
    const hardSolved = problems.filter(p => p.difficulty === 'Hard' && solvedIds.has(p.id)).length;

    const progressPercentage = Math.round((solvedIds.size / Math.max(problems.length, 1)) * 100);

    return (
      <div className="space-y-6 flex flex-col h-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold tracking-wider text-text-primary uppercase mb-5">Your Progress</h3>
          <div className="flex items-center gap-4 mb-6">
            <CircularProgress progress={progressPercentage} size={60} strokeWidth={5} color="text-brand" trackColor="text-surface-2" />
            <div>
              <p className="text-text-primary font-medium text-lg">{solvedIds.size} / {problems.length}</p>
              <p className="text-text-secondary text-sm">Problems Solved</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border-subtle">
            <ProgressBar progress={Math.round((easySolved/easyTotal)*100)} label={`Easy (${easySolved}/${easyTotal})`} height="h-2" color="bg-green-500" />
            <ProgressBar progress={Math.round((mediumSolved/mediumTotal)*100)} label={`Medium (${mediumSolved}/${mediumTotal})`} height="h-2" color="bg-yellow-500" />
            <ProgressBar progress={Math.round((hardSolved/hardTotal)*100)} label={`Hard (${hardSolved}/${hardTotal})`} height="h-2" color="bg-red-500" />
          </div>
        </div>

        <div className="bg-surface-2 border border-border rounded-2xl p-5 shadow-sm flex-1">
          <h3 className="text-sm font-semibold tracking-wider text-text-primary uppercase mb-4">Categories</h3>
          <div className="flex flex-wrap gap-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2 pb-2">
            <button
               onClick={() => setSelectedTag(null)}
               className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex-shrink-0 transition-colors ${
                 !selectedTag 
                   ? 'bg-brand/20 text-brand border-brand/30' 
                   : 'bg-surface-3 text-text-secondary border-border hover:bg-surface-1 hover:text-text-primary'
               }`}
            >
              All Topics
            </button>
            {allTags.map(tag => (
              <button 
                key={tag} 
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  selectedTag === tag
                    ? 'bg-brand/20 text-brand border-brand/30'
                    : 'bg-surface-3 text-text-secondary border-border hover:bg-surface-1 hover:text-text-primary'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <AuthGuard />
      <AppLayout rightPanel={<ProblemsRightPanel />}>
        <div className="w-full flex-1 min-h-[80vh] flex flex-col">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight mb-3">Coding Problems</h1>
            <p className="text-text-secondary text-lg max-w-2xl">Challenge yourself with our curated collection of coding exercises across different difficulties and topics.</p>
          </div>

          <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between animate-fade-up">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search problems..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-2 border border-border rounded-xl text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-border-strong focus:border-border-strong sm:text-sm transition-all shadow-sm"
              />
            </div>
            <div className="flex bg-surface-1 border border-border rounded-xl p-1 w-fit">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    difficultyFilter === diff 
                      ? 'bg-surface-3 text-text-primary shadow-sm' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1">
            {loading ? (
               <div className="flex items-center justify-center py-20">
                  <svg className="animate-spin h-8 w-8 text-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
               </div>
            ) : (
                <div className="grid gap-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                  {filteredProblems.length > 0 && <span className="text-sm text-text-secondary mb-2">{filteredProblems.length} results</span>}
                  
                  {currentProblems.map((problem) => (
                    <Link
                      key={problem.id}
                      href={`/problems/${problem.id}`}
                      className="group block p-5 md:p-6 bg-surface-1/50 backdrop-blur-sm border border-border rounded-xl card-hover relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          {solvedIds.has(problem.id) && (
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          <h3 className="text-lg md:text-xl font-semibold text-text-primary group-hover:text-brand transition-colors tracking-tight">
                            {problem.id}. {problem.title}
                          </h3>
                        </div>
                        <span
                          className={`inline-flex px-3 py-1 rounded-md text-[13px] font-medium w-fit shrink-0 ${
                            problem.difficulty === 'Easy'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : problem.difficulty === 'Medium'
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 max-w-3xl mb-4">
                        {problem.description}
                      </p>
                      
                      {problem.tags && problem.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {problem.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface-2 text-text-tertiary border border-border-subtle group-hover:bg-surface-3 transition-colors">
                              {tag}
                            </span>
                          ))}
                          {problem.tags.length > 3 && (
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface-2 text-text-tertiary border border-border-subtle group-hover:bg-surface-3 transition-colors">
                              +{problem.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  ))}
                  
                  {filteredProblems.length === 0 && (
                    <div className="text-center py-16 bg-surface-1/30 rounded-xl border border-border border-dashed">
                      <p className="text-text-secondary mt-2">No problems match your filters.</p>
                      <button 
                        onClick={() => { setSearchQuery(''); setDifficultyFilter('All'); setSelectedTag(null); }}
                        className="mt-4 px-4 py-2 bg-surface-2 text-text-primary text-sm font-medium rounded-lg hover:bg-surface-3 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-2 pb-8">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-surface-2 border border-border text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-3 hover:text-text-primary transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="px-4 py-2 rounded-lg bg-surface-1 border border-border text-sm font-medium text-text-primary">
                Page {currentPage} of {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-surface-2 border border-border text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-3 hover:text-text-primary transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
}
