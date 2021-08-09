import React from 'react';
import Plot from 'react-plotly.js';
import useSources from '../hooks/useSources';
import { useSearchState } from '../searchStateContext';
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
      <LegendRow label="other-external" info="external sites" />
      <LegendRow label="other-empty" info="empty referrer" />
      <LegendRow label="other-other" info="everything else" />
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

  const sourceViewsSum = sumClickstream(sources);
  const referrerSources = getReferrerSources(sources) ?? [];
  const data = [
    { title: 'All Pageviews', views: sourceViewsSum },
    ...referrerSources,
    {
      title: 'Articles',
      views: sourceViewsSum - sumClickstream(referrerSources),
    },
  ];
  const parents = Array(data.length - 1).fill('All Pageviews');
  parents.unshift('');

  if (isSourcesLoading) {
    return <Loader />;
  }

  if (isSourcesError) {
    return <Error />;
  }

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
              customdata: getSourcePercentages(data, sourceViewsSum),
              texttemplate: '<b>%{label}</b><br>%{percentParent}',
              hovertemplate:
                '<b>%{label}</b><br>Pageviews: %{value}<br>%{customdata}%<extra></extra>',
              marker: {
                colors: [
                  '#FFF',
                  '#0E4D92',
                  '0080FF',
                  '6593F5',
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
