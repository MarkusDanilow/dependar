import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';

export interface Vulnerability {
  id: string;
  vulnerableRange: string;
  baseSeverity: string;
}

export interface VulnState {
  id: string;
  technologyId: string;
  vulnerabilityId: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'IGNORED';
  technology: {
    id: string;
    name: string;
    version: string;
  };
  vulnerability: Vulnerability;
}

export const useGetVulnStates = () => {
  return useQuery<VulnState[]>({
    queryKey: ['vuln-states'],
    queryFn: async () => {
        const res = await fetchApi('/analytics/vuln-states');
        return res.data || res;
    },
  });
};

export const useUpdateVulnStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      fetchApi(`/analytics/vuln-states/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vuln-states'] });
      queryClient.invalidateQueries({ queryKey: ['technologies'] });
      queryClient.invalidateQueries({ queryKey: ['containers'] });
      queryClient.invalidateQueries({ queryKey: ['graph'] });
    },
  });
};
