export const directions = {
  SOURCES: 'sources',
  DESTINATIONS: 'destinations',
};

export const referrers = [
  'other-search',
  'other-empty',
  'other-internal',
  'other-other',
  'Main_Page',
  'other-external',
];

export const getNonReferrerSources = (sources) =>
  sources?.filter(({ title }) => !referrers.includes(title));

export const getReferrerSources = (sources) =>
  sources?.filter(({ title }) => referrers.includes(title));

export const round = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

export const getSourcePercentages = (sources, titleMonthlyViews) =>
  sources.map(({ views }) => round((views * 100) / titleMonthlyViews));

export const getDestinationPercentages = (
  destinations,
  destinationsMonthlyViews
) =>
  destinations.map(({ views }, idx) =>
    round((views * 100) / destinationsMonthlyViews[idx])
  );

export const getTitles = (clickstream) =>
  clickstream?.map(({ title }) => title);

export const getViews = (clickstream) => clickstream?.map(({ views }) => views);

export const isReferrer = (title) => referrers.includes(title);

const sumReducer = (acc, curr) => acc + curr.views;
export const sumClickstream = (clickstream) =>
  clickstream?.reduce(sumReducer, 0);

export const normalize = (title) => title.replaceAll(' ', '_');

export const denormalize = (title) => title.replaceAll('_', ' ');
