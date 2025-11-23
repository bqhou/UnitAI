
import React, { useState } from 'react';

interface SmartLookupCardProps {
  onLookup: (query: string) => Promise<void>;
  loading: boolean;
  explanation?: string | null;
}

export const SmartLookupCard: React.FC<SmartLookupCardProps> = ({ onLookup, loading, explanation }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onLookup(query);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 mb-6">
      <div className="flex items-center gap-2 mb-3">
         <div className="p-1.5 bg-indigo-500/20 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
         </div>
         <h3 className="text-lg font-semibold text-slate-100">Smart Unit Finder</h3>
      </div>
      
      <p className="text-slate-400 text-sm mb-4">
        Search for a product (e.g., "iPhone 15 weight" or "Marathon distance") and AI will configure the units for you.
      </p>

      <form onSubmit={handleSubmit} className="relative mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What to measure?"
          disabled={loading}
          className="w-full bg-slate-900 text-slate-200 rounded-lg py-3 px-4 pl-10 pr-10 border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors placeholder-slate-600 disabled:opacity-50 text-base"
        />
        <svg 
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {query && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-16 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
            title="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '...' : 'Find'}
        </button>
      </form>

      {explanation && (
        <div className="flex items-start gap-2 bg-indigo-900/30 border border-indigo-500/20 rounded-lg p-3 mt-4 animate-pulse-slow">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
           </svg>
           <p className="text-xs text-indigo-200 leading-relaxed">
             <span className="font-semibold block mb-0.5">AI Insight:</span>
             {explanation}
           </p>
        </div>
      )}
    </div>
  );
};
