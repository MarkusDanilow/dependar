'use client';

import { Settings, Save, Loader2, ShieldCheck, Mail } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Settings className="text-slate-400" /> Systemeinstellungen</h1>
        <p className="text-slate-400 mt-1">Konfiguriere globale Einstellungen, Benachrichtigungen und Telemetrie-Agenten.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-700 bg-slate-900/50">
            <h2 className="font-semibold text-white flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Sicherheits-Engine</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium">Automatisierte Triage</h3>
                <p className="text-xs text-slate-400">Ignoriert risikoarme CVEs ohne Benachrichtigung.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium">Tägliche CVE-Synchronisierung</h3>
                <p className="text-xs text-slate-400">Startet Hintergrundprozesse zum Abgleich lokaler Versionen mit der NVD-Datenbank.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-700 bg-slate-900/50">
            <h2 className="font-semibold text-white flex items-center gap-2"><Mail className="w-4 h-4 text-blue-500" /> E-Mail-Benachrichtigungen</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium">Warnungen bei kritischen Schwachstellen</h3>
                <p className="text-xs text-slate-400">Verschickt sofort E-Mails an Administratoren, wenn eine CVSS 9.0+ CVE gefunden wird.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Einstellungen speichern
          </button>
        </div>
      </form>
    </div>
  );
}
