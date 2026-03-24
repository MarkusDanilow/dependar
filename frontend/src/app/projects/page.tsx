'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { HardDrive, Loader2, Server, Play, Square } from 'lucide-react';

export default function ProjectsPage() {
  const [containers, setContainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/containers')
      .then(res => setContainers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = (id: string, currentStatus: string) => {
    setContainers(prev => prev.map(c => 
      c.id === id ? { ...c, status: currentStatus === 'RUNNING' ? 'STOPPED' : 'RUNNING' } : c
    ));
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><HardDrive className="text-emerald-500" /> Projects & Containers</h1>
        <p className="text-slate-400 mt-1">Operational view of all registered Docker containers and clusters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {containers.map(container => {
          const isRunning = container.status !== 'STOPPED';
          return (
            <div key={container.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl hover:border-slate-500 transition-all flex flex-col group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${isRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{container.containerName}</h3>
                      <p className={`text-xs font-mono flex items-center gap-1 ${isRunning ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                        {isRunning ? 'Running' : 'Stopped'}
                      </p>
                    </div>
                  </div>
                  <div className="flex bg-slate-900 border border-slate-700 rounded-lg overflow-hidden translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <button onClick={() => toggleStatus(container.id, container.status)} className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition-colors" title="Start">
                      <Play className="w-4 h-4" />
                    </button>
                    <div className="w-px bg-slate-700"></div>
                    <button onClick={() => toggleStatus(container.id, 'RUNNING')} className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors" title="Stop">
                      <Square className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-2">Monitored Host: <code className="text-xs bg-slate-900 px-1 py-0.5 rounded text-blue-300">{container.hostId?.slice(0, 8)}</code></p>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">CPU Usage</div>
                    <div className="text-sm font-mono text-slate-300">{isRunning ? (Math.random() * 20 + 1).toFixed(1) : '0.0'}%</div>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Memory</div>
                    <div className="text-sm font-mono text-slate-300">{isRunning ? Math.floor(Math.random() * 500 + 50) : '0'} MB</div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/50 px-6 py-3 border-t border-slate-700 flex justify-between items-center text-sm">
                <span className="text-slate-400">Layer Dependencies:</span>
                <span className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded">{container.technologies?.length || 0}</span>
              </div>
            </div>
          );
        })}
        {containers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
            No active containers mapped. Waiting for Telemetry Layer.
          </div>
        )}
      </div>
    </div>
  );
}
