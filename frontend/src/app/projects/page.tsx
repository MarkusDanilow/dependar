'use client';

import { useState } from 'react';
import { HardDrive, Loader2, Edit, Trash2, Plus, Box, Cpu, X, AlertCircle } from 'lucide-react';
import { useGetProjects, useCreateProject, useUpdateProject, useDeleteProject, Project } from '@/hooks/useProjects';
import { useGetContainers, useUpdateContainer } from '@/hooks/useContainers';
import { ProjectForm, ProjectFormData } from '@/components/forms/ProjectForm';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const { data: projectsResponse, isLoading: isFetching } = useGetProjects();
  const projects: Project[] = (projectsResponse as any)?.data || projectsResponse || [];

  const { data: containersResponse } = useGetContainers();
  const allContainers = (containersResponse as any)?.data || containersResponse || [];

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const updateContainer = useUpdateContainer();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [isAddContainerModalOpen, setIsAddContainerModalOpen] = useState(false);
  const [projectToAddTo, setProjectToAddTo] = useState<Project | null>(null);
  const [selectedContainerId, setSelectedContainerId] = useState("");

  const [isRemoveContainerModalOpen, setIsRemoveContainerModalOpen] = useState(false);
  const [containerToRemove, setContainerToRemove] = useState<any>(null);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleOpenAddContainerModal = (project: Project) => {
    setProjectToAddTo(project);
    setSelectedContainerId("");
    setIsAddContainerModalOpen(true);
  };

  const handleOpenRemoveContainerModal = (container: any) => {
    setContainerToRemove(container);
    setIsRemoveContainerModalOpen(true);
  };

  const handleSubmit = (data: ProjectFormData) => {
    if (editingProject) {
      updateProject.mutate(
        { id: editingProject.id, ...data },
        {
          onSuccess: () => {
            toast.success("Projekt erfolgreich aktualisiert");
            setIsModalOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.message || "Fehler beim Aktualisieren");
          },
        }
      );
    } else {
      createProject.mutate(
        data as Partial<Project>,
        {
          onSuccess: () => {
            toast.success("Projekt erfolgreich erstellt");
            setIsModalOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.message || "Fehler beim Erstellen");
          },
        }
      );
    }
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject.mutate(projectToDelete.id, {
        onSuccess: () => {
          toast.success("Projekt erfolgreich gelöscht");
          setIsDeleteModalOpen(false);
          setProjectToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error.message || "Fehler beim Löschen");
        },
      });
    }
  };

  const handleAddContainerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectToAddTo && selectedContainerId) {
      updateContainer.mutate({ id: selectedContainerId, projectId: projectToAddTo.id }, {
        onSuccess: () => {
          toast.success("Container erfolgreich dem Projekt zugewiesen");
          setIsAddContainerModalOpen(false);
        },
        onError: (err: any) => toast.error(err.message || "Fehler beim Zuweisen")
      });
    }
  };

  const handleConfirmRemoveContainer = () => {
    if (containerToRemove) {
      updateContainer.mutate({ id: containerToRemove.id, projectId: null }, {
        onSuccess: () => {
          toast.success("Container erfolgreich aus dem Projekt entfernt");
          setIsRemoveContainerModalOpen(false);
          setContainerToRemove(null);
        },
        onError: (err: any) => toast.error(err.message || "Fehler beim Entfernen")
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

  const availableContainers = allContainers.filter((c: any) => c.projectId !== projectToAddTo?.id);

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HardDrive className="text-blue-500" /> Projekte
          </h1>
          <p className="text-slate-400 mt-1">Verwalte logische Projekte und sieh dir die zugewiesenen Container und Technologien an.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" /> Projekt hinzufügen
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center text-slate-500 shadow-xl">
          Noch keine Projekte vorhanden. Erstelle eines, um loszulegen.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl flex flex-col group">
              
              {/* Header */}
              <div className="p-5 border-b border-slate-700/50 flex justify-between items-start bg-slate-800/50">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-blue-500 shadow-inner">
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-slate-400 mt-2 line-clamp-2">{project.description}</p>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <button
                    onClick={() => handleOpenEditModal(project)}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(project)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tag Collections for Containers & Techs */}
              <div className="p-5 flex-1 flex flex-col gap-4 bg-slate-900/20">
                {(project.containers?.length || 0) > 0 ? (
                  project.containers?.map((container: any) => (
                    <div key={container.id} className="group/container bg-slate-900/80 rounded-lg p-3 border border-slate-700/50 shadow-inner transition-colors hover:border-emerald-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Box className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-semibold text-slate-200">{container.containerName}</span>
                        </div>
                        <button 
                          onClick={() => handleOpenRemoveContainerModal(container)}
                          className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover/container:opacity-100"
                          title="Container aus Projekt entfernen"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {/* Nested Techs */}
                      {container.techs?.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {container.techs.map((ct: any) => {
                            const tech = ct.technology;
                            if (!tech) return null;
                            const hasVulns = tech.vulnStates?.some((vs: any) => vs.status === 'OPEN' || vs.status === 'IN_PROGRESS');
                            return (
                              <div key={ct.id} className={`flex items-center gap-1.5 border px-2.5 py-1 rounded text-xs transition-colors ${
                                hasVulns 
                                  ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                                  : 'bg-slate-800 border-slate-600 text-slate-300'
                              }`}>
                                {hasVulns ? <AlertCircle className="w-3 h-3 text-red-500" /> : <Cpu className="w-3 h-3 text-violet-400" />}
                                <span>{tech.name}</span>
                                <span className={hasVulns ? 'text-red-500/50' : 'text-slate-500'}>v{tech.version}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic mt-1">Keine Technologien gefunden.</p>
                      )}
                    </div>
                  ))
                ) : (
                   <p className="text-sm text-slate-500 italic text-center py-4">Diesem Projekt sind noch keine Container zugewiesen.</p>
                )}
                
                <button 
                  onClick={() => handleOpenAddContainerModal(project)}
                  className="mt-2 flex items-center justify-center gap-2 w-full py-2 border border-dashed border-slate-600 text-slate-400 hover:text-blue-400 hover:border-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Container hinzufügen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Projekt bearbeiten" : "Neues Projekt anlegen"}
      >
        <ProjectForm
          initialData={editingProject}
          onSubmit={handleSubmit}
          isLoading={createProject.isPending || updateProject.isPending}
        />
      </Modal>

      <Modal
        isOpen={isAddContainerModalOpen}
        onClose={() => setIsAddContainerModalOpen(false)}
        title="Container zu Projekt hinzufügen"
      >
        <form onSubmit={handleAddContainerSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Auswählbare Container</label>
            <select 
              value={selectedContainerId}
              onChange={e => setSelectedContainerId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">-- Container auswählen --</option>
              {availableContainers.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.containerName} {c.project ? `(aktuell in: ${c.project.name})` : '(Nicht zugewiesen)'}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-2">
              Ein Container kann nur einem Projekt gleichzeitig zugewiesen sein. Wenn der Container bereits einem anderen Projekt gehört, wird er dorthin verschoben.
            </p>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={updateContainer.isPending || !selectedContainerId} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
              {updateContainer.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Hinzufügen
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={isRemoveContainerModalOpen}
        onClose={() => setIsRemoveContainerModalOpen(false)}
        onConfirm={handleConfirmRemoveContainer}
        title="Container aus Projekt entfernen"
        message={`Möchtest du den Container '${containerToRemove?.containerName}' wirklich aus diesem Projekt entfernen? Er wird nicht gelöscht, er verliert nur die Projektzuordnung.`}
        isDeleting={updateContainer.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Projekt löschen"
        message={`Bist du sicher, dass du das Projekt ${projectToDelete?.name} löschen möchtest? Zugehörige Container könnten verwaisen.`}
        isDeleting={deleteProject.isPending}
      />
    </div>
  );
}
