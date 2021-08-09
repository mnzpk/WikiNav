import { useQuery } from 'react-query';
import { fetchMonthlyViews } from '../services/pageviews';

export default function useMonthlyViews(language, title, month, year) {
  return useQuery(
    ['monthlyViews', language, title, month, year],
    () => fetchMonthlyViews(language, title, month, year),
    { staleTime: Infinity, enabled: !!(month && year) }
  );
}
