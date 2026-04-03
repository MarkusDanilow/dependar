'use client';

import { Box, HelpCircle } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  count: number;
}

export function EolTechCard({ count = 0 }: Props) {
  return (
    <article 
      className={`bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col justify-between shadow-lg transition-all border-l-[6px] ${count > 0 ? 'border-l-orange-500 hover:border-orange-500/40' : 'border-l-blue-500 hover:border-blue-500/40'}`}
      aria-labelledby="eol-title"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id="eol-title" className="text-[13px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <Box className={`w-5 h-5 ${count > 0 ? 'text-orange-500' : 'text-blue-500'}`} aria-hidden="true" />
          End-of-Life Tech
          <InfoTooltip 
            text="Veraltete Software-Versionen, die kein Sicherheits-Update mehr erhalten und somit ein permanentes Risiko darstellen." 
            calculation="Prüft die installierte Version gegen bekannte Support-Zeiträume (z.B. Node.js < 18, React < 17)."
            position="bottom"
          />
        </h3>
        <HelpCircle className="w-4 h-4 text-slate-500 hover:text-slate-300 cursor-help transition-colors" aria-label="Hilfe anzeigen" />
      </div>

      <div className="mt-6 flex items-end gap-3" aria-label={`Anzahl EoL-Versionen: ${count}`}>
        <span className="text-5xl font-black text-white leading-none drop-shadow-sm">{count}</span>
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-black text-slate-300 uppercase tracking-widest">EoL Versionen</span>
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Im Stack entdeckt</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-widest font-black pt-4 border-t border-slate-800/60">
        <span>Risiko: {count > 0 ? 'Hoch' : 'Keines'}</span>
        <span className={`px-2 py-1 rounded-full text-[10px] border tracking-wider ${count > 0 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
          {count > 0 ? 'PATCH NÖTIG' : 'AKTUELL'}
        </span>
      </div>
    </article>
  );
}
