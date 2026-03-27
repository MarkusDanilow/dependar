'use client';

import { useState } from 'react';
import { Box, Loader2, Edit, Trash2, Plus, HardDrive, Cpu, X, AlertCircle } from 'lucide-react';
import { 
  useGetContainers, 
  useCreateContainer, 
  useUpdateContainer, 
  useDeleteContainer,
  useAddTechnologyToContainer,
  useRemoveTechnologyFromContainer,
  Container 
} from '@/hooks/useContainers';
import { useGetTechnologies, Technology } from '@/hooks/useTechnologies';
import { ContainerForm, ContainerFormData } from '@/components/forms/ContainerForm';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import toast from 'react-hot-toast';

export default function ContainersPage() {
  const { data: containersResponse, isLoading: isFetching } = useGetContainers();
  const containers: Container[] = (containersResponse as any)?.data || containersResponse || [];

  const { data: techsResponse } = useGetTechnologies();
  const availableTechs: Technology[] = (techsResponse as any)?.data || techsResponse || [];

  const createContainer = useCreateContainer();
  const updateContainer = useUpdateContainer();
  const deleteContainer = useDeleteContainer();
  const addTech = useAddTechnologyToContainer();
  const removeTech = useRemoveTechnologyFromContainer();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [containerToDelete, setContainerToDelete] = useState<Container | null>(null);

  const [isAddTechModalOpen, setIsAddTechModalOpen] = useState(false);
  const [containerToAddTo, setContainerToAddTo] = useState<Container | null>(null);
  const [selectedTechId, setSelectedTechId] = useState("");

  const [isRemoveTechModalOpen, setIsRemoveTechModalOpen] = useState(false);
  const [techToRemove, setTechToRemove] = useState<{ containerId: string, technologyId: string, techName: string } | null>(null);

  const handleOpenCreateModal = () => {
    setEditingContainer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (container: Container) => {
    setEditingContainer(container);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (container: Container) => {
    setContainerToDelete(container);
    setIsDeleteModalOpen(true);
  };

  const handleOpenAddTechModal = (container: Container) => {
    setContainerToAddTo(container);
    setSelectedTechId("");
    setIsAddTechModalOpen(true);
  };

  const handleSubmit = (data: ContainerFormData) => {
    if (editingContainer) {
      updateContainer.mutate(
        { id: editingContainer.id, ...data },
        {
          onSuccess: () => {
            toast.success("Container erfolgreich aktualisiert");
            setIsModalOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.message || "Fehler beim Aktualisieren");
          },
        }
      );
    } else {
      createContainer.mutate(
        data as Partial<Container>,
        {
          onSuccess: () => {
            toast.success("Container erfolgreich erstellt");
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
    if (containerToDelete) {
      deleteContainer.mutate(containerToDelete.id, {
        onSuccess: () => {
          toast.success("Container erfolgreich gelöscht");
          setIsDeleteModalOpen(false);
          setContainerToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error.message || "Fehler beim Löschen");
        },
      });
    }
  };

  const handleAddTechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(containerToAddTo && selectedTechId) {
      addTech.mutate({ containerId: containerToAddTo.id, technologyId: selectedTechId }, {
        onSuccess: () => {
          toast.success("Technologie erfolgreich hinzugefügt");
          setIsAddTechModalOpen(false);
        },
        onError: (err: any) => toast.error(err.message || "Fehler beim Hinzufügen")
      });
    }
  };

  const handleOpenRemoveTechModal = (containerId: string, technologyId: string, techName: string) => {
    setTechToRemove({ containerId, technologyId, techName });
    setIsRemoveTechModalOpen(true);
  };

  const handleConfirmRemoveTech = () => {
    if (techToRemove) {
      removeTech.mutate(
        { containerId: techToRemove.containerId, technologyId: techToRemove.technologyId },
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

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Box className="text-emerald-500" /> Container
          </h1>
          <p className="text-slate-400 mt-1">Verwalte einzelne Anwendungsinstanzen und deren zugrunde liegende Technologien.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" /> Container hinzufügen
        </button>
      </div>

      {containers.length === 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center text-slate-500 shadow-xl">
          Noch keine Container vorhanden. Erstelle einen, um loszulegen.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {containers.map((container) => (
            <div key={container.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl flex flex-col group hover:border-slate-600 transition-colors">
              
              {/* Header */}
              <div className="p-5 border-b border-slate-700/50 flex justify-between items-start bg-slate-800/50">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-emerald-500 shadow-inner">
                      <Box className="w-4 h-4" />
                    </div>
                    {container.containerName}
                  </h3>
                   {/* Parent Project Tag */}
                   {container.project ? (
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-blue-400 font-medium bg-blue-500/10 w-fit px-2 py-1 rounded border border-blue-500/20">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>{container.project.name}</span>
                    </div>
                   ) : (
                     <div className="text-xs text-slate-500 italic mt-3">Projekt nicht zugewiesen</div>
                   )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <button
                    onClick={() => handleOpenEditModal(container)}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(container)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tag Collections for Techs */}
              <div className="p-5 flex-1 flex flex-col gap-3 bg-slate-900/20">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Installierte Technologien</span>
                
                <div className="flex flex-wrap gap-2 items-center">
                  {/* Nested Techs */}
                  {container.techs && container.techs.map((ct: any) => {
                    const tech = ct.technology;
                    if (!tech) return null;
                    const hasVulns = tech.vulnStates?.some((vs: any) => vs.status === 'OPEN' || vs.status === 'IN_PROGRESS');
                    return (
                      <div key={ct.id} className={`group/tag flex items-center gap-1.5 border pl-2.5 pr-1 py-1 rounded-lg text-xs transition-colors shadow-sm ${
                        hasVulns 
                          ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:border-red-500/50' 
                          : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-violet-500/50'
                      }`}>
                        {hasVulns ? <AlertCircle className="w-3.5 h-3.5 text-red-500" /> : <Cpu className="w-3.5 h-3.5 text-violet-400" />}
                        <span className="font-semibold">{tech.name}</span>
                        <span className={`border-l pl-1.5 ml-0.5 max-w-[100px] truncate ${hasVulns ? 'border-red-500/30 text-red-500/50' : 'border-slate-600 text-slate-500'}`}>v{tech.version}</span>
                        <button 
                          onClick={() => handleOpenRemoveTechModal(container.id, tech.id, tech.name)}
                          className={`ml-1 p-0.5 rounded transition-colors opacity-0 group-hover/tag:opacity-100 ${
                            hasVulns ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                          }`}
                          title="Entfernen"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}

                  <button 
                    onClick={() => handleOpenAddTechModal(container)}
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

      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingContainer ? "Container bearbeiten" : "Neuen Container anlegen"}
      >
        <ContainerForm
          initialData={editingContainer}
          onSubmit={handleSubmit}
          isLoading={createContainer.isPending || updateContainer.isPending}
        />
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

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Container löschen"
        message={`Bist du sicher, dass du den Container ${containerToDelete?.containerName} löschen möchtest? Zugehörige Abhängigkeiten werden beeinflusst.`}
        isDeleting={deleteContainer.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isRemoveTechModalOpen}
        onClose={() => setIsRemoveTechModalOpen(false)}
        onConfirm={handleConfirmRemoveTech}
        title="Technologie entfernen"
        message={`Möchtest du die Technologie '${techToRemove?.techName}' wirklich aus diesem Container entfernen?`}
        isDeleting={removeTech.isPending}
      />
    </div>
  );
}
