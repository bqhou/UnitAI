import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UnitCategory, AIContextResponse } from './types';
import { UNIT_DATA, CATEGORIES, getUnitsBySystem, convertValue, RECOMMENDED_MAPPINGS } from './constants';
import { fetchConversionContext, performSmartLookup } from './services/geminiService';
import { InputCard } from './components/InputCard';
import { ResultCard } from './components/ResultCard';
import { AIContextCard } from './components/AIContextCard';
import { SmartLookupCard } from './components/SmartLookupCard';

export default function App() {
  // Mobile Tab State
  const [activeTab, setActiveTab] = useState<'converter' | 'finder'>('converter');

  // Config State
  const [category, setCategory] = useState<UnitCategory>(UnitCategory.DISTANCE);
  const [direction, setDirection] = useState<'us-to-metric' | 'metric-to-us'>('us-to-metric');
  
  // Selection State
  const [fromUnit, setFromUnit] = useState<string>('foot'); 
  const [toUnit, setToUnit] = useState<string>('meter');
  const [value, setValue] = useState<number | ''>('');
  
  // AI State
  const [aiData, setAiData] = useState<AIContextResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Smart Lookup State
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupExplanation, setLookupExplanation] = useState<string | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper to determine active systems
  const sourceSystem = direction === 'us-to-metric' ? 'us' : 'metric';
  const targetSystem = direction === 'us-to-metric' ? 'metric' : 'us';

  // --- Effects to handle resets when Category or Direction changes ---
  
  // When category changes, reset units.
  useEffect(() => {
    // Only reset if the current selection is invalid for the new category/direction
    const sources = getUnitsBySystem(category, sourceSystem);
    const targets = getUnitsBySystem(category, targetSystem);
    
    const isFromValid = sources.some(u => u.id === fromUnit);
    const isToValid = targets.some(u => u.id === toUnit);

    if (!isFromValid && sources.length > 0) {
      const defaultFrom = sources[0].id;
      setFromUnit(defaultFrom);
      // Determine default To unit
      const recommended = RECOMMENDED_MAPPINGS[defaultFrom];
      if (recommended && targets.find(t => t.id === recommended)) {
        setToUnit(recommended);
      } else if (targets.length > 0) {
        setToUnit(targets[0].id);
      }
    } else if (!isToValid && targets.length > 0) {
       // If from is valid but to isn't (e.g. direction change)
       const recommended = RECOMMENDED_MAPPINGS[fromUnit];
       if (recommended && targets.find(t => t.id === recommended)) {
         setToUnit(recommended);
       } else {
         setToUnit(targets[0].id);
       }
    }
  }, [category, direction, fromUnit, toUnit, sourceSystem, targetSystem]);

  // Smart unit switching: When user changes "From Unit", update "To Unit" to recommended
  const handleFromUnitChange = (newFromUnit: string) => {
    setFromUnit(newFromUnit);
    
    const targets = getUnitsBySystem(category, targetSystem);
    const recommended = RECOMMENDED_MAPPINGS[newFromUnit];
    
    // If there is a recommendation and it exists in the current target list, use it
    if (recommended && targets.find(t => t.id === recommended)) {
      setToUnit(recommended);
    }
  };

  // Calculate conversion
  const allUnits = UNIT_DATA[category];
  const fromUnitDef = allUnits.find(u => u.id === fromUnit);
  const toUnitDef = allUnits.find(u => u.id === toUnit);

  const convertedValue = (typeof value === 'number' && fromUnitDef && toUnitDef)
    ? convertValue(value, fromUnitDef, toUnitDef, category)
    : 0;

  // Calculate rate for ResultCard formula (1 unit = X unit)
  const conversionRate = (fromUnitDef && toUnitDef)
    ? convertValue(1, fromUnitDef, toUnitDef, category)
    : 0;

  // --- AI Logic ---

  const triggerAI = useCallback(async (val: number, fromDef: any, toDef: any) => {
    setAiLoading(true);
    setAiError(null);
    setAiData(null);
    
    try {
      const data = await fetchConversionContext(val, fromDef.name, toDef.name);
      setAiData(data);
    } catch (err: any) {
      setAiError("Failed to generate AI insights.");
    } finally {
      setAiLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof value !== 'number' || !fromUnitDef || !toUnitDef) {
      setAiData(null);
      setAiLoading(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      triggerAI(value, fromUnitDef, toUnitDef);
    }, 1000);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value, fromUnitDef, toUnitDef, triggerAI]);

  // --- Smart Lookup Handler ---
  const handleSmartLookup = async (query: string) => {
    setLookupLoading(true);
    setAiError(null);
    setLookupExplanation(null);
    
    try {
      const result = await performSmartLookup(query);
      
      // Update state based on AI prediction
      setCategory(result.category);
      setLookupExplanation(result.explanation);
      
      // Check direction based on the predicted 'fromUnitId'
      const allCatUnits = UNIT_DATA[result.category];
      const predictedFrom = allCatUnits.find(u => u.id === result.fromUnitId);
      
      if (predictedFrom) {
        if (predictedFrom.system === 'us') {
          setDirection('us-to-metric');
        } else {
          setDirection('metric-to-us');
        }
        
        // These updates will trigger the effects to validate/set units
        setFromUnit(result.fromUnitId);
        setToUnit(result.toUnitId);
        setValue(result.value);
        
        // Switch to Converter view on mobile to see the result
        setActiveTab('converter');
      }

    } catch (err) {
      setAiError("Could not identify units from that query. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  const hasResult = typeof value === 'number' && fromUnitDef && toUnitDef;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30 pb-24 lg:pb-0">
      <div className="max-w-6xl mx-auto p-2 md:p-8 space-y-2 md:space-y-6">
        
        {/* Header - Compact for Mobile */}
        <header className="text-center space-y-1 py-2 md:py-6">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-500/10 rounded-xl mb-1 ring-1 ring-indigo-500/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-8 md:w-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <h1 className="text-xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200">
            UnitAI
          </h1>
        </header>

        {/* Main Content */}
        <main className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          
          {/* LEFT COLUMN (Converter) 
              Visible if activeTab is 'converter' OR if we are on Desktop (lg)
          */}
          <div className={`space-y-3 md:space-y-6 ${activeTab === 'converter' ? 'block' : 'hidden lg:block'}`}>
            <InputCard 
              category={category}
              setCategory={setCategory}
              direction={direction}
              setDirection={setDirection}
              fromUnit={fromUnit}
              setFromUnit={handleFromUnitChange}
              toUnit={toUnit}
              setToUnit={setToUnit}
              value={value}
              setValue={setValue}
              categories={CATEGORIES}
            />
            
            {hasResult && (
              <ResultCard 
                originalValue={value}
                originalUnitName={fromUnitDef!.name}
                originalUnitAbbr={fromUnitDef!.abbr}
                convertedValue={convertedValue}
                metricUnit={toUnitDef!.abbr} 
                conversionRate={conversionRate}
              />
            )}

            {/* Mobile Only: Show AI Context here so it flows after the result */}
            <div className="lg:hidden">
               {hasResult && <AIContextCard loading={aiLoading} data={aiData} error={aiError} />}
               {!hasResult && value === '' && (
                  <div className="bg-slate-800/50 border border-slate-700/50 border-dashed rounded-xl p-6 text-center text-slate-500 text-sm">
                    <p>Enter a value above or switch to Finder.</p>
                  </div>
               )}
            </div>
          </div>

          {/* RIGHT COLUMN (Finder / AI) 
              Visible if activeTab is 'finder' OR if we are on Desktop (lg)
          */}
          <div className={`space-y-6 lg:pl-4 ${activeTab === 'finder' ? 'block' : 'hidden lg:block'}`}>
             <SmartLookupCard 
                onLookup={handleSmartLookup} 
                loading={lookupLoading} 
                explanation={lookupExplanation}
             />

             {/* Desktop Only: Show AI Context here */}
             <div className="hidden lg:block">
                {(hasResult) ? (
                  <AIContextCard loading={aiLoading} data={aiData} error={aiError} />
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-800/30 rounded-xl border border-slate-800 text-slate-600 space-y-4 min-h-[200px]">
                      <div className="p-4 bg-slate-800 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-center text-sm max-w-[200px]">
                        Enter a measurement to see AI-powered comparisons and insights.
                      </p>
                    </div>
                )}
             </div>
             
             {/* Mobile Only Finder Hint */}
             <div className="lg:hidden text-center text-slate-500 text-xs px-4">
                <p>Use the Finder to search for object dimensions (e.g. "Height of Big Ben").</p>
             </div>
          </div>
        </main>
        
        <footer className="hidden lg:block pt-8 pb-4 text-center text-slate-600 text-xs md:text-sm">
           <p>Powered by React, Tailwind & Google Gemini Flash Lite</p>
        </footer>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-safe pt-2 lg:hidden z-50">
        <div className="flex justify-around items-center h-14">
          <button 
            onClick={() => setActiveTab('converter')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'converter' ? 'text-indigo-400' : 'text-slate-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-medium uppercase tracking-wide">Converter</span>
          </button>
          
          <div className="h-8 w-px bg-slate-800"></div>

          <button 
            onClick={() => setActiveTab('finder')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'finder' ? 'text-indigo-400' : 'text-slate-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[10px] font-medium uppercase tracking-wide">AI Finder</span>
          </button>
        </div>
      </nav>
    </div>
  );
}