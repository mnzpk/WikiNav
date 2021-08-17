import axios from 'axios';
import { normalize } from '../utils';

export const fetchTitleInLanguages = async (language, title, languages) => {
  const url = `https://${language}.wikipedia.org/w/api.php?action=query&titles=${title}&prop=langlinks&format=json&formatversion=2&lllimit=500&origin=*`;
  const response = await axios.get(url);
  let result = response.data.query?.pages[0]?.langlinks?.filter(({ lang }) =>
    languages.includes(lang)
  );
  result = result?.map(({ title, lang }) => [lang, normalize(title)]) || [];
  return result;
};

export const fetchTitlesInLanguage = async (language, titles, lllang) => {
  const formattedTitles = titles.join('|');
  const url = `https://${language}.wikipedia.org/w/api.php?action=query&titles=${formattedTitles}&prop=langlinks&format=json&formatversion=2&lllimit=500&lllang=${lllang}&origin=*`;
  const response = await axios.get(url);
  const result = response.data.query?.pages.map(({ title, langlinks }) => ({
    title: normalize(title),
    langlink: langlinks && normalize(langlinks[0].title),
  }));
  return result;
};

export default { fetchTitleInLanguages, fetchTitlesInLanguage };
