import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';

export const useGetGraph = () => {
  return useQuery({
    queryKey: ['graph'],
    queryFn: async () => {
      const res = await fetchApi('/graph/full');
      // If the API returns { data: { nodes, edges } }, extract it.
      // If it's just { nodes, edges }, use it directly.
      return res.data || res;
    },
    // Keep data fresh as the user moves around, but 
    // we mostly rely on invalidation after mutations.
    staleTime: 1000 * 60 * 5, 
  });
};
