'use client';

import { useState } from 'react';
import { Key, Plus, Trash2, Loader2, Copy, Check } from 'lucide-react';
import { useGetApiKeys, useCreateApiKey, useDeleteApiKey } from '@/hooks/useApiKeys';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function ApiKeysPage() {
  const { data: keysResponse, isLoading } = useGetApiKeys();
  const keys = (keysResponse as any)?.data || keysResponse || [];
  const createKey = useCreateApiKey();
  const deleteKey = useDeleteApiKey();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKeyData, setCreatedKeyData] = useState<{ name: string; keyPlaintext: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    createKey.mutate(newKeyName, {
      onSuccess: (response: any) => {
        const data = response.data || response;
        setCreatedKeyData({ name: newKeyName, keyPlaintext: data.keyPlaintext });
        setNewKeyName('');
        toast.success('API Key generiert');
      },
      onError: (err: any) => {
        toast.error(err.message || 'Fehler beim Erstellen');
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Wirklich API Key "${name}" löschen?`)) {
      deleteKey.mutate(id, {
        onSuccess: () => toast.success('API Key gelöscht'),
        onError: (err: any) => toast.error(err.message || 'Fehler beim Löschen')
      });
    }
  };

  const copyToClipboard = () => {
    if (createdKeyData?.keyPlaintext) {
      navigator.clipboard.writeText(createdKeyData.keyPlaintext);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreatedKeyData(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-end items-start md:items-end gap-4">
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" /> Key generieren
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Erstellt</th>
              <th className="px-6 py-4">Zuletzt genutzt</th>
              <th className="px-6 py-4 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                </td>
              </tr>
            ) : keys.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  Keine API Keys vorhanden. Erstelle einen, um anzufangen.
                </td>
              </tr>
            ) : (
              keys.map((key: any) => (
                <tr key={key.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{key.name}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(key.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Nie genutzt'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(key.id, key.name)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Revoke Key"
                      disabled={deleteKey.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal} title="Neuen API Key generieren">
        {!createdKeyData ? (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Name des Keys <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="z.B. GitLab Pipeline, Windows Server"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={closeCreateModal}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={createKey.isPending || !newKeyName.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {createKey.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Generieren
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-lg text-sm">
              <p className="font-medium mb-1">Wichtig: Bitte kopiere diesen Key jetzt!</p>
              <p>Dieser Token wird dir aus Sicherheitsgründen nie wieder im Klartext angezeigt.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-700 p-3 flex items-center justify-between rounded-lg">
              <code className="text-green-400 font-mono text-sm break-all select-all">
                {createdKeyData.keyPlaintext}
              </code>
              <button 
                onClick={copyToClipboard}
                className="ml-3 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors flex-shrink-0"
                title="Kopieren"
              >
                {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={closeCreateModal}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
