'use client';

import { useState, useMemo } from 'react';
import { Server, Loader2, Edit, Trash2, Plus, Box, Cpu, X, AlertCircle, HardDrive, Search } from 'lucide-react';
import { useGetHosts, useCreateHost, useUpdateHost, useDeleteHost, Host, useAddTechnologyToHost, useRemoveTechnologyFromHost, useAddProjectToHost, useRemoveProjectFromHost } from '@/hooks/useHosts';
import { useGetTechnologies, Technology } from '@/hooks/useTechnologies';
import { useGetProjects, useUpdateProject, useDeleteProject } from '@/hooks/useProjects';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { InventoryForm } from '@/components/inventory/InventoryForm';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

function HostForm({
  initialData,
  onSubmit,
  isLoading
}: {
  initialData?: Host | null,
  onSubmit: (data: Partial<Host>) => void,
  isLoading: boolean
}) {
  const [hostname, setHostname] = useState(initialData?.hostname || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ hostname });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Hostname <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={hostname}
          onChange={(e) => setHostname(e.target.value)}
          placeholder="z.B. WIN-SRV-01"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
          required
        />
      </div>
      <div className="flex justify-end pt-4 border-t border-slate-700">
        <button
          type="submit"
          disabled={isLoading || !hostname.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {initialData ? 'Aktualisieren' : 'Erstellen'}
        </button>
      </div>
    </form>
  );
}

function ProjectForm({
  initialData,
  onSubmit,
  isLoading
}: {
  initialData?: any | null,
  onSubmit: (data: any) => void,
  isLoading: boolean
}) {
  const [name, setName] = useState(initialData?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Applikationsname <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
          required
        />
      </div>
      <div className="flex justify-end pt-4 border-t border-slate-700">
        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Aktualisieren
        </button>
      </div>
    </form>
  );
}

