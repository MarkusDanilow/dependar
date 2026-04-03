'use client';

import { Activity, ShieldAlert, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { useGetVulnStates } from '@/hooks/useVulnerabilities';
import { useState } from 'react';

export function SecurityFeed() {
  const { data: vulcanData, isLoading } = useGetVulnStates();
  const [filter, setFilter] = useState<'all' | 'critical' | 'sla'>('all');
  
  const allVulns = ((vulcanData as any)?.data || vulcanData || [])
    .filter((v: any) => v.status === 'OPEN' || v.status === 'IN_PROGRESS')
    .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const vulns = allVulns.filter((v: any) => {
    if (filter === 'all') return true;
    const severity = v.aiInsight?.adjustedSeverity || v.vulnerability?.baseSeverity || 'MEDIUM';
    if (filter === 'critical') return severity === 'CRITICAL';
    if (filter === 'sla') {
        const ageInDays = (Date.now() - new Date(v.createdAt || 0).getTime()) / (1000 * 60 * 60 * 24);
        return severity === 'CRITICAL' && ageInDays > 14;
    }
    return true;
  }).slice(0, 15);

  if (isLoading) {
    return (
      <div className="w-85 h-full bg-[#0F172A]/80 backdrop-blur-xl border-l border-white/10 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <section className="w-85 h-full bg-[#0F172A]/80 backdrop-blur-xl border-l border-white/10 flex flex-col shadow-[inset_1px_0_0_rgba(255,255,255,0.05)]" aria-labelledby="feed-title">
      <header className="p-8 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-6">
          <h2 id="feed-title" className="text-[14px] font-black text-slate-200 flex items-center gap-2 uppercase tracking-widest">
            <Activity className="w-5 h-5 text-blue-500" aria-hidden="true" />
            Sicherheits-Log
          </h2>
          <span className="bg-emerald-500/10 text-emerald-500 text-[11px] font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
            Echtzeit
          </span>
        </div>
        
        <nav className="flex gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-white/10" aria-label="Log Filter">
          {[
            { id: 'all', label: 'Alle' },
            { id: 'critical', label: 'Kritisch' },
            { id: 'sla', label: 'SLA' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              aria-pressed={filter === t.id}
              className={`flex-1 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                filter === t.id ? 'bg-slate-800 text-white shadow-xl translate-y-[-1px]' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6" role="log" aria-live="polite">
        {vulns.length === 0 ? (
          <div className="text-center py-16">
            <ShieldCheck className="w-14 h-14 text-emerald-500/20 mx-auto mb-4" aria-hidden="true" />
            <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest italic">Keine aktiven Bedrohungen gefunden.</p>
          </div>
        ) : (
          vulns.map((item: any) => {
            const getSev = (v: any) => v.aiInsight?.adjustedSeverity || v.vulnerability?.baseSeverity || 'MEDIUM';
            const severity = getSev(item);
            const techName = item.technology?.name || 'Unknown Tech';
            const cveId = item.vulnerability?.id || 'Unknown CVE';

            return (
              <article key={item.id} className="relative group p-[1px] rounded-2xl bg-gradient-to-br from-slate-700/50 to-transparent hover:from-blue-500/30 transition-all duration-500 shadow-lg" aria-label={`${severity} Schwachstelle: ${cveId} in ${techName}`}>
                <div className="bg-[#1E293B]/90 backdrop-blur-md rounded-[15px] p-5 h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2.5">
                      {severity === 'CRITICAL' && <ShieldAlert className="w-5 h-5 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" />}
                      {severity === 'HIGH' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                      {severity === 'MEDIUM' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                      {severity === 'LOW' && <ShieldCheck className="w-5 h-5 text-blue-500" />}
                      <span className="text-[12px] font-black font-mono text-slate-100 tracking-tight">{cveId}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest bg-slate-950/50 px-2.5 py-1 rounded-full border border-white/5">
                      {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: de }) : 'jetzt'}
                    </span>
                  </div>
                  
                  <div className="mb-5 space-y-2">
                    <div className="text-[12px] text-slate-400 font-black uppercase tracking-wider">
                      Ziel: <span className="text-blue-400 font-black ml-1">{techName}</span>
                    </div>
                  </div>

                  <div className="bg-black/50 p-3.5 rounded-xl border border-white/10 text-[12px] text-slate-300 leading-relaxed shadow-inner">
                    <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest mr-3">Status:</span> 
                    {item.status === 'OPEN' ? 'Offen' : item.status === 'IN_PROGRESS' ? 'In Arbeit' : item.status}
                  </div>
                </div>
              </article>
            )
          })
        )}

        <div className="text-center pt-8 pb-4">
          <p className="text-[11px] text-slate-600 font-black tracking-widest uppercase italic">Ende des Logs</p>
        </div>
      </div>
    </section>
  );
}
