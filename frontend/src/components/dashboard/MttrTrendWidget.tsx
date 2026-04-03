'use client';

import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Timer, ArrowUpRight } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  avgDays: number;
  data?: any[];
}

const mockMttr = [
  { day: 'Mo', mttr: 12 },
  { day: 'Di', mttr: 11 },
  { day: 'Mi', mttr: 9 },
  { day: 'Do', mttr: 10 },
  { day: 'Fr', mttr: 8 },
  { day: 'Sa', mttr: 8 },
  { day: 'So', mttr: 8 },
];

export function MttrTrendWidget({ avgDays = 8, data = mockMttr }: Props) {
  return (
    <article 
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col justify-between shadow-lg hover:border-slate-700 transition-colors"
      aria-labelledby="mttr-title"
    >
      <div className="flex items-center justify-between">
        <h3 id="mttr-title" className="text-[13px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <Timer className="w-5 h-5 text-emerald-500" aria-hidden="true" />
          MTTR Speed
          <InfoTooltip 
            text="Die 'Mean Time To Remediate' misst die Geschwindigkeit deines Teams bei der Behebung von Sicherheitslücken." 
            calculation="Durchschnittliche Dauer in Tagen von der Entdeckung einer Lücke (Created) bis zum Status 'Erledigt' (Resolved)."
            position="bottom"
          />
        </h3>
        <span className="flex items-center gap-1.5 text-[11px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
          <ArrowUpRight className="w-3.5 h-3.5" />
          Optimal
        </span>
      </div>

      <div className="flex items-center gap-6 mt-6" aria-label={`Durchschnittliche Behebungszeit: ${avgDays.toFixed(1)} Tage`}>
         <div className="flex flex-col">
            <span className="text-4xl font-black text-white leading-none drop-shadow-sm">{avgDays.toFixed(1)}</span>
            <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-2">Ø Tage</span>
         </div>
         <div className="flex-1 h-14" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMttr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="mttr" 
                  stroke="#10B981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorMttr)" 
                />
              </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      <p className="text-[11px] text-slate-500 mt-4 text-center uppercase tracking-[0.2em] font-bold">
        Besser als <span className="text-slate-300">Benchmark (9.2d)</span>
      </p>
    </article>
  );
}
