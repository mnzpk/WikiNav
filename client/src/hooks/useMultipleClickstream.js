import { useQueries } from 'react-query';
import { fetchClickstream } from '../services/clickstream';

export default function useMultipleClickstream(queries) {
  return useQueries(
    queries?.map(({ language, title, direction, month = 'latest' }) => ({
      queryKey: ['clickstream', language, title, direction, month],
      queryFn: () => fetchClickstream(language, title, direction, month),
      staleTime: Infinity,
    })) ?? []
  );
}
