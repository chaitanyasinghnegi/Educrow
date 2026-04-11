import { supabaseServer } from '@/lib/supabaseServer';
import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CodeEditorWrapper from '@/components/CodeEditorWrapper';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const { data: problems } = await supabaseServer
    .from('problems')
    .select('id')
    .order('id', { ascending: true });

  return (problems || []).map((p) => ({ id: p.id.toString() }));
}

export default async function ProblemDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: problemData, error } = await supabaseServer
    .from('problems')
    .select(`*, examples (*)`)
    .eq('id', id)
    .single();

  if (error || !problemData) {
    notFound();
  }

  const problem = {
    ...problemData,
    examples: problemData.examples || [],
  };

  const difficultyClass =
    problem.difficulty === 'Easy'
      ? 'bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20'
      : problem.difficulty === 'Medium'
      ? 'bg-[#facc15]/10 text-[#facc15] border border-[#facc15]/20'
      : 'bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20';

  return (
    <>
      <AuthGuard />
      <AppLayout hideFooter>
        <div className="w-full relative z-10 min-h-[calc(100vh-6rem)]">
          <div className="w-full h-full flex flex-col lg:flex-row gap-6 animate-fade-in pb-12">
            
            {/* Left Column: Problem Information */}
            <div className="w-full lg:w-[45%] flex flex-col gap-6">
              
              <Link href="/problems" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors w-fit">
                <span>←</span> Back to Problems
              </Link>

              <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-sm overflow-y-auto max-h-[calc(100vh-240px)] custom-scrollbar">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <h1 className="text-2xl lg:text-3xl font-semibold text-text-primary tracking-tight">{problem.title}</h1>
                  <span className={`px-3 py-1 rounded-md text-[13px] font-medium ${difficultyClass}`}>
                    {problem.difficulty}
                  </span>
                </div>
                
                {problem.tags && Array.isArray(problem.tags) && problem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {problem.tags.map((tag: string) => (
                      <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-md bg-surface-2 text-text-tertiary border border-border-subtle select-none">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="prose prose-invert max-w-none">
                  <p className="text-text-secondary leading-relaxed mb-8">{problem.description}</p>

                  <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Examples</h3>
                  <div className="space-y-4">
                    {problem.examples.map((example: { id: string; input: string; output: string; explanation?: string }) => (
                      <div key={example.id} className="bg-surface-2 border border-border p-4 rounded-xl">
                        <p className="font-mono text-sm text-text-secondary mb-2 whitespace-pre-wrap">
                          <span className="text-text-primary font-medium select-none">Input: </span> {example.input}
                        </p>
                        <p className="font-mono text-sm text-text-secondary mb-2 whitespace-pre-wrap">
                          <span className="text-text-primary font-medium select-none">Output: </span> {example.output}
                        </p>
                        {example.explanation && (
                          <div className="mt-3 pt-3 border-t border-border-subtle">
                            <p className="text-sm text-text-tertiary leading-relaxed">
                              <span className="text-text-secondary font-medium select-none">Explanation: </span>
                              {example.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {problem.constraints && Array.isArray(problem.constraints) && problem.constraints.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Constraints</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {problem.constraints.map((constraint: string, idx: number) => (
                          <li key={idx} className="text-sm font-mono text-text-secondary bg-surface-2/50 px-3 py-1.5 rounded w-fit border border-border-subtle inline-block mb-1 mr-2">{constraint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Code Editor Space */}
            <div className="w-full lg:w-[55%] flex flex-col h-[600px] lg:h-[calc(100vh-180px)]">
              <CodeEditorWrapper />
            </div>

          </div>
        </div>
      </AppLayout>
    </>
  );
}
