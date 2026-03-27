"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Technology } from "@/hooks/useTechnologies";

const technologySchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  version: z.string().optional(),
});

export type TechnologyFormData = z.infer<typeof technologySchema>;

interface TechnologyFormProps {
  initialData?: Technology | null;
  onSubmit: (data: TechnologyFormData) => void;
  isLoading?: boolean;
}

export function TechnologyForm({ initialData, onSubmit, isLoading }: TechnologyFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: initialData?.name || "",
      version: initialData?.version || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        version: initialData.version || "",
      });
    } else {
      reset({
        name: "",
        version: "",
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Name *
        </label>
        <input
          {...register("name")}
          type="text"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="z. B. Node.js"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Version (optional)
        </label>
        <input
          {...register("version")}
          type="text"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="z. B. 18.17.0"
        />
        {errors.version && (
          <p className="mt-1 text-sm text-red-500">{errors.version.message}</p>
        )}
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Speichere..." : "Speichern"}
        </button>
      </div>
    </form>
  );
}
