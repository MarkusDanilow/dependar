'use client';

import { useState, useMemo } from 'react';
import { Cpu, Loader2, Edit, Trash2, Plus, Search, ArrowUpDown, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { useGetTechnologies, useCreateTechnology, useUpdateTechnology, useDeleteTechnology, Technology } from '@/hooks/useTechnologies';
import { TechnologyForm, TechnologyFormData } from '@/components/forms/TechnologyForm';
import { Modal } from '@/components/ui/Modal';
import { VersionDeleteModal } from '@/components/technologies/VersionDeleteModal';
import toast from 'react-hot-toast';

interface GroupedTech {
  name: string;
  versions: { id: string; version: string }[];
  totalVulns: number;
  instances: Technology[];
}

export default function TechnologiesPage() {
  const { data: techsResponse, isLoading: isFetching } = useGetTechnologies();
  const techs: Technology[] = (techsResponse as any)?.data || techsResponse || [];

  const createTech = useCreateTechnology();
  const updateTech = useUpdateTechnology();
  const deleteTech = useDeleteTechnology();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<"name" | "versions" | "vulns">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupedTech | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Reset pagination on search
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<GroupedTech | null>(null);

  const handleSort = (column: "name" | "versions" | "vulns") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const processedTechs = useMemo(() => {
    const groupedTechsMap = new Map<string, GroupedTech>();

    techs.forEach(tech => {
      const key = tech.name.toLowerCase();
      if (!groupedTechsMap.has(key)) {
        groupedTechsMap.set(key, {
          name: tech.name,
          versions: [{ id: tech.id, version: tech.version || 'latest' }],
          totalVulns: (tech.vulnStates || []).filter((vs: any) => vs.status === 'OPEN' || vs.status === 'IN_PROGRESS').length,
          instances: [tech],
        });
      } else {
        const group = groupedTechsMap.get(key)!;
        // avoid duplicate version tags if they exactly match
        if (!group.versions.some(v => v.version === (tech.version || 'latest'))) {
          group.versions.push({ id: tech.id, version: tech.version || 'latest' });
        }
        group.totalVulns += (tech.vulnStates || []).filter((vs: any) => vs.status === 'OPEN' || vs.status === 'IN_PROGRESS').length;
        group.instances.push(tech);
      }
    });

    let groupedTechsList = Array.from(groupedTechsMap.values());

    if (searchQuery.trim() !== '') {
      groupedTechsList = groupedTechsList.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.versions.some(v => v.version.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    groupedTechsList.sort((a, b) => {
      let comparison = 0;
      if (sortColumn === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortColumn === 'versions') {
        comparison = a.versions.length - b.versions.length;
      } else if (sortColumn === 'vulns') {
        comparison = a.totalVulns - b.totalVulns;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return groupedTechsList;
  }, [techs, searchQuery, sortColumn, sortDirection]);

  const totalPages = Math.ceil(processedTechs.length / pageSize);
  const slicedTechs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedTechs.slice(start, start + pageSize);
  }, [processedTechs, currentPage, pageSize]);

  const handleOpenCreateModal = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (group: GroupedTech) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (group: GroupedTech) => {
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (data: TechnologyFormData) => {
    if (editingGroup) {
      // Edit updates the main/first instance found or creates a specific new version logic if we wanted to
      // Here we just update the first one mapped to the original form
      const instanceToUpdate = editingGroup.instances[0];
      updateTech.mutate(
        { id: instanceToUpdate.id, ...data },
        {
          onSuccess: () => {
            toast.success("Technologie erfolgreich aktualisiert");
            setIsModalOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.message || "Fehler beim Aktualisieren");
          },
        }
      );
    } else {
      createTech.mutate(
        data as Partial<Technology>,
        {
          onSuccess: () => {
            toast.success("Technologie erfolgreich erstellt");
            setIsModalOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.message || "Fehler beim Erstellen");
          },
        }
      );
    }
  };

  const handleConfirmDelete = async (selectedIds: string[]) => {
    if (groupToDelete && selectedIds.length > 0) {
      const deletePromises = selectedIds.map(id => deleteTech.mutateAsync(id));
      
      try {
        await Promise.all(deletePromises);
        toast.success(`${selectedIds.length} Version(en) von ${groupToDelete.name} erfolgreich gelöscht`);
        setIsDeleteModalOpen(false);
        setGroupToDelete(null);
      } catch (error: any) {
        toast.error(error.message || "Fehler beim Löschen einer oder mehrerer Instanzen");
      }
    }
  };

  const SortIcon = ({ column }: { column: "name" | "versions" | "vulns" }) => {
    if (sortColumn !== column) return <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-50 ml-2" />;
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-3 h-3 text-blue-400 ml-2" /> 
      : <ChevronDown className="w-3 h-3 text-blue-400 ml-2" />;
  };

  if (isFetching) {
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
            <Cpu className="text-violet-500" /> Abhängigkeiten & Technologien
          </h1>
          <p className="text-slate-400 mt-1">Gefundene Software, Frameworks und Laufzeiten in der Infrastruktur.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Technologien suchen..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Abhängigkeit hinzufügen
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center">Technologie-Name <SortIcon column="name" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => handleSort('versions')}>
                  <div className="flex items-center">Versionen <SortIcon column="versions" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => handleSort('vulns')}>
                  <div className="flex items-center">Schwachstellen <SortIcon column="vulns" /></div>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {slicedTechs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Keine passenden Technologien gefunden.
                  </td>
                </tr>
              ) : (
                slicedTechs.map((group) => (
                  <tr key={group.name} className="hover:bg-slate-700/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-violet-500 shadow-inner">
                          {group.name.charAt(0).toUpperCase()}
                        </div>
                        {group.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {/* Version Tags */}
                      <div className="flex items-center flex-wrap gap-2">
                        {group.versions.map(v => (
                          <div key={v.id} className="bg-slate-900 px-2.5 py-1 rounded text-slate-300 font-mono text-xs border border-slate-700 shadow-inner flex items-center gap-2">
                            {v.version}
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-500/50"></div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm inline-flex items-center gap-1.5 ${
                          group.totalVulns > 0
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {group.totalVulns > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                        {group.totalVulns === 0 && <Check className="w-3 h-3" />}
                        {group.totalVulns} offene CVEs
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleOpenEditModal(group)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                          title="Bearbeiten"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(group)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Alle Versionen löschen"
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-slate-900/50 px-6 py-4 border-t border-slate-700/50 flex items-center justify-between">
            <div className="text-[13px] text-slate-500 font-bold uppercase tracking-wider">
              Seite {currentPage} von {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-700 disabled:opacity-30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Zurück
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  if (totalPages > 5 && Math.abs(p - currentPage) > 1 && p !== 1 && p !== totalPages) {
                    if (p === 2 || p === totalPages - 1) return <span key={p} className="text-slate-600 px-1">...</span>;
                    return null;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        currentPage === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-700 disabled:opacity-30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Weiter
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGroup ? "Technologie bearbeiten" : "Neue Technologie anlegen"}
      >
        <TechnologyForm
          initialData={editingGroup ? editingGroup.instances[0] : null}
          onSubmit={handleSubmit}
          isLoading={createTech.isPending || updateTech.isPending}
        />
      </Modal>

      <VersionDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Technologie / Versionen löschen"
        techName={groupToDelete?.name || ''}
        versions={groupToDelete?.versions || []}
        isDeleting={deleteTech.isPending}
      />
    </div>
  );
}
