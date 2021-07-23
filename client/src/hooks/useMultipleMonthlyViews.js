import { useQueries } from 'react-query';
import { fetchMonthlyViews } from '../services/pageviews';

export default function useMultipleMonthlyViews(
  language,
  titles,
  month = 1,
  year = 2021
) {
  return useQueries(
    titles?.map((title) => ({
      queryKey: ['monthlyViews', language, title, month, year],
      queryFn: () => fetchMonthlyViews(language, title, month, year),
      staleTime: Infinity,
    })) ?? []
  );
}
