import axios from 'axios';
import { directions } from '../utils';

const baseURL = 'https://wikinav.wmcloud.org/api/v1';

export const fetchClickstream = async (language, title, direction, month) => {
  const encodedTitle = encodeURIComponent(title);
  const url = `${baseURL}/${language}/${encodedTitle}/${direction}/${month}`;

  let response = await axios.head(url);
  const totalCount = response.headers['total-count'];

  response = await axios.get(`${url}?limit=${totalCount}`);
  return response.data.results;
};

export const fetchSources = (language, title, month) =>
  fetchClickstream(language, title, directions.SOURCES, month);

export const fetchDestinations = (language, title, month) =>
  fetchClickstream(language, title, directions.DESTINATIONS, month);

export const fetchLatestMetadata = async () => {
  const url = `${baseURL}/latest/meta`;
  const response = await axios.get(url);
  const result = {
    month: response?.data.month,
    languages: response?.data.languages?.map((language) => ({
      value: language,
      label: `${language}.wikipedia.org`,
    })),
  };
  return result;
};

export default { fetchClickstream, fetchSources, fetchDestinations };
