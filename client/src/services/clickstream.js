import axios from 'axios';
import { directions } from '../utils';

const baseURL = 'https://wn-api-test.toolforge.org';

export const fetchClickstream = async (language, title, direction) => {
  const encodedTitle = encodeURIComponent(title);
  const url = `${baseURL}/${language}/${encodedTitle}/${direction}`;

  let response = await axios.head(url);
  const totalCount = response.headers['total-count'];

  response = await axios.get(`${url}?limit=${totalCount}`);
  return response.data.results;
};

export const fetchSources = (language, title) =>
  fetchClickstream(language, title, directions.SOURCES);

export const fetchDestinations = (language, title) =>
  fetchClickstream(language, title, directions.DESTINATIONS);

export default { fetchClickstream, fetchSources, fetchDestinations };
