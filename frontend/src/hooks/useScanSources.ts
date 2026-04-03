import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';

export interface SecurityScanSource {
  id: string;
  name: string;
  url: string;
  type: string;
  isActive: boolean;
  lastSyncAt: string | null;
  createdAt: string;
}

export const useGetScanSources = () => {
  return useQuery({
    queryKey: ['scan-sources'],
    queryFn: () => fetchApi('/scan-sources'),
  });
};

export const useCreateScanSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SecurityScanSource>) =>
      fetchApi('/scan-sources', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scan-sources'] });
    },
  });
};

export const useUpdateScanSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SecurityScanSource> & { id: string }) =>
      fetchApi(`/scan-sources/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scan-sources'] });
    },
  });
};

export const useDeleteScanSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/scan-sources/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scan-sources'] });
    },
  });
};
