'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

interface Props {
  text: string;
  calculation?: string;
  position?: 'top' | 'bottom';
}

export function InfoTooltip({ text, calculation, position = 'top' }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = position === 'top' 
    ? 'bottom-full mb-4' 
    : 'top-full mt-4';

  const arrowClasses = position === 'top' 
    ? 'top-full border-t-[#1e293b]' 
    : 'bottom-full border-b-[#1e293b]';

  return (
    <div className="relative inline-block ml-1.5 group">
      <Info 
        className="w-4 h-4 text-slate-500 hover:text-blue-400 cursor-help transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />
      
      {isVisible && (
        <div className={`absolute z-[9999] left-1/2 -translate-x-1/2 w-80 p-5 bg-[#1e293b] border border-slate-700/60 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 backdrop-blur-xl ${positionClasses}`}>
          <p className="text-sm text-white leading-normal font-black uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
            Details zur Metrik
          </p>
          <p className="text-[13px] text-slate-300 leading-relaxed font-bold">
            {text}
          </p>
          {calculation && (
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Berechnungs-Logik:</p>
              <div className="text-[10px] text-blue-400 font-medium italic leading-relaxed">
                {calculation}
              </div>
            </div>
          )}
          {/* Arrow */}
          <div className={`absolute left-1/2 -translate-x-1/2 border-8 border-transparent ${arrowClasses}`}></div>
        </div>
      )}
    </div>
  );
}
