'use client';

import { useState } from 'react';
import { Plus, Trash2, Loader2, Link2, Globe, FileJson, Rss, Edit } from 'lucide-react';
import { useGetScanSources, useCreateScanSource, useUpdateScanSource, useDeleteScanSource, SecurityScanSource } from '@/hooks/useScanSources';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import toast from 'react-hot-toast';

export default function ScanSourcesPage() {
  const { data: sourcesResponse, isLoading } = useGetScanSources();
  const sources: SecurityScanSource[] = (sourcesResponse as any)?.data || sourcesResponse || [];
  
  const createSource = useCreateScanSource();
  const updateSource = useUpdateScanSource();
  const deleteSource = useDeleteScanSource();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<SecurityScanSource | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState<SecurityScanSource | null>(null);

  const [formData, setFormData] = useState({ name: '', url: '', type: 'JSON', isActive: true });

  const handleOpenCreate = () => {
    setEditingSource(null);
    setFormData({ name: '', url: '', type: 'JSON', isActive: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (source: SecurityScanSource) => {
    setEditingSource(source);
    setFormData({ name: source.name, url: source.url, type: source.type, isActive: source.isActive });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (source: SecurityScanSource) => {
    setSourceToDelete(source);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.url.trim()) return;

    if (editingSource) {
      updateSource.mutate({ id: editingSource.id, ...formData }, {
        onSuccess: () => {
          toast.success('Quelle aktualisiert');
          setIsModalOpen(false);
        },
        onError: (err: any) => toast.error(err.message || 'Fehler beim Aktualisieren')
      });
    } else {
      createSource.mutate(formData, {
        onSuccess: () => {
          toast.success('Quelle erstellt');
          setIsModalOpen(false);
        },
        onError: (err: any) => toast.error(err.message || 'Fehler beim Erstellen')
      });
    }
  };

  const confirmDelete = () => {
    if (!sourceToDelete) return;
    deleteSource.mutate(sourceToDelete.id, {
      onSuccess: () => {
        toast.success('Quelle gelöscht');
        setIsDeleteModalOpen(false);
        setSourceToDelete(null);
      },
      onError: (err: any) => toast.error(err.message || 'Fehler beim Löschen')
    });
  };

  const toggleIsActive = (source: SecurityScanSource) => {
    updateSource.mutate({ id: source.id, isActive: !source.isActive }, {
      onSuccess: () => toast.success(`Quelle ${!source.isActive ? 'aktiviert' : 'deaktiviert'}`),
      onError: (err: any) => toast.error(err.message || 'Fehler beim Ändern des Status')
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'JSON': return <FileJson className="w-5 h-5 text-yellow-500" />;
      case 'RSS': return <Rss className="w-5 h-5 text-orange-500" />;
      case 'WEBSITE': return <Globe className="w-5 h-5 text-blue-500" />;
      default: return <Link2 className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-end items-end gap-4">
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" /> Quelle hinzufügen
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">URL</th>
                <th className="px-6 py-4">Typ</th>
                <th className="px-6 py-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : sources.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Keine Scan-Quellen konfiguriert.
                  </td>
                </tr>
              ) : (
                sources.map((source) => (
                  <tr key={source.id} className={`hover:bg-slate-700/50 transition-colors ${!source.isActive ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleIsActive(source)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${source.isActive ? 'bg-blue-500' : 'bg-slate-600'}`}
                      >
                        <span className={`inline-block w-3.5 h-3.5 transform rounded-full bg-white transition-transform ${source.isActive ? 'translate-x-4' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-200">{source.name}</td>
                    <td className="px-6 py-4 text-slate-400 truncate max-w-xs md:max-w-md">
                      <a href={source.url} target="_blank" rel="noreferrer" className="hover:text-blue-400 hover:underline">
                        {source.url}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-md w-fit">
                        {getTypeIcon(source.type)}
                        <span className="text-xs font-bold text-slate-300">{source.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(source)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                          title="Bearbeiten"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(source)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Löschen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSource ? 'Quelle bearbeiten' : 'Neue Quelle anlegen'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="z.B. GitHub Advisory Database"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">URL <span className="text-red-500">*</span></label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://api.github.com/advisories"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Typ</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="JSON">JSON API</option>
                <option value="XML">XML Feed</option>
                <option value="RSS">RSS Feed</option>
                <option value="WEBSITE">Webseite (Scraping)</option>
              </select>
            </div>
            <div className="flex flex-col justify-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 bg-slate-900 border-slate-700"
                />
                <span className="text-sm font-medium text-slate-300">Aktiviert</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={createSource.isPending || updateSource.isPending}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              {(createSource.isPending || updateSource.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingSource ? 'Speichern' : 'Hinzufügen'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Scan-Quelle löschen"
        message={`Möchtest du die Quelle '${sourceToDelete?.name}' wirklich löschen?`}
        isDeleting={deleteSource.isPending}
      />
    </div>
  );
}
