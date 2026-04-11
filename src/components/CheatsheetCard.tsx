'use client';

import { useState } from 'react';
import { marked } from 'marked';
import { CheatSheet } from '@/data/cheatsheets';

interface CheatsheetCardProps {
  sheet: CheatSheet;
}

export default function CheatsheetCard({ sheet }: CheatsheetCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const parsedContent = marked.parse(sheet.content) as string;

  return (
    <>
      <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-surface-2 hover:border-border-strong hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col group cursor-pointer h-full" onClick={handleOpen}>
        <h3 className="text-xl font-semibold text-text-primary mb-3 tracking-tight group-hover:text-brand transition-colors">{sheet.title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-1 line-clamp-3">{sheet.description}</p>
        <div className="pt-4 border-t border-border-subtle mt-auto">
          <span className="text-sm font-medium text-text-primary group-hover:text-brand transition-colors flex items-center gap-1">
            View Cheatsheet <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-[100] animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="bg-surface-1 border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-fade-up relative overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-surface-2/50 backdrop-blur-sm sticky top-0 z-10">
              <h2 className="text-xl font-semibold text-text-primary tracking-tight">{sheet.title}</h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-3 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-surface-1">
              <div
                className="prose prose-invert prose-brand max-w-none prose-pre:bg-surface-2 prose-pre:border prose-pre:border-border prose-headings:text-text-primary prose-a:text-brand prose-strong:text-text-primary"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
