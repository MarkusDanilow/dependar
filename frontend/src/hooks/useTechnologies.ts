import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';

export interface Technology {
  id: string;
  name: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  vulnStates?: any[];
}

export const useGetTechnologies = () => {
  return useQuery<Technology[]>({
    queryKey: ['technologies'],
    queryFn: () => fetchApi('/technologies'),
  });
};

export const useCreateTechnology = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Technology>) => 
      fetchApi('/technologies', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technologies'] });
    },
  });
};

export const useUpdateTechnology = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Technology> & { id: string }) => 
      fetchApi(`/technologies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technologies'] });
    },
  });
};

export const useDeleteTechnology = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => 
      fetchApi(`/technologies/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technologies'] });
    },
  });
};
