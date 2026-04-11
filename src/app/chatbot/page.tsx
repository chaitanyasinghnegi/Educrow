'use client';

import { useState, useRef, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/AppLayout';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isUser?: boolean;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: 'Hello! How can I help you with your coding questions today?', isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const conversationHistory = useRef<Message[]>([
    {
      role: 'system',
      content:
        'You are a helpful AI coding assistant. Provide clear, concise answers to programming questions. Do no use emojis, markdown format so no special symbols for heading or code or anything like that. Your only job is to provide with solutions and no extra information and no code, only answer the question in meaning, if the user asking for code, do not provide and do not provide code, only answer the question in meaning and explain to them how you are just there for helping them and not for code pasting',
    },
  ]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = input.trim();
    if (!message) return;

    setInput('');
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    conversationHistory.current.push({ role: 'user', content: message });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory.current,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      conversationHistory.current.push({ role: 'assistant', content: aiResponse });
      setMessages((prev) => [...prev, { text: aiResponse, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, there was an error processing your request. Please try again.', isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const ChatbotRightPanel = () => (
    <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold tracking-wider text-text-primary uppercase mb-4">Chat Context</h3>
        <p className="text-sm text-text-secondary mb-3">Model: <span className="font-medium text-text-primary">Llama 3</span></p>
        <p className="text-sm text-text-secondary mb-3">Provider: <span className="font-medium text-text-primary">Groq</span></p>
        <p className="text-sm text-text-secondary">Messages: <span className="font-medium text-text-primary">{messages.length}</span></p>
      </div>

      <div className="bg-brand-muted/10 border border-brand-strong/20 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">💡</div>
          <h3 className="text-text-primary font-semibold text-lg tracking-tight">Tips</h3>
        </div>
        <ul className="space-y-2 text-sm text-text-secondary list-disc pl-4 mt-3">
          <li>Be specific about the programming language.</li>
          <li>Ask for explanations, not just code.</li>
          <li>You can ask the AI to debug your code by pasting it.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <AuthGuard />
      <AppLayout rightPanel={<ChatbotRightPanel />} hideFooter>
        <div className="w-full flex-1 flex flex-col h-[calc(100vh-6rem)]">
          <div className="mb-4 animate-fade-in pl-2 shrink-0">
            <h1 className="text-3xl font-semibold text-text-primary tracking-tight mb-2">AI Coding Assistant</h1>
            <p className="text-text-secondary text-sm">Ask questions, get explanations, and debug your code with our LLM.</p>
          </div>
          
          <div className="flex-1 bg-surface-1/50 backdrop-blur-xl border border-border rounded-2xl p-4 md:p-6 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.4)] animate-fade-up min-h-[400px]">
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto space-y-6 pr-2 mb-6 custom-scrollbar"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${msg.isUser ? 'bg-text-primary text-background rounded-tr-sm' : 'bg-surface-2 border border-border-subtle text-text-primary rounded-tl-sm'}`}>
                    <p className={`text-xs font-medium mb-1 opacity-70 ${msg.isUser ? '' : 'text-brand-light'}`}>
                      {msg.isUser ? 'You' : 'EduCrow AI'}
                    </p>
                    <div className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-2 border border-border-subtle rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="relative shrink-0 mt-auto pb-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="w-full bg-surface-2 border border-border rounded-xl pl-5 pr-14 py-4 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-border-strong focus:border-border-strong transition-all shadow-sm"
                placeholder="Ask me anything..."
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-text-primary text-background rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center -mt-2"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
