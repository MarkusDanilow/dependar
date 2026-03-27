import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useGetProjects } from "@/hooks/useProjects";

const containerSchema = z.object({
  containerName: z.string().min(2, "Der Name muss mindestens 2 Zeichen lang sein."),
  projectId: z.string().uuid("Bitte wähle ein gültiges Projekt aus."),
});

export type ContainerFormData = z.infer<typeof containerSchema>;

interface ContainerFormProps {
  initialData?: any;
  onSubmit: (data: ContainerFormData) => void;
  isLoading: boolean;
}

export function ContainerForm({ initialData, onSubmit, isLoading }: ContainerFormProps) {
  const { data: projectsResponse } = useGetProjects();
  const projects = (projectsResponse as any)?.data || projectsResponse || [];

  const { register, handleSubmit, formState: { errors } } = useForm<ContainerFormData>({
    resolver: zodResolver(containerSchema),
    defaultValues: {
      containerName: initialData?.containerName || "",
      projectId: initialData?.projectId || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Container-Name *</label>
        <input 
          {...register("containerName")} 
          type="text"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" 
          placeholder="z.B. frontend-app" 
        />
        {errors.containerName && <p className="text-red-400 text-xs mt-1">{errors.containerName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Zugehöriges Projekt *</label>
        <select 
          {...register("projectId")} 
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">-- Projekt auswählen --</option>
          {projects.map((p: any) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {errors.projectId && <p className="text-red-400 text-xs mt-1">{errors.projectId.message}</p>}
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />} Speichern
        </button>
      </div>
    </form>
  );
}
