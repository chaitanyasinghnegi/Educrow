'use client';

import { useState } from 'react';
import { VideoTutorial } from '@/data/video-tutorials';

interface DifficultyFilterProps {
  videos: VideoTutorial[];
}

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;

export default function DifficultyFilter({ videos }: DifficultyFilterProps) {
  const [selected, setSelected] = useState<string>('All');

  const filteredVideos = selected === 'All'
    ? videos
    : videos.filter((v) => v.difficulty === selected);

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => setSelected(difficulty)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border ${
              selected === difficulty
                ? 'bg-text-primary text-background border-text-primary shadow-sm drop-shadow-sm'
                : 'bg-surface-2 text-text-secondary border-border hover:bg-surface-3 hover:text-text-primary hover:border-border-strong'
            }`}
          >
            {difficulty}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        {filteredVideos.map((video, index) => (
          <a key={video.id} href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="block focus:outline-none focus:ring-2 focus:ring-brand focus:rounded-2xl">
            <div
              className="video-card bg-surface-1/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden transform hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 h-full flex flex-col group"
              style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
            >
              <div className="relative w-full h-48 overflow-hidden border-b border-border">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-brand/90 flex items-center justify-center text-white backdrop-blur-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4 gap-3">
                  <h3 className="text-xl font-semibold text-text-primary tracking-tight leading-tight line-clamp-2 group-hover:text-brand transition-colors">{video.title}</h3>
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-md text-[12px] font-medium ${
                      video.difficulty === 'Beginner'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : video.difficulty === 'Intermediate'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {video.difficulty}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-3 flex-1">{video.description}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-border-subtle">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {video.duration}
                  </span>
                  <span className="text-sm font-medium text-text-primary group-hover:text-brand transition-colors flex items-center gap-1">
                    Watch Now <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
        {filteredVideos.length === 0 && (
          <div className="col-span-full py-16 text-center bg-surface-1/30 rounded-2xl border border-border border-dashed">
            <p className="text-text-secondary">No videos found for this difficulty level.</p>
          </div>
        )}
      </div>
    </>
  );
}
