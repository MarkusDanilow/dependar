'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Cpu, Loader2, Edit, Trash2, Plus } from 'lucide-react';

export default function TechnologiesPage() {
  const [techs, setTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/technologies')
      .then(res => setTechs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) => {
    if(confirm('Are you sure you want to remove this dependency?')) {
      setTechs(prev => prev.filter(t => t.id !== id));
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Cpu className="text-violet-500" /> Dependencies & Technologies</h1>
          <p className="text-slate-400 mt-1">Found software, frameworks and runtimes across the infrastructure.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg">
          <Plus className="w-4 h-4" /> Add Dependency
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <tr>
              <th className="px-6 py-4">Technology Name</th>
              <th className="px-6 py-4">Version Range</th>
              <th className="px-6 py-4">Vulnerabilities</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {techs.map(tech => (
              <tr key={tech.id} className="hover:bg-slate-700/50 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-blue-500 shadow-inner">
                      {tech.name.charAt(0).toUpperCase()}
                    </div>
                    {tech.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-slate-900 px-3 py-1 rounded text-slate-400 font-mono text-xs border border-slate-700 shadow-inner">{tech.version || 'latest'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${tech.vulnStates?.length > 0 ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                    {tech.vulnStates?.length || 0} Open CVEs
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-slate-400 hover:text-blue-400 transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(tech.id)} className="text-slate-400 hover:text-red-400 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {techs.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No technologies discovered yet. Install the Webhook or Agent.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
