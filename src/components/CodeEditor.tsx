'use client';

import { useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import LanguageSelector from './LanguageSelector';
import { CODE_SNIPPETS } from '@/lib/constants';
import Output from './Output';

const CodeEditor = () => {
  const editorRef = useRef<{ getValue: () => string } | undefined>(undefined);
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState('python');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (lang: string) => {
    setLanguage(lang);
    setValue(CODE_SNIPPETS[lang] || '');
  };

  return (
    <div className="w-full h-full flex flex-col bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-2/30">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
        </div>
        <LanguageSelector language={language} onSelect={onSelect} />
      </div>

      {/* Editor Body */}
      <div className="flex-[3] min-h-[300px] relative">
        <Editor
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
            lineHeight: 1.6,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
          }}
          theme="vs-dark"
          language={language}
          defaultValue={CODE_SNIPPETS[language]}
          onMount={onMount}
          value={value}
          onChange={(val) => setValue(val || '')}
          className="absolute inset-0"
        />
      </div>

      {/* Output Panel */}
      <div className="flex-[2] min-h-[200px] flex flex-col border-t border-border relative z-20">
        <Output editorRef={editorRef} language={language} />
      </div>
    </div>
  );
};

export default CodeEditor;
