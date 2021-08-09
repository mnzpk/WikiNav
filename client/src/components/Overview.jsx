import React from 'react';
import { FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi';
import { sumClickstream, kFormatter, monthFormatter } from '../utils';
import useSources from '../hooks/useSources';
import useDestinations from '../hooks/useDestinations';
import useClickstreamMetadata from '../hooks/useClickstreamMetadata';
import { useSearchState } from '../searchStateContext';
import Loader from './Loader';
import Error from './Error';

const OverviewCard = ({ incoming, figure, text }) => (
  <div className="overview-card">
    <span className="overview-circle">
      {incoming ? <FiArrowDownLeft /> : <FiArrowUpRight />}
    </span>
    <div className="overview-figure">{figure}</div>
    {text}
  </div>
);

const Overview = () => {
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
  const [year, month] = metadata?.month.split('-') ?? [];

  const incomingPageviews = kFormatter(sumClickstream(sources));
  const outgoingPageviews = kFormatter(sumClickstream(destinations));
  const uniqueSources = sources?.length;
  const uniqueDestinations = destinations?.length;

  if (isSourcesLoading || isDestinationsLoading) {
    return <Loader />;
  }

  if (isSourcesError || isDestinationsError) {
    return <Error />;
  }

  return (
    <>
      <p className="paragraph">
        This tool provides insights into how readers of Wikipedia explore the
        content when learning about a given topic. <br />
        The following analyses and visualizations have been generated by
        processing the publicly available{' '}
        <a href="https://dumps.wikimedia.org/other/clickstream/readme.html">
          Wikipedia clickstream
        </a>{' '}
        dump from{' '}
        <strong>
          {month && monthFormatter(month)}, {year}
        </strong>
        . The dataset contains the number of times a given link from a
        source-page to a target-page in Wikipedia was clicked in that month.
      </p>
      <div className="overview-container">
        <OverviewCard
          incoming
          figure={incomingPageviews}
          text="incoming pageviews"
        />
        <OverviewCard
          incoming={false}
          figure={outgoingPageviews}
          text="outgoing pageviews"
        />
        <OverviewCard incoming figure={uniqueSources} text="unique sources" />
        <OverviewCard
          incoming={false}
          figure={uniqueDestinations}
          text="unique destinations"
        />
      </div>
    </>
  );
};
export default Overview;
