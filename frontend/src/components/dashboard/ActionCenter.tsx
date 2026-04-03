'use client';

import { Zap, ArrowUpCircle, ShieldAlert } from 'lucide-react';

interface ActionItem {
  id: string | number;
  title: string;
  subtitle: string;
  severity: string;
}

interface Props {
  actions?: ActionItem[];
}

const defaultActions = [
  { id: 1, title: 'Upgrade Express in portal-api', subtitle: 'Behebt 2 High CVEs', severity: 'HIGH' },
  { id: 2, title: 'Patch Docker auf Host SRV-01', subtitle: 'SLA-Verletzung droht', severity: 'CRITICAL' },
  { id: 3, title: 'PG Port (5432) einschränken', subtitle: 'Richtlinien-Verstoß', severity: 'MEDIUM' },
];

export function ActionCenter({ actions = defaultActions }: Props) {
  return (
    <section 
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col shadow-lg hover:border-slate-700 transition-colors"
      aria-labelledby="action-center-title"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 id="action-center-title" className="text-[13px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          Handlungszentrum
        </h3>
        <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
          {actions.length} Offen
        </span>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {actions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[12px] text-slate-500 italic text-center">
            Keine dringenden Maßnahmen nötig.
          </div>
        ) : (
          actions.map((action, i) => (
            <article 
              key={i} 
              className="group p-4 bg-slate-950 border border-slate-800/50 rounded-xl hover:border-blue-500/40 transition-all flex items-center justify-between gap-6 shadow-sm"
              aria-label={`Maßnahme: ${action.title}. ${action.subtitle}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${
                  action.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                  action.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  <ShieldAlert className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[13px] font-black text-slate-100">{action.title}</p>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">{action.subtitle}</p>
                </div>
              </div>
              <button 
                className="p-2 text-blue-500 hover:text-white transition-all bg-blue-500/10 hover:bg-blue-600 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={`${action.title} jetzt beheben`}
              >
                 <ArrowUpCircle className="w-5 h-5" />
              </button>
            </article>
          ))
        )}
      </div>

    </section>
  );
}
