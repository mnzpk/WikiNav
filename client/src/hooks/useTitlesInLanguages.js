import { useQueries } from 'react-query';
import { fetchTitlesInLanguage } from '../services/langlinks';

export default function useTitlesInLanguages(language, titles, lllangs) {
  return useQueries(
    lllangs?.map((lllang) => ({
      queryKey: ['titlesInLanguage', language, titles, lllang],
      queryFn: () => fetchTitlesInLanguage(language, titles, lllang),
      staleTime: Infinity,
    })) ?? []
  );
}
