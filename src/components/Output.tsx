'use client';

import { useState, MutableRefObject } from 'react';
import { executeCode } from '@/lib/api';

interface OutputProps {
  editorRef: MutableRefObject<{ getValue: () => string } | undefined>;
  language: string;
}

const Output = ({ editorRef, language }: OutputProps) => {
  const [output, setOutput] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const runCode = async () => {
    if (!editorRef.current) return;
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split('\n'));
      setIsError(!!result.stderr);
    } catch (error: unknown) {
      const err = error as Error;
      console.log(err);
      setToastMsg(err.message || 'Unable to run code');
      setTimeout(() => setToastMsg(''), 6000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-surface-1 border-t border-border mt-auto relative z-20">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-2/50 backdrop-blur-sm">
        <p className="text-sm font-medium text-text-primary tracking-tight">Output</p>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-muted/20 text-brand border border-brand-strong/30 rounded-lg text-xs font-semibold hover:bg-brand-muted/40 transition-colors disabled:opacity-50"
          disabled={isLoading}
          onClick={runCode}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Running
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run Code
            </>
          )}
        </button>
      </div>
      
      <div
        className={`flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar ${
          isError ? 'text-status-error bg-red-500/5' : 'text-text-secondary bg-surface-0'
        }`}
      >
        {output ? (
          output.map((line, i) => (
            <p key={i} className="min-h-[1.5rem] whitespace-pre-wrap">{line}</p>
          ))
        ) : (
          <p className="text-text-tertiary italic">Click &quot;Run Code&quot; to see the output here.</p>
        )}
      </div>

      {toastMsg && (
        <div className="absolute top-12 right-4 bg-surface-2 border border-red-500/30 rounded-xl p-4 shadow-lg animate-fade-up z-50">
          <p className="text-sm font-semibold text-status-error mb-1">Execution Error</p>
          <p className="text-xs text-text-secondary">{toastMsg}</p>
        </div>
      )}
    </div>
  );
};

export default Output;
