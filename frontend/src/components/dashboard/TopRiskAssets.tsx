'use client';

import { Trophy, TrendingUp } from 'lucide-react';

interface Asset {
  name: string;
  score: number;
  vulns: number;
  type: string;
}

interface Props {
  risks?: Asset[];
}

const defaultRisks = [
  { name: 'Portal API', score: 92, vulns: 24, type: 'Projekt' },
  { name: 'Auth Gateway', score: 85, vulns: 12, type: 'Projekt' },
  { name: 'SRV-01', score: 78, vulns: 8, type: 'Host' },
];

export function TopRiskAssets({ risks = defaultRisks }: Props) {
  return (
    <section 
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col shadow-lg hover:border-slate-700 transition-colors"
      aria-labelledby="risk-assets-title"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 id="risk-assets-title" className="text-[13px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <Trophy className="w-5 h-5 text-red-500" aria-hidden="true" />
          Höchste Risikowerte
        </h3>
        <TrendingUp className="w-5 h-5 text-slate-500" aria-hidden="true" />
      </div>

      <div className="space-y-6 flex-1">
        {risks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[12px] text-slate-500 italic text-center">
            Keine kritischen Assets gefunden.
          </div>
        ) : (
          risks.map((asset, i) => (
            <div key={i} className="flex flex-col gap-3" aria-label={`${asset.type}: ${asset.name} mit Risiko-Score ${asset.score} und ${asset.vulns} Schwachstellen`}>
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-black text-slate-100">{asset.name}</span>
                  <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest">{asset.type}</span>
                </div>
                <div className="text-right">
                  <span className="text-[12px] font-black text-red-400 uppercase tracking-widest">{asset.vulns} CVEs</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-950 border border-white/5 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.3)] transition-all duration-1000" 
                  style={{ width: `${Math.min(asset.score, 100)}%` }}
                  role="progressbar"
                  aria-valuenow={asset.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>

    </section>
  );
}
