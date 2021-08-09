import { useQuery } from 'react-query';
import { fetchLatestMetadata } from '../services/clickstream';

export default function useClickstreamMetadata() {
  return useQuery(['metadata'], () => fetchLatestMetadata(), {
    staleTime: Infinity,
  });
}
