import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Trash2, AlertTriangle, Square, CheckSquare } from 'lucide-react';

interface VersionInfo {
  id: string;
  version: string;
}

interface VersionDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
  title: string;
  techName: string;
  versions: VersionInfo[];
  isDeleting?: boolean;
}

export function VersionDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  techName,
  versions,
  isDeleting = false
}: VersionDeleteModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(versions.map(v => v.id));
    }
  }, [isOpen, versions]);

  const toggleVersion = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === versions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(versions.map(v => v.id));
    }
  };

  const handleConfirm = () => {
    if (selectedIds.length > 0) {
      onConfirm(selectedIds);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-red-200 font-semibold mb-1">Achtung beim Löschen</p>
            <p className="text-red-400/80 leading-relaxed">
              Das Löschen von Technologien entfernt auch deren Verknüpfungen zu Containern und Hosts.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {versions.length} Versionen von {techName}
            </span>
            <button 
              onClick={toggleAll}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5"
            >
              {selectedIds.length === versions.length ? 'Alle abwählen' : 'Alle auswählen'}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            {versions.map((v) => (
              <label 
                key={v.id} 
                className="flex items-center justify-between p-3 border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors cursor-pointer group last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(v.id)}
                    onChange={() => toggleVersion(v.id)}
                    className="hidden"
                  />
                  {selectedIds.includes(v.id) ? (
                    <CheckSquare className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600 group-hover:text-slate-500" />
                  )}
                  <span className={`text-sm ${selectedIds.includes(v.id) ? 'text-white' : 'text-slate-400'}`}>
                    Version: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-violet-400 ml-1">{v.version}</code>
                  </span>
                </div>
                {selectedIds.includes(v.id) && (
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase font-bold tracking-tight">
                    Löschen
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            disabled={isDeleting}
            type="button"
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            Abbrechen
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting || selectedIds.length === 0}
            type="button"
            className="px-5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-red-900/20"
          >
            {isDeleting ? 'Lösche...' : (
              <>
                <Trash2 className="w-4 h-4" />
                {selectedIds.length === versions.length ? 'Alle löschen' : `${selectedIds.length} Versionen löschen`}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
