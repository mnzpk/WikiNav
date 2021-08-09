import axios from 'axios';

const baseURL =
  'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article';

export const fetchMonthlyViews = async (language, title, month, year) => {
  const encodedTitle = encodeURIComponent(title);
  const url = `${baseURL}/${language}.wikipedia/all-access/user/${encodedTitle}/monthly/${year}010100/${year}123100`;
  const response = await axios.get(url);
  const allMonths = response.data.items;
  return allMonths && allMonths[parseInt(month, 10) - 1]?.views;
};

export default { fetchMonthlyViews };
