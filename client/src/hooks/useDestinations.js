import { useQuery } from 'react-query';
import { fetchDestinations } from '../services/clickstream';

export default function useDestinations(language, title) {
  return useQuery(
    ['destinations', language, title],
    () => fetchDestinations(language, title),
    { staleTime: Infinity }
  );
}
