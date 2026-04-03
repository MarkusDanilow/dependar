'use client';

import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { ShieldCheck } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  score: number;
}

export function SecurityPostureScore({ score = 72 }: Props) {
  const data = [{ value: score, fill: score > 80 ? '#10B981' : score > 50 ? '#EAB308' : '#EF4444' }];

  return (
    <article 
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col justify-between shadow-lg hover:border-slate-700 transition-all group"
      aria-labelledby="posture-title"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 id="posture-title" className="text-[13px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-500" aria-hidden="true" />
          Sicherheitsstatus
          <InfoTooltip 
            text="Die Gesamtbewertung deiner IT-Security. Ein hoher Wert bedeutet eine sichere und gut gepatchte Umgebung." 
            calculation="Startet bei 100 Punkten. Pro Schwachstelle gibt es Punktabzüge basierend auf der Kritikalität (Kritisch: 12, Hoch: 6, Mittel: 2)."
            position="bottom"
          />
        </h3>
        <span className="text-[11px] font-black text-slate-400 bg-slate-400/10 px-3 py-1 rounded-full uppercase tracking-widest">
          Aktuell
        </span>
      </div>

      <div className="flex items-center justify-center h-32 relative mt-4" aria-label={`Sicherheitswert: ${score.toFixed(0)} von 100 Punkten`}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" cy="50%" 
            innerRadius="80%" outerRadius="100%" 
            barSize={12} 
            data={data} 
            startAngle={90} endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background dataKey="value" cornerRadius={6} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white drop-shadow-sm">{score.toFixed(0)}</span>
          <span className="text-[12px] text-slate-400 font-black uppercase tracking-widest mt-1">Punkte</span>
        </div>
      </div>

      <p className="text-[12px] text-slate-400 mt-4 text-center uppercase tracking-[0.2em] font-bold">
        <span className={score > 80 ? 'text-emerald-400' : score > 50 ? 'text-yellow-400' : 'text-red-400'}>
          {score > 80 ? 'Optimal' : score > 50 ? 'Handlungsbedarf' : 'Kritisch'}
        </span>
      </p>
    </article>
  );
}
