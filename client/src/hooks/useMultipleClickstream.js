import { useQueries } from 'react-query';
import { fetchClickstream } from '../services/clickstream';

export default function useMultipleClickstream(queries) {
  return useQueries(
    queries?.map(({ language, title, direction }) => ({
      queryKey: ['clickstream', language, title, direction],
      queryFn: () =>
        fetchClickstream(language, title, direction, 'latest'),
      staleTime: Infinity,
    })) ?? []
  );
}
