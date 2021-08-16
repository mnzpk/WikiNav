import React from 'react';
import { useSearchState } from '../searchStateContext';
import useSources from '../hooks/useSources';
import useDestinations from '../hooks/useDestinations';
import useClickstreamMetadata from '../hooks/useClickstreamMetadata';
import Loader from './Loader';
import Error from './Error';
import HorizontalBar from './HorizontalBar';
import { sumClickstream, round } from '../utils';

const getMonth = (date) => {
  const month = date.getMonth() + 1;
  return month < 10 ? `0${month}` : `${month}`;
};

const percentageOfViews = (views, totalViews) =>
  round((views * 100) / totalViews);

const getPreviousMonth = (month) => {
  const latestDate = new Date(month);
  latestDate.setMonth(latestDate.getMonth() - 1);
  return `${latestDate.getFullYear()}-${getMonth(latestDate)}`;
};

const TimeComparison = () => {
  // Hooks for fetching data
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
  const { data: metadata } = useClickstreamMetadata();
  const month = metadata?.month;
  const previousMonth = month && getPreviousMonth(month);
  const {
    isLoading: isOldSourcesLoading,
    isError: isOldSourcesError,
    data: oldSources,
  } = useSources(language, title, previousMonth);
  const {
    isLoading: isOldDestinationsLoading,
    isError: isOldDestinationsError,
    data: oldDestinations,
  } = useDestinations(language, title, previousMonth);

  if (
    isSourcesLoading ||
    isDestinationsLoading ||
    isOldSourcesLoading ||
    isOldDestinationsLoading
  ) {
    return <Loader />;
  }

  if (
    isSourcesError ||
    isDestinationsError ||
    isOldSourcesError ||
    isOldDestinationsError
  ) {
    return <Error />;
  }

  const limit = 10;
  const getChartData = (currentClickstream, oldClickstream) => {
    const currentClickstreamViews = sumClickstream(currentClickstream);
    const oldClickstreamViews = sumClickstream(oldClickstream);
    return currentClickstream.slice(0, limit).map(({ title, views }) => ({
      title,
      [month]: percentageOfViews(views, currentClickstreamViews),
      [previousMonth]: percentageOfViews(
        oldClickstream.find((c) => c.title === title)?.views,
        oldClickstreamViews
      ),
    }));
  };

  const chartDataIncoming = getChartData(sources, oldSources);
  const chartDataOutgoing = getChartData(destinations, oldDestinations);
  const keys = [month, previousMonth];

  return (
    <>
      <h3 className="subsection-text">Incoming Pageviews</h3>
      <div className="comparison-container">
        <div className="barchart">
          <HorizontalBar data={chartDataIncoming} keys={keys} />
        </div>
        <p className="barchart-label">Percentage of Incoming Pageviews</p>
      </div>
      <h3 className="subsection-text">Outgoing Pageviews</h3>
      <div className="comparison-container">
        <div className="barchart">
          <HorizontalBar data={chartDataOutgoing} keys={keys} />
        </div>
        <p className="barchart-label">Percentage of Outgoing Pageviews</p>
      </div>
    </>
  );
};

export default TimeComparison;
