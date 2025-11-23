import React from 'react';
import { AIContextResponse } from '../types';

interface AIContextCardProps {
  loading: boolean;
  data: AIContextResponse | null;
  error: string | null;
}

export const AIContextCard: React.FC<AIContextCardProps> = ({ loading, data, error }) => {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-6 w-6 bg-slate-700 rounded-full"></div>
          <div className="h-4 w-32 bg-slate-700 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-700 rounded"></div>
          <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
          <div className="h-4 w-4/6 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-red-900/50">
        <div className="flex items-center gap-2 text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Could not load AI insights.</span>
        </div>
        <p className="mt-2 text-sm text-slate-400">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <div className="flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-100">AI Context Analysis</h3>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">
          Gemini Flash Lite
        </span>
      </div>

      {/* Examples Grid */}
      <div>
        <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Real-Life Comparisons</h4>
        <div className="grid gap-3">
          {data.examples.map((example, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-slate-700/30 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
                {idx + 1}
              </span>
              <p className="text-slate-200 text-sm leading-relaxed">{example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fun Fact */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg p-4 border border-amber-500/20">
        <h4 className="text-amber-400 text-xs font-bold uppercase mb-1 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Did you know?
        </h4>
        <p className="text-slate-300 text-sm italic">
          "{data.funFact}"
        </p>
      </div>

    </div>
  );
};
