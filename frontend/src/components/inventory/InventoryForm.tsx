'use client';

import { useState } from 'react';
import { HardDrive, Server, Plus, Loader2, Save } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import toast from 'react-hot-toast';

export function InventoryForm({ onSuccess }: { onSuccess?: () => void }) {
  const [ingestType, setIngestType] = useState<'project' | 'host'>('host');
  const [targetName, setTargetName] = useState('');
  const [technologies, setTechnologies] = useState([{ name: '', version: '', ecosystem: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTechnologyRow = () => {
    setTechnologies([...technologies, { name: '', version: '', ecosystem: '' }]);
  };

  const removeTechnologyRow = (index: number) => {
    if (technologies.length > 1) {
      setTechnologies(technologies.filter((_, i) => i !== index));
    }
  };

  const updateTechnology = (index: number, field: string, value: string) => {
    const updated = [...technologies];
    updated[index] = { ...updated[index], [field]: value };
    setTechnologies(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim()) {
      toast.error('Bitte einen Namen eingeben');
      return;
    }

    const validTechs = technologies.filter(t => t.name.trim() && t.version.trim());

    setIsSubmitting(true);
    try {
      if (ingestType === 'project') {
        await fetchApi('/ingest/sbom', {
          method: 'POST',
          body: JSON.stringify({
            projectName: targetName,
            dependencies: validTechs,
          }),
        });
      } else {
        await fetchApi('/ingest/host-software', {
          method: 'POST',
          body: JSON.stringify({
            hostname: targetName,
            software: validTechs,
          }),
        });
      }
      toast.success('Daten erfolgreich übermittelt!');
      setTargetName('');
      setTechnologies([{ name: '', version: '', ecosystem: '' }]);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Fehler beim Senden der Daten');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">Erfassungs-Typ wählen</label>
        <div className="flex gap-4">
          <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors flex-1 ${ingestType === 'project' ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
            <input type="radio" className="hidden" checked={ingestType === 'project'} onChange={() => setIngestType('project')} />
            <HardDrive className={`w-5 h-5 ${ingestType === 'project' ? 'text-blue-400' : 'text-slate-400'}`} />
            <span className={`font-medium ${ingestType === 'project' ? 'text-white' : 'text-slate-300'}`}>Applikation</span>
          </label>
          <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors flex-1 ${ingestType === 'host' ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
            <input type="radio" className="hidden" checked={ingestType === 'host'} onChange={() => setIngestType('host')} />
            <Server className={`w-5 h-5 ${ingestType === 'host' ? 'text-blue-400' : 'text-slate-400'}`} />
            <span className={`font-medium ${ingestType === 'host' ? 'text-white' : 'text-slate-300'}`}>Server / Host</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          {ingestType === 'project' ? 'Applikationsname' : 'Hostname'} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={targetName}
          onChange={(e) => setTargetName(e.target.value)}
          placeholder={ingestType === 'project' ? 'z.B. Docker Desktop oder Notepad++' : 'z.B. WIN-SRV-01 oder Linux Prod Server'}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <label className="block text-sm font-medium text-slate-300">
            Technologien / Dependencies (optional)
          </label>
        </div>

        <div className="space-y-3">
          {technologies.map((tech, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Name (z.B. React)"
                  value={tech.name}
                  onChange={(e) => updateTechnology(index, 'name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-1/3">
                <input
                  type="text"
                  placeholder="Version (z.B. 18.2.0)"
                  value={tech.version}
                  onChange={(e) => updateTechnology(index, 'version', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-1/4">
                <input
                  type="text"
                  placeholder="Ökosystem"
                  value={tech.ecosystem}
                  onChange={(e) => updateTechnology(index, 'ecosystem', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={() => removeTechnologyRow(index)}
                disabled={technologies.length === 1}
                className="p-2 text-slate-500 hover:text-red-400 disabled:opacity-30 transition-colors rounded border border-transparent hover:bg-slate-700"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addTechnologyRow}
          className="mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" /> Weitere Zeile hinzufügen
        </button>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Host / Applikation speichern
        </button>
      </div>
    </form>
  );
}
