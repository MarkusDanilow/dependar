'use client';

import { ShieldAlert, Clock, ChevronRight } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  count: number;
}

export function SlaBreachesWidget({ count = 0 }: Props) {
  return (
    <article 
      className={`bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col justify-between shadow-lg transition-all border-l-[6px] ${count > 0 ? 'border-l-red-500 hover:border-red-500/40' : 'border-l-emerald-500 hover:border-emerald-500/40'}`}
      aria-labelledby="sla-title"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id="sla-title" className="text-[13px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert className={`w-5 h-5 ${count > 0 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} aria-hidden="true" />
          SLA-Verletzungen
          <InfoTooltip 
            text="Zeigt an, wie viele kritische Probleme gegen die internen Zeitvorgaben verstoßen." 
            calculation="Gezählt werden alle kritischen Schwachstellen, die bereits länger als 14 Tage als 'offen' markiert sind."
            position="bottom"
          />
        </h3>
        <span 
          className={`text-[11px] font-black px-3 py-1 rounded-full tracking-widest uppercase ${count > 0 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}
        >
          {count > 0 ? 'ABGELAUFEN' : 'DURCHGEHEND'}
        </span>
      </div>

      <div className="mt-6 flex items-end gap-4" aria-label={`Anzahl SLA-Verletzungen: ${count} kritische CVEs`}>
        <span className="text-5xl font-black text-white leading-none drop-shadow-sm">{count}</span>
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-black text-slate-300 uppercase tracking-widest">Kritische CVEs</span>
          <span className="text-[11px] text-slate-500 font-bold tracking-wide uppercase">Alter &gt; 14 Tage</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-widest font-black pt-4 border-t border-slate-800/60">
        <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Risiko: {count > 0 ? 'Hoch' : 'Keines'}</span>
        <button 
          className="text-blue-400 hover:text-white transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 group"
          aria-label="Alle SLA-Verletzungen anzeigen"
        >
          Details <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </article>
  );
}
