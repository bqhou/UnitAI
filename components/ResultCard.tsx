import React from 'react';

interface ResultCardProps {
  originalValue: number;
  originalUnitName: string;
  originalUnitAbbr: string;
  convertedValue: number;
  metricUnit: string; // Acts as target unit abbr
  conversionRate: number; // The value of 1 source unit in target units
}

export const ResultCard: React.FC<ResultCardProps> = ({
  originalValue,
  originalUnitAbbr,
  convertedValue,
  metricUnit,
  conversionRate
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 4,
      minimumFractionDigits: 0
    }).format(num);
  };

  const formatRate = (num: number) => {
    // Show more precision for rates
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 3
    }).format(num);
  }

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-4 md:p-6 shadow-lg text-white relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-indigo-200 text-xs md:text-sm font-medium uppercase tracking-wider mb-1">Result</h3>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl md:text-5xl font-bold tracking-tight">
            {formatNumber(convertedValue)}
          </span>
          <span className="text-xl md:text-2xl font-medium text-indigo-200">{metricUnit}</span>
        </div>
        <div className="mt-3 md:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-white/10 pt-2 md:pt-3">
            <div className="text-indigo-200 text-xs md:text-sm">
             {formatNumber(originalValue)} {originalUnitAbbr} = {formatNumber(convertedValue)} {metricUnit}
            </div>
            <div className="text-[10px] md:text-xs font-mono bg-black/20 px-2 py-1 rounded text-indigo-100 w-fit">
               1 {originalUnitAbbr} ≈ {formatRate(conversionRate)} {metricUnit}
            </div>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-indigo-900 opacity-20 rounded-full blur-3xl"></div>
    </div>
  );
};