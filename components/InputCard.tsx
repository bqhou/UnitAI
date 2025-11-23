import React from 'react';
import { UnitCategory, UnitDef } from '../types';
import { getUnitsBySystem } from '../constants';

interface InputCardProps {
  category: UnitCategory;
  setCategory: (c: UnitCategory) => void;
  direction: 'us-to-metric' | 'metric-to-us';
  setDirection: (d: 'us-to-metric' | 'metric-to-us') => void;
  fromUnit: string;
  setFromUnit: (u: string) => void;
  toUnit: string;
  setToUnit: (u: string) => void;
  value: number | '';
  setValue: (v: number | '') => void;
  categories: UnitCategory[];
}

export const InputCard: React.FC<InputCardProps> = ({
  category,
  setCategory,
  direction,
  setDirection,
  fromUnit,
  setFromUnit,
  toUnit,
  setToUnit,
  value,
  setValue,
  categories
}) => {
  
  // Determine source and target systems based on direction
  const sourceSystem = direction === 'us-to-metric' ? 'us' : 'metric';
  const targetSystem = direction === 'us-to-metric' ? 'metric' : 'us';

  const sourceUnits = getUnitsBySystem(category, sourceSystem);
  const targetUnits = getUnitsBySystem(category, targetSystem);

  const handleSwap = () => {
    setDirection(direction === 'us-to-metric' ? 'metric-to-us' : 'us-to-metric');
  };

  return (
    <div className="bg-slate-800 rounded-xl p-3 md:p-6 shadow-lg border border-slate-700">
      <div className="flex items-center justify-between mb-3 md:mb-6">
        <h2 className="text-base md:text-xl font-semibold text-slate-100 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Configure
        </h2>
        
        {/* Direction Toggle */}
        <button 
          onClick={handleSwap}
          className="flex items-center gap-2 text-[10px] md:text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-indigo-300 px-2 py-1.5 md:px-3 md:py-2 rounded-lg transition-colors border border-slate-600 active:scale-95"
          title="Swap Source and Target"
        >
          {direction === 'us-to-metric' ? 'US → Intl' : 'Intl → US'}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
      </div>

      <div className="space-y-3 md:space-y-5">
        {/* Category Selector */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-slate-400 mb-1 md:mb-2">Category</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as UnitCategory)}
              className="w-full bg-slate-900 text-slate-200 rounded-lg py-2 md:py-3 px-3 md:px-4 border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-colors text-sm md:text-base"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-5">
          {/* FROM Unit Selector */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-slate-400 mb-1 md:mb-2">
              From ({direction === 'us-to-metric' ? 'US' : 'Intl'})
            </label>
            <div className="relative">
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 rounded-lg py-2 md:py-3 px-3 md:px-4 border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-colors text-sm md:text-base"
              >
                {sourceUnits.map((u: UnitDef) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.abbr})</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 md:px-4 text-slate-500">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* TO Unit Selector */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-indigo-400 mb-1 md:mb-2">
              To ({direction === 'us-to-metric' ? 'Intl' : 'US'})
            </label>
            <div className="relative">
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 rounded-lg py-2 md:py-3 px-3 md:px-4 border border-indigo-900/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-colors ring-1 ring-indigo-500/30 text-sm md:text-base"
              >
                {targetUnits.map((u: UnitDef) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.abbr})</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 md:px-4 text-slate-500">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Value Input */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-slate-400 mb-1 md:mb-2">Value</label>
          <div className="relative">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="Enter value..."
              className="w-full bg-slate-900 text-slate-200 rounded-lg py-2 md:py-3 px-3 md:px-4 pr-12 border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors placeholder-slate-600 text-sm md:text-base"
            />
            {value !== '' && (
              <button
                onClick={() => setValue('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-2 rounded-md hover:bg-slate-700 transition-colors"
                title="Clear value"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};