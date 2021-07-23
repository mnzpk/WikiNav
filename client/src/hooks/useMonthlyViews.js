import { useQuery } from 'react-query';
import { fetchMonthlyViews } from '../services/pageviews';

export default function useMonthlyViews(
  language,
  title,
  month = 1,
  year = 2021
) {
  return useQuery(
    ['monthlyViews', language, title, month, year],
    () => fetchMonthlyViews(language, title, month, year),
    { staleTime: Infinity }
  );
}
