import React from 'react';
import { withRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FiLink } from 'react-icons/fi';
import { SearchStateProvider } from './searchStateContext';
import Instruction from './components/Instruction';
import LanguageComparison from './components/LanguageComparison';
import LanguageSearch from './components/LanguageSearch';
import Sankey from './components/Sankey';
import SummaryTables from './components/SummaryTables';
import TitleSearch from './components/TitleSearch';
import TreeMap from './components/TreeMap';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const languages = [
  { value: 'en', label: 'en.wikipedia.org' },
  { value: 'pt', label: 'pt.wikipedia.org' },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SearchStateProvider>
      <div className="main-container">
        <h1 className="section title-text">Clickstream Analysis</h1>
        <div className="controls-container">
          <div className="section controls">
            <LanguageSearch name="language" options={languages} />
            <TitleSearch name="title" />
          </div>
        </div>
        <div className="content section">
          <h2 className="section-text" id="Visualizing_Reader_Navigation">
            <a className="section-anchor" href="#Visualizing_Reader_Navigation">
              <FiLink size="20px" />
            </a>
            Visualizing Reader Navigation
          </h2>
          <Sankey name="title" />
          <Instruction className="paragraph">
            <strong>Reading the chart: </strong>
            <span>
              The chart shows common pathways to and from the selected title.
              The links between nodes represent the number of pageviews.
              Hovering over the nodes and links gives additional information to
              help contextualize these pageviews.
            </span>
          </Instruction>
          <h2 className="section-text" id="Pageviews_by_Referrer">
            <a className="section-anchor" href="#Pageviews_by_Referrer">
              <FiLink size="20px" />
            </a>
            Pageviews by Referrer
          </h2>
          <TreeMap />
          <Instruction className="paragraph">
            <strong>Reading the chart: </strong>
            <span>
              Incoming clickstream traffic is mapped to a set of
              {' '}
              <a href="https://meta.wikimedia.org/wiki/Research:Wikipedia_clickstream#Data_Preparation">
                referrers
              </a>
              . This chart shows the percentage of views each of these referrers
              directs to the selected title.
            </span>
          </Instruction>
          <h2 className="section-text" id="Comparison_Across_Languages">
            <a className="section-anchor" href="#Comparison_Across_Languages">
              <FiLink size="20px" />
            </a>
            Comparison Across Languages
          </h2>
          <LanguageComparison languages={languages} />
          <h2 className="section-text" id="Summary_Tables">
            <a className="section-anchor" href="#Summary_Tables">
              <FiLink size="20px" />
            </a>
            Summary Tables
          </h2>
          <Instruction className="paragraph">
            <strong>Reading the tables: </strong>
            <span>
              These tables summarize the visualizations above. The views and
              percentage of views columns double as heatmaps. The columns can be
              sorted by clicking on their labels.
            </span>
          </Instruction>
          <SummaryTables />
        </div>
      </div>
    </SearchStateProvider>
  </QueryClientProvider>
);

export default withRouter(App);