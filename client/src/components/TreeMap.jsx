import React from 'react';
import Plot from 'react-plotly.js';
import useSources from '../hooks/useSources';
import { useSearchState } from '../searchStateContext';
import useMonthlyViews from '../hooks/useMonthlyViews';
import useClickstreamMetadata from '../hooks/useClickstreamMetadata';

import {
  getReferrerSources,
  getSourcePercentages,
  getTitles,
  getViews,
  sumClickstream,
} from '../utils';
import Error from './Error';
import Loader from './Loader';

const Legend = () => {
  const LegendRow = ({ label, info }) => (
    <div className="treemap-legend-row">
      <div className="treemap-legend-label">{label}</div>
      <div className="treemap-legend-info">{info}</div>
    </div>
  );

  return (
    <div className="treemap-legend">
      <LegendRow label="articles" info="main namespace articles" />
      <LegendRow label="other-internal" info="other Wikimedia projects" />
      <LegendRow label="other-search" info="search engines" />
      <LegendRow label="other-external" info="other external sites" />
      <LegendRow label="other-empty" info="empty referrer" />
      <LegendRow label="other-other" info="everything else" />
      <LegendRow label="filtered" info="referrer not in clickstream" />
    </div>
  );
};

const TreeMap = () => {
  const [{ language, title }] = useSearchState();
  const {
    isLoading: isSourcesLoading,
    isError: isSourcesError,
    data: sources,
  } = useSources(language, title);

  const { data: metadata } = useClickstreamMetadata();
  const [year, month] = metadata?.month.split('-') ?? [];

  const {
    isLoading: isActualMonthlyViewsLoading,
    isError: isActualMonthlyViewsError,
    data: actualMonthlyViews,
  } = useMonthlyViews(language, title, month, year);

  if (isSourcesLoading || isActualMonthlyViewsLoading) {
    return <Loader />;
  }

  if (isSourcesError || isActualMonthlyViewsError) {
    return <Error />;
  }

  const sourceViewsSum = sumClickstream(sources);
  const referrerSources =
    getReferrerSources(sources)?.map((source) =>
      source.title === 'Main_Page' ? { ...source, title: 'main-page' } : source
    ) ?? [];

  const totalMonthlyViews = Math.max(sourceViewsSum, actualMonthlyViews);
  const data = [
    { title: 'all pageviews', views: totalMonthlyViews },
    ...referrerSources,
    {
      title: 'articles',
      views: sourceViewsSum - sumClickstream(referrerSources),
    },
    {
      title: 'filtered',
      views: totalMonthlyViews - sourceViewsSum,
    },
  ];
  const parents = Array(data.length - 1).fill('all pageviews');
  parents.unshift('');

  return (
    <div className="treemap-container">
      <div className="treemap">
        <Plot
          data={[
            {
              type: 'treemap',
              branchvalues: 'total',
              labels: getTitles(data),
              values: getViews(data),
              parents,
              customdata: getSourcePercentages(data, totalMonthlyViews),
              texttemplate: '<b>%{label}</b><br>%{percentParent}',
              hovertemplate:
                '<b>%{label}</b><br>Pageviews: %{value}<br>%{customdata}%<extra></extra>',
              marker: {
                colors: [
                  'FFF',
                  '0E4D92',
                  '0080FF',
                  '6593F5',
                  '73C2FB',
                  '588BAE',
                  '73C2FB',
                  '588BAE',
                ],
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
          }}
          config={{
            displaylogo: false,
            modeBarButtons: [['toImage']],
          }}
          useResizeHandler
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
      <Legend />
    </div>
  );
};

export default TreeMap;
