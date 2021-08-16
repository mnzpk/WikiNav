import { useQuery } from 'react-query';
import { fetchSources } from '../services/clickstream';

export default function useSources(language, title, month = 'latest') {
  return useQuery(
    ['sources', language, title, month],
    () => fetchSources(language, title, month),
    { staleTime: Infinity, enabled: !!month }
  );
}
