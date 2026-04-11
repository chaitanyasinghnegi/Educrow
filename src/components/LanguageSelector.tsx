'use client';

import { useState, useRef, useEffect } from 'react';
import { LANGUAGE_VERSIONS } from '@/lib/constants';

const languages = Object.entries(LANGUAGE_VERSIONS);

interface LanguageSelectorProps {
  language: string;
  onSelect: (lang: string) => void;
}

const LanguageSelector = ({ language, onSelect }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-border rounded-lg text-sm font-medium text-text-primary hover:border-border-strong transition-colors"
      >
        <span>{language}</span>
        <svg className={`w-4 h-4 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-surface-1/90 backdrop-blur-xl border border-border rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-[9999] max-h-64 overflow-y-auto min-w-[200px] p-1 custom-scrollbar animate-fade-in">
          {languages.map(([lang, version]) => (
            <button
              key={lang}
              className={`flex items-center justify-between w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                lang === language
                  ? 'text-brand bg-brand-muted/20 font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
              }`}
              onClick={() => {
                onSelect(lang);
                setIsOpen(false);
              }}
            >
              <span>{lang}</span>
              <span className="text-text-tertiary text-xs">{version}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
