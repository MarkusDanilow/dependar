'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Activity, ShieldAlert, Shield, ShieldCheck, Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/analytics/metrics')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  const stats = data?.stats || { total: 0, critical: 0, high: 0, medium: 0, low: 0 };
  const getWidth = (val: number) => stats.total ? `${(val / stats.total) * 100}%` : '0%';

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Activity className="text-blue-500" /> Security Analytics</h1>
        <p className="text-slate-400 mt-1">Real-time vulnerability metrics across all indexed containers.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-slate-400 text-sm mb-2 font-medium">Total CVEs</div>
          <div className="text-4xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-red-500/30 shadow-lg shadow-red-500/5">
          <div className="text-red-400 text-sm flex items-center gap-1 mb-2 font-medium"><ShieldAlert className="w-4 h-4" /> Critical</div>
          <div className="text-4xl font-bold text-red-500">{stats.critical}</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-amber-500/30 shadow-lg shadow-amber-500/5">
          <div className="text-amber-400 text-sm flex items-center gap-1 mb-2 font-medium"><Shield className="w-4 h-4" /> High</div>
          <div className="text-4xl font-bold text-amber-500">{stats.high}</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/5">
          <div className="text-blue-400 text-sm flex items-center gap-1 mb-2 font-medium"><ShieldCheck className="w-4 h-4" /> Moderate</div>
          <div className="text-4xl font-bold text-blue-500">{stats.medium}</div>
        </div>
      </div>

      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-6">Risk Distribution Engine</h2>
        <div className="h-6 flex rounded-md overflow-hidden bg-slate-900 border border-slate-700/50 shadow-inner">
          <div className="bg-red-500 transition-all duration-1000 ease-in-out" style={{ width: getWidth(stats.critical) }} />
          <div className="bg-amber-500 transition-all duration-1000 ease-in-out" style={{ width: getWidth(stats.high) }} />
          <div className="bg-blue-500 transition-all duration-1000 ease-in-out" style={{ width: getWidth(stats.medium) }} />
          <div className="bg-emerald-500 transition-all duration-1000 ease-in-out" style={{ width: getWidth(stats.low) }} />
        </div>
        <div className="flex gap-6 mt-4 text-sm font-medium text-slate-400">
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500 shadow-sm"></div> Critical ({(stats.critical / (stats.total || 1) * 100).toFixed(1)}%)</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500 shadow-sm"></div> High</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500 shadow-sm"></div> Medium</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500 shadow-sm"></div> Low</span>
        </div>
      </div>
    </div>
  );
}
