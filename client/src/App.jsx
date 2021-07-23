import React from 'react';
import { withRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
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
      <div>Clickstream Analysis</div>
      <div>
        <LanguageSearch name="language" options={languages} />
        <TitleSearch name="title" />
      </div>
      <p>Visualizing Reader Navigation</p>
      <Sankey name="title" />
      <Instruction>
        <strong>Reading the chart: </strong>
        <span>
          The chart shows common pathways to and from the selected title. The
          links between nodes represent the number of pageviews. Hovering over
          the nodes and links gives additional information to help contextualize
          these pageviews.
        </span>
      </Instruction>
      <p>Pageviews by Referrer</p>
      <TreeMap />
      <Instruction>
        <strong>Reading the chart: </strong>
        <span>
          The chart shows common pathways to and from the selected title. The
          links between nodes represent the number of pageviews. Hovering over
          the nodes and links gives additional information to help contextualize
          these pageviews.
        </span>
      </Instruction>
      <p>Comparison Across Languages</p>
      <LanguageComparison languages={languages} />
      <p>Summary Tables</p>
      <Instruction>
        <strong>Reading the tables: </strong>
        <span>
          These tables summarize the visualizations above. The views and
          percentage of views columns double as heatmaps. The columns can be
          sorted by clicking on their labels.
        </span>
      </Instruction>
      <SummaryTables />
    </SearchStateProvider>
  </QueryClientProvider>
);

export default withRouter(App);
