'use client';

interface Props {
  languageName: string;
}

export default function CheatsheetActions({ languageName }: Props) {
  const handleDownload = () => {
    alert(`Downloading ${languageName} cheatsheets PDF... (Simulated)`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-2">
      <button 
        onClick={handleDownload}
        className="w-full flex items-center justify-between p-3 bg-surface-2 hover:bg-surface-3 border border-border rounded-xl transition-colors text-sm text-text-primary"
      >
        <span>Download All {languageName}</span>
        <span className="text-text-tertiary">PDF</span>
      </button>
      <button 
        onClick={handlePrint}
        className="w-full flex items-center justify-between p-3 bg-surface-2 hover:bg-surface-3 border border-border rounded-xl transition-colors text-sm text-text-primary"
      >
        <span>Print Guide</span>
        <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      </button>
    </div>
  );
}
