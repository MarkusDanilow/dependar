import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';

export interface Container {
  id: string;
  containerName: string;
  projectId?: string | null;
  hostId?: string;
  project?: any;
  techs?: any[];
}

export const useGetContainers = () => {
  return useQuery<Container[]>({
    queryKey: ['containers'],
    queryFn: () => fetchApi('/containers'),
  });
};

export const useCreateContainer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Container>) =>
      fetchApi('/containers', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateContainer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Container> & { id: string }) =>
      fetchApi(`/containers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteContainer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchApi(`/containers/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useAddTechnologyToContainer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ containerId, technologyId }: { containerId: string, technologyId: string }) =>
      fetchApi(`/containers/${containerId}/technologies`, { method: 'POST', body: JSON.stringify({ technologyId }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['containers'] }),
  });
};

export const useRemoveTechnologyFromContainer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ containerId, technologyId }: { containerId: string, technologyId: string }) =>
      fetchApi(`/containers/${containerId}/technologies/${technologyId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['containers'] }),
  });
};