export default function HostsPage() {
  const { data: hostsResponse, isLoading: isFetching } = useGetHosts();
  const hosts: Host[] = (hostsResponse as any)?.data || hostsResponse || [];

  const { data: techsResponse } = useGetTechnologies();
  const availableTechs: Technology[] = (techsResponse as any)?.data || techsResponse || [];

  const createHost = useCreateHost();
  const updateHost = useUpdateHost();
  const deleteHost = useDeleteHost();
  const addTech = useAddTechnologyToHost();
  const removeTech = useRemoveTechnologyFromHost();
  const addProjectToHost = useAddProjectToHost();
  const removeProjectFromHost = useRemoveProjectFromHost();

  const { data: projectsResponse } = useGetProjects();
  const availableProjects: any[] = (projectsResponse as any)?.data || projectsResponse || [];

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHost, setEditingHost] = useState<Host | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hostToDelete, setHostToDelete] = useState<Host | null>(null);

  const [isAddTechModalOpen, setIsAddTechModalOpen] = useState(false);
  const [hostToAddTo, setHostToAddTo] = useState<Host | null>(null);
  const [selectedTechId, setSelectedTechId] = useState("");

  const [isRemoveTechModalOpen, setIsRemoveTechModalOpen] = useState(false);
  const [techToRemove, setTechToRemove] = useState<{ hostId: string, technologyId: string, techName: string } | null>(null);

  const [isAddProjModalOpen, setIsAddProjModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [isRemoveProjModalOpen, setIsRemoveProjModalOpen] = useState(false);
  const [projToRemove, setProjToRemove] = useState<{ hostId: string, projectId: string, projName: string } | null>(null);

  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isProjEditModalOpen, setIsProjEditModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any | null>(null);
  const [isProjDeleteModalOpen, setIsProjDeleteModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredHosts = useMemo(() => {
    if (!searchQuery.trim()) return hosts;
    const lowSearch = searchQuery.toLowerCase();
    return hosts.filter(h => h.hostname.toLowerCase().includes(lowSearch));
  }, [hosts, searchQuery]);

  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return availableProjects;
    const lowSearch = searchQuery.toLowerCase();
    return availableProjects.filter(p => p.name.toLowerCase().includes(lowSearch));
  }, [availableProjects, searchQuery]);

  const handleOpenCreateModal = () => {
    setIsIngestModalOpen(true);
  };

  const handleOpenEditModal = (host: Host) => {
    setEditingHost(host);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (host: Host) => {
    setHostToDelete(host);
    setIsDeleteModalOpen(true);
  };

  const handleOpenAddTechModal = (host: Host) => {
    setHostToAddTo(host);
    setSelectedTechId("");
    setIsAddTechModalOpen(true);
  };

  const handleOpenAddProjModal = (host: Host) => {
    setHostToAddTo(host);
    setSelectedProjectId("");
    setIsAddProjModalOpen(true);
  };

  const handleSubmit = (data: Partial<Host>) => {
    if (editingHost) {
      updateHost.mutate({ id: editingHost.id, ...data }, {
        onSuccess: () => {
          toast.success("Host erfolgreich aktualisiert");
          setIsModalOpen(false);
        },
        onError: (error: any) => toast.error(error.message || "Fehler beim Aktualisieren")
      });
    } else {
      createHost.mutate(data, {
        onSuccess: () => {
          toast.success("Host erfolgreich erstellt");
          setIsModalOpen(false);
        },
        onError: (error: any) => toast.error(error.message || "Fehler beim Erstellen")
      });
    }
  };

  const handleConfirmDelete = () => {
    if (hostToDelete) {
      deleteHost.mutate(hostToDelete.id, {
        onSuccess: () => {
          toast.success("Host erfolgreich gelöscht");
          setIsDeleteModalOpen(false);
          setHostToDelete(null);
        },
        onError: (error: any) => toast.error(error.message || "Fehler beim Löschen")
      });
    }
  };

  const handleAddTechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hostToAddTo && selectedTechId) {
      addTech.mutate({ hostId: hostToAddTo.id, technologyId: selectedTechId }, {
        onSuccess: () => {
          toast.success("Technologie erfolgreich hinzugefügt");
          setIsAddTechModalOpen(false);
        },
        onError: (err: any) => toast.error(err.message || "Fehler beim Hinzufügen")
      });
    }
  };

  const handleOpenRemoveTechModal = (hostId: string, technologyId: string, techName: string) => {
    setTechToRemove({ hostId, technologyId, techName });
    setIsRemoveTechModalOpen(true);
  };

  const handleConfirmRemoveTech = () => {
    if (techToRemove) {
      removeTech.mutate(
        { hostId: techToRemove.hostId, technologyId: techToRemove.technologyId },
        {
          onSuccess: () => {
            toast.success("Technologie erfolgreich entfernt");
            setIsRemoveTechModalOpen(false);
            setTechToRemove(null);
          },
          onError: (err: any) => toast.error(err.message || "Fehler beim Entfernen")
        }
      );
    }
  };

  const handleAddProjSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hostToAddTo && selectedProjectId) {
      addProjectToHost.mutate({ hostId: hostToAddTo.id, projectId: selectedProjectId }, {
        onSuccess: () => {
          toast.success("Projekt erfolgreich zugewiesen");
          setIsAddProjModalOpen(false);
        },
        onError: (err: any) => toast.error(err.message || "Fehler bei Projektzuweisung")
      });
    }
  };

  const handleOpenRemoveProjModal = (hostId: string, projectId: string, projName: string) => {
    setProjToRemove({ hostId, projectId, projName });
    setIsRemoveProjModalOpen(true);
  };

  const handleConfirmRemoveProj = () => {
    if (projToRemove) {
      removeProjectFromHost.mutate(
        { hostId: projToRemove.hostId, projectId: projToRemove.projectId },
        {
          onSuccess: () => {
            toast.success("Projekt erfolgreich abgekoppelt");
            setIsRemoveProjModalOpen(false);
            setProjToRemove(null);
          },
          onError: (err: any) => toast.error(err.message || "Fehler beim Abkoppeln")
        }
      );
    }
  };

  const handleOpenEditProj = (p: any) => { setEditingProject(p); setIsProjEditModalOpen(true); };
  const handleOpenDeleteProj = (p: any) => { setProjectToDelete(p); setIsProjDeleteModalOpen(true); };

  const handleProjSubmit = (data: any) => {
    if (editingProject) {
      updateProject.mutate({ id: editingProject.id, ...data }, {
        onSuccess: () => { toast.success('Aktualisiert'); setIsProjEditModalOpen(false); },
        onError: (err: any) => toast.error(err.message)
      });
    }
  };

  const handleConfirmDeleteProj = () => {
    if (projectToDelete) {
      deleteProject.mutate(projectToDelete.id, {
        onSuccess: () => { toast.success('Gelöscht'); setIsProjDeleteModalOpen(false); setProjectToDelete(null); }
      });
    }
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
            <Server className="text-blue-500" /> Hosts / Applikationen
          </h1>
          <p className="text-slate-400 mt-1">Verwalte physische Server, virtuelle Maschinen, Applikatione und zugehörige Technologien.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Hosts/Apps suchen..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Host / Applikation hinzufügen
          </button>
        </div>
      </div>

      {hosts.length === 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center text-slate-500 shadow-xl">
          Noch keine Hosts vorhanden. Erstelle einen, um loszulegen.
        </div>
      ) : filteredHosts.length === 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center text-slate-500 shadow-xl">
          Keine Hosts für "{searchQuery}" gefunden.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredHosts.map((host) => (
            <div key={host.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl flex flex-col group hover:border-slate-600 transition-colors">

              {/* Header */}
              <div className="p-5 border-b border-slate-700/50 flex justify-between items-start bg-slate-800/50">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-blue-500 shadow-inner">
                      <Server className="w-4 h-4" />
                    </div>
                    {host.hostname}
                  </h3>
                  {/* Container count */}
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400 font-medium">
                    <Box className="w-3.5 h-3.5" />
                    <span>{host.containers?.length || 0} verknüpfte Container</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 transition-opacity ml-4">
                  <button
                    onClick={() => handleOpenEditModal(host)}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                    title="Bearbeiten"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(host)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    title="Löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tag Collections for Projects */}
              <div className="p-5 border-b border-slate-700/50 flex flex-col gap-3 bg-slate-900/10">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Erfasste Projekte</span>

                <div className="flex flex-wrap gap-2 items-center">
                  {host.projectHosts && host.projectHosts.map((ph: any) => {
                    const proj = ph.project;
                    if (!proj) return null;
                    return (
                      <div key={ph.id} className="group/tag flex items-center gap-1.5 border border-blue-500/30 bg-blue-500/10 text-blue-400 pl-2.5 pr-1 py-1 rounded-lg text-xs transition-colors shadow-sm hover:border-blue-500/50">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span className="font-semibold">{proj.name}</span>
                        <button
                          onClick={() => handleOpenRemoveProjModal(host.id, proj.id, proj.name)}
                          className="ml-1 p-0.5 rounded transition-colors text-blue-500 hover:text-red-400 hover:bg-red-500/10"
                          title="Entfernen"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => handleOpenAddProjModal(host)}
                    className="flex items-center gap-1.5 border border-dashed border-slate-600 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/10 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Hinzufügen
                  </button>
                </div>
              </div>

              {/* Tag Collections for Techs */}
              <div className="p-5 flex-1 flex flex-col gap-3 bg-slate-900/20">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Erfasste Technologien</span>

                <div className="flex flex-wrap gap-2 items-center">
                  {/* Nested Techs */}
                  {host.hostTechs && host.hostTechs.map((ht: any) => {
                    const tech = ht.technology;
                    if (!tech) return null;
                    const hasVulns = tech.vulnStates?.some((vs: any) => vs.status === 'OPEN' || vs.status === 'IN_PROGRESS');
                    return (
                      <div key={ht.id} className={`group/tag flex items-center gap-1.5 border pl-2.5 pr-1 py-1 rounded-lg text-xs transition-colors shadow-sm ${hasVulns
                        ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:border-red-500/50'
                        : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-violet-500/50'
                        }`}>
                        {hasVulns ? <AlertCircle className="w-3.5 h-3.5 text-red-500" /> : <Cpu className="w-3.5 h-3.5 text-violet-400" />}
                        <span className="font-semibold">{tech.name}</span>
                        <span className={`border-l pl-1.5 ml-0.5 max-w-[100px] truncate ${hasVulns ? 'border-red-500/30 text-red-500/50' : 'border-slate-600 text-slate-500'}`}>v{tech.version}</span>
                        <button
                          onClick={() => handleOpenRemoveTechModal(host.id, tech.id, tech.name)}
                          className={`ml-1 p-0.5 rounded transition-colors ${hasVulns ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                            }`}
                          title="Entfernen"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => handleOpenAddTechModal(host)}
                    className="flex items-center gap-1.5 border border-dashed border-slate-600 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/10 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Hinzufügen
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEW SECTION: PROJECTS / APPLICATIONS */}
      <div className="mt-16">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
          <HardDrive className="text-indigo-500" /> Applikationen (Projekte)
        </h2>
        {availableProjects.length === 0 ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center text-slate-500 shadow-xl">
            Noch keine Applikationen vorhanden.
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center text-slate-500 shadow-xl">
            Keine Applikationen für "{searchQuery}" gefunden.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredApps.map((proj: any) => (
              <div key={proj.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl flex flex-col group hover:border-slate-600 transition-colors">
                <div className="p-5 border-b border-slate-700/50 flex justify-between items-start bg-slate-800/50">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-indigo-500 shadow-inner">
                        <HardDrive className="w-4 h-4" />
                      </div>
                      {proj.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400 font-medium">
                      <Box className="w-3.5 h-3.5" />
                      <span>{proj.containers?.length || 0} verknüpfte Container</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 transition-opacity ml-4">
                    <button onClick={() => handleOpenEditProj(proj)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition-colors" title="Bearbeiten"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleOpenDeleteProj(proj)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Löschen"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Host bearbeiten"
      >
        <HostForm
          initialData={editingHost}
          onSubmit={handleSubmit}
          isLoading={updateHost.isPending}
        />
      </Modal>

      <Modal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        title="Neuen Bestand (Host oder Projekt) erfassen"
      >
        <InventoryForm onSuccess={() => {
          setIsIngestModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['hosts'] });
          queryClient.invalidateQueries({ queryKey: ['projects'] });
        }} />
      </Modal>

      <Modal
        isOpen={isAddTechModalOpen}
        onClose={() => setIsAddTechModalOpen(false)}
        title="Technologie hinzufügen"
      >
        <form onSubmit={handleAddTechSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Auswählbare Technologien</label>
            <select
              value={selectedTechId}
              onChange={e => setSelectedTechId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">-- Technologie auswählen --</option>
              {availableTechs.map(t => (
                <option key={t.id} value={t.id}>{t.name} (v{t.version || 'latest'})</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={addTech.isPending || !selectedTechId} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
              {addTech.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Hinzufügen
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAddProjModalOpen}
        onClose={() => setIsAddProjModalOpen(false)}
        title="Projekt hinzufügen"
      >
        <form onSubmit={handleAddProjSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Auswählbare Projekte</label>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">-- Projekt auswählen --</option>
              {availableProjects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={addProjectToHost.isPending || !selectedProjectId} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
              {addProjectToHost.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Zuweisen
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Host löschen"
        message={`Bist du sicher, dass du den Host ${hostToDelete?.hostname} löschen möchtest? Dies entfernt alle Zuweisungen.`}
        isDeleting={deleteHost.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isRemoveTechModalOpen}
        onClose={() => setIsRemoveTechModalOpen(false)}
        onConfirm={handleConfirmRemoveTech}
        title="Technologie entfernen"
        message={`Möchtest du '${techToRemove?.techName}' wirklich von diesem Host entfernen?`}
        isDeleting={removeTech.isPending}
      />
      <ConfirmDeleteModal
        isOpen={isRemoveProjModalOpen}
        onClose={() => setIsRemoveProjModalOpen(false)}
        onConfirm={handleConfirmRemoveProj}
        title="Projekt abkoppeln"
        message={`Möchtest du das Projekt '${projToRemove?.projName}' wirklich von diesem Host entfernen?`}
        isDeleting={removeProjectFromHost.isPending}
      />

      <Modal
        isOpen={isProjEditModalOpen}
        onClose={() => setIsProjEditModalOpen(false)}
        title="Applikation bearbeiten"
      >
        <ProjectForm
          initialData={editingProject}
          onSubmit={handleProjSubmit}
          isLoading={updateProject.isPending}
        />
      </Modal>

      <ConfirmDeleteModal
        isOpen={isProjDeleteModalOpen}
        onClose={() => setIsProjDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteProj}
        title="Applikation löschen"
        message={`Bist du sicher, dass du die Applikation ${projectToDelete?.name} löschen möchtest? Alle Sub-Ressourcen gehen verloren.`}
        isDeleting={deleteProject.isPending}
      />
    </div>
  );
}
