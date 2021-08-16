import { useQuery } from 'react-query';
import { fetchDestinations } from '../services/clickstream';

export default function useDestinations(language, title, month = 'latest') {
  return useQuery(
    ['destinations', language, title, month],
    () => fetchDestinations(language, title, month),
    { staleTime: Infinity, enabled: !!month }
  );
}
