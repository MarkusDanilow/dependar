'use client';

import { useState } from 'react';
import { ShieldAlert, Loader2, CheckCircle2, Clock, AlertCircle, Filter, Search, ChevronRight, Info } from 'lucide-react';
import { useGetVulnStates, useUpdateVulnStatus, VulnState } from '@/hooks/useVulnerabilities';
import toast from 'react-hot-toast';

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Offen',
  IN_PROGRESS: 'In Arbeit',
  RESOLVED: 'Erledigt',
  IGNORED: 'Ignoriert'
};

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: 'text-red-600 bg-red-500/10 border-red-500/20',
  HIGH: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  MEDIUM: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  LOW: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
};

export default function VulnerabilitiesPage() {
  const { data: vulnStates, isLoading } = useGetVulnStates();
  const updateStatus = useUpdateVulnStatus();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredStates = (vulnStates || []).filter(state => {
    const matchesSearch = 
      state.technology.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.vulnerability.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || state.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatus.mutate({ id, status: newStatus }, {
      onSuccess: () => {
        toast.success("Status erfolgreich aktualisiert");
      },
      onError: (err: any) => {
        toast.error(err.message || "Fehler beim Aktualisieren");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-red-500" /> Sicherheitslücken & CVEs
          </h1>
          <p className="text-slate-400 mt-1">Überwache und verwalte die Sicherheitszustände deiner Technologien.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Suchen..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Alle Status</option>
            <option value="OPEN">Offen</option>
            <option value="IN_PROGRESS">In Arbeit</option>
            <option value="RESOLVED">Erledigt</option>
            <option value="IGNORED">Ignoriert</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredStates.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center text-slate-500">
            Keine Sicherheitslücken gefunden.
          </div>
        ) : (
          filteredStates.map((state) => (
            <div key={state.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg group hover:border-slate-600 transition-all">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg border ${SEVERITY_COLORS[state.vulnerability.baseSeverity] || 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors uppercase">{state.vulnerability.id}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${SEVERITY_COLORS[state.vulnerability.baseSeverity]}`}>
                        {state.vulnerability.baseSeverity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      In <span className="text-violet-400 font-medium">{state.technology.name}</span> ({state.technology.version})
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        Range: {state.vulnerability.vulnerableRange}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 justify-center min-w-[200px]">
                  <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700 shadow-inner">
                    {[ 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'IGNORED' ].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(state.id, s)}
                        disabled={updateStatus.isPending || state.status === s}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          state.status === s 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    {state.status === 'OPEN' && <span className="text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Handlungsbedarf</span>}
                    {state.status === 'IN_PROGRESS' && <span className="text-orange-500 flex items-center gap-1"><Clock className="w-3 h-3" /> In Bearbeitung</span>}
                    {state.status === 'RESOLVED' && <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Gelöst</span>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
