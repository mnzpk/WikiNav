import { useQuery } from 'react-query';
import { fetchSources } from '../services/clickstream';

export default function useSources(language, title) {
  return useQuery(
    ['sources', language, title],
    () => fetchSources(language, title),
    { staleTime: Infinity }
  );
}
