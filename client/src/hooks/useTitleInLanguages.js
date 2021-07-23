import { useQuery } from 'react-query';
import { fetchTitleInLanguages } from '../services/langlinks';

export default function useTitleinLanguages(language, title, languages) {
  return useQuery(
    ['titleInLanguages', language, title, language],
    () => fetchTitleInLanguages(language, title, languages),
    { staleTime: Infinity }
  );
}
