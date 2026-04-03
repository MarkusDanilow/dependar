import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { Technology } from './useTechnologies';
import { Container } from './useContainers';

export interface HostTech {
  id: string;
  hostId: string;
  technologyId: string;
  source: string;
  technology: Technology;
}

export interface ProjectHost {
  id: string;
  hostId: string;
  projectId: string;
  project: {
    id: string;
    name: string;
    description: string | null;
  };
}

export interface Host {
  id: string;
  hostname: string;
  containers?: Container[];
  hostTechs?: HostTech[];
  projectHosts?: ProjectHost[];
}

export const useGetHosts = () => {
  return useQuery({
    queryKey: ['hosts'],
    queryFn: () => fetchApi('/hosts'),
  });
};

export const useCreateHost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Host>) =>
      fetchApi('/hosts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
    },
  });
};

export const useUpdateHost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Host> & { id: string }) =>
      fetchApi(`/hosts/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
    },
  });
};

export const useDeleteHost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/hosts/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
    },
  });
};

export const useAddTechnologyToHost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ hostId, technologyId }: { hostId: string; technologyId: string }) =>
      fetchApi(`/hosts/${hostId}/technologies`, {
        method: 'POST',
        body: JSON.stringify({ technologyId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
    },
  });
};

export const useRemoveTechnologyFromHost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ hostId, technologyId }: { hostId: string; technologyId: string }) =>
      fetchApi(`/hosts/${hostId}/technologies/${technologyId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
    },
  });
};

export const useAddProjectToHost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ hostId, projectId }: { hostId: string; projectId: string }) =>
      fetchApi(`/hosts/${hostId}/projects`, {
        method: 'POST',
        body: JSON.stringify({ projectId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useRemoveProjectFromHost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ hostId, projectId }: { hostId: string; projectId: string }) =>
      fetchApi(`/hosts/${hostId}/projects/${projectId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
