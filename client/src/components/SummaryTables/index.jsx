import React from 'react';
import useSources from '../../hooks/useSources';
import useDestinations from '../../hooks/useDestinations';
import useMonthlyViews from '../../hooks/useMonthlyViews';
import useMultipleMonthlyViews from '../../hooks/useMultipleMonthlyViews';
import SummaryTable from './SummaryTable';
import {
  getTitles,
  getSourcePercentages,
  getDestinationPercentages,
} from '../../utils';
import { useSearchState } from '../../searchStateContext';
import Loader from '../Loader';
import Error from '../Error';

const SummaryTables = () => {
  const [{ language, title }] = useSearchState();
  const {
    isLoading: isSourcesLoading,
    isError: isSourcesError,
    data: sources,
  } = useSources(language, title);
  const {
    isLoading: isDestinationsLoading,
    isError: isDestinationsError,
    data: destinations,
  } = useDestinations(language, title);
  const {
    isLoading: isMonthlyTitleViewsLoading,
    isError: isMonthlyTitleViewsError,
    data: titleMonthlyViews,
  } = useMonthlyViews(language, title);
  const destinationsMonthlyViews = useMultipleMonthlyViews(
    language,
    getTitles(destinations?.slice(0, 30))
  );

  const limit = 10;
  const limitedSources = sources?.slice(0, limit);
  const limitedDestinations = destinations?.slice(0, limit);

  const isDestinationsMonthlyViewsLoading = () =>
    destinationsMonthlyViews.some(({ isLoading }) => isLoading);
  const isDestinationsMonthlyViewsError = () =>
    destinationsMonthlyViews.some(({ isError }) => isError);

  if (
    isSourcesLoading ||
    isDestinationsLoading ||
    isMonthlyTitleViewsLoading ||
    isDestinationsMonthlyViewsLoading()
  ) {
    return <Loader />;
  }

  if (
    isSourcesError ||
    isDestinationsError ||
    isMonthlyTitleViewsError ||
    isDestinationsMonthlyViewsError()
  ) {
    return <Error />;
  }

  return (
    <>
      <SummaryTable
        clickstream={limitedSources}
        clickstreamPercentages={getSourcePercentages(
          limitedSources,
          titleMonthlyViews
        )}
        tableTitle="Incoming Pageviews"
        columnNames={['Source', 'Views', 'Percentage Of Views']}
      />
      <SummaryTable
        clickstream={limitedDestinations}
        clickstreamPercentages={getDestinationPercentages(
          limitedDestinations,
          destinationsMonthlyViews.map(({ data }) => data)
        )}
        tableTitle="Outgoing Pageviews"
        columnNames={['Destination', 'Views', 'Percentage Of Views']}
      />
    </>
  );
};

export default SummaryTables;
