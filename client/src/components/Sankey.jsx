import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import Select from 'react-select';
import Toggle from 'react-toggle';
import useSources from '../hooks/useSources';
import useDestinations from '../hooks/useDestinations';
import useMonthlyViews from '../hooks/useMonthlyViews';
import useMultipleMonthlyViews from '../hooks/useMultipleMonthlyViews';
import {
  getNonReferrerSources,
  getTitles,
  getViews,
  getSourcePercentages,
  getDestinationPercentages,
  isReferrer,
} from '../utils';
import { useSearchState } from '../searchStateContext';
import Loader from './Loader';
import Error from './Error';
import useClickstreamMetadata from '../hooks/useClickstreamMetadata';

const limitOptions = [
  { value: 10, label: 'top 10' },
  { value: 20, label: 'top 20' },
];

const getSourceIds = (sourceCount, destinationCount) =>
  [...Array(sourceCount).keys()].concat(
    Array(destinationCount).fill(sourceCount)
  );

const getDestinationIds = (sourceCount, destinationCount) =>
  Array(sourceCount)
    .fill(sourceCount)
    .concat(
      [...Array(destinationCount).keys()].map((x) => sourceCount + x + 1)
    );

const getLabels = (title, sources, destinations) =>
  [...getTitles(sources), title].concat(getTitles(destinations));

const getValues = (sources, destinations) =>
  getViews(sources).concat(getViews(destinations));

const Sankey = ({ name }) => {
  const [{ language, title }, onClick] = useSearchState();
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

  const {
    isLoading: isMonthlyTitleViewsLoading,
    isError: isMonthlyTitleViewsError,
    data: titleMonthlyViews,
  } = useMonthlyViews(language, title, month, year);

  const destinationsMonthlyViews = useMultipleMonthlyViews(
    language,
    getTitles(destinations?.slice(0, 30)),
    month,
    year
  );

  const [limit, setLimit] = useState(10);
  const [includeOther, setIncludeOther] = useState(true);

  const isDestinationsMonthlyViewsLoading = () =>
    destinationsMonthlyViews.some(({ isLoading }) => isLoading);
  const isDestinationsMonthlyViewsError = () =>
    destinationsMonthlyViews.some(({ isError }) => isError);
  const limitedSources = includeOther
    ? sources?.slice(0, limit)
    : getNonReferrerSources(sources)?.slice(0, limit);
  const limitedDestinations = destinations?.slice(0, limit);

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
    <div className="sankey">
      <div className="sankey-controls">
        <div>
          <Toggle
            className="toggle"
            id="include-other"
            defaultChecked={includeOther}
            icons={false}
            onChange={() => setIncludeOther(!includeOther)}
          />
          <span id="include-other-label" className="toggle-label">
            Include views from sources other than Wiki articles
          </span>
        </div>
        <Select
          className="limit-select"
          options={limitOptions}
          onChange={(o) => setLimit(o.value)}
          defaultValue={limitOptions.find(({value}) => value === limit)}
          isSearchable={false}
        />
      </div>
      <Plot
        data={[
          {
            type: 'sankey',
            orientation: 'h',
            arrangement: 'fixed',
            node: {
              pad: 30,
              thickness: 10,
              line: {
                width: 0,
              },
              label: getLabels(title, limitedSources, limitedDestinations),
              hoverinfo: 'none',
              color: '#0670de',
            },
            link: {
              source: getSourceIds(
                limitedSources.length,
                limitedDestinations.length
              ),
              target: getDestinationIds(
                limitedSources.length,
                limitedDestinations.length
              ),
              value: getValues(limitedSources, limitedDestinations),
              color: '#edf6fc',
              customdata: getSourcePercentages(
                limitedSources,
                titleMonthlyViews
              ).concat(
                getDestinationPercentages(
                  limitedDestinations,
                  destinationsMonthlyViews.map(({ data }) => data)
                )
              ),
              hovertemplate:
                // eslint-disable-next-line max-len
                "<b>Source</b>: %{source.label}<br><b>Target</b>: %{target.label}<br><b>%{customdata}%</b> of <b>%{target.label}'s</b> views for the month",
            },
          },
        ]}
        layout={{
          autosize: true,
          margin: {
            l: 10,
            r: 10,
            t: 30,
            b: 30,
          },
          font: {
            size: 10,
          },
        }}
        config={{
          displaylogo: false,
          modeBarButtonsToRemove: [
            'lasso2d',
            'select2d',
            'hoverClosestCartesian',
            'hoverCompareCartesian',
          ],
        }}
        onClick={({ points }) => {
          if (!isReferrer(points[0].label)) {
            onClick(name, points[0].label);
          }
        }}
        useResizeHandler
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default Sankey;
