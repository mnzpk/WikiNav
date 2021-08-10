import React from 'react';
import { withRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FiLink } from 'react-icons/fi';
import { SearchStateProvider } from './searchStateContext';
import Header from './components/Header';
import RedirectNotice from './components/RedirectNotice';
import Instruction from './components/Instruction';
import LanguageComparison from './components/LanguageComparison';
import LanguageSearch from './components/LanguageSearch';
import Sankey from './components/Sankey';
import SummaryTables from './components/SummaryTables';
import TitleSearch from './components/TitleSearch';
import TreeMap from './components/TreeMap';
import Overview from './components/Overview';
import Footer from './components/Footer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Heading = ({ text }) => {
  const id = text.replaceAll(' ', '-');
  return (
    <h2 className="section-text" id={id}>
      <a className="section-anchor" href={`#${id}`}>
        <FiLink size="20px" />
      </a>
      {text}
    </h2>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SearchStateProvider>
      <div className="main-container">
        <Header />
        <section className="title-text margin-top-3">WikiNav</section>
        <div className="controls-container">
          <section className="controls margin-top-3">
            <LanguageSearch name="language" />
            <TitleSearch name="title" />
          </section>
        </div>
        <section className="content">
          <RedirectNotice name="title" />
          <Heading text="Overview" />
          <Overview />
          <Heading text="Reader Navigation" />
          <Sankey name="title" />
          <Instruction className="paragraph">
            <strong>Reading the chart: </strong>
            <span>
              This chart visualizes incoming and outgoing traffic, to and from
              the selected article. The nodes at either end represent sources
              and destinations. Hovering over them shows what percentage of
              traffic they send to or receive from the article and clicking
              their labels changes the selected title to that article.
            </span>
          </Instruction>
          <Heading text="Sources of Traffic" />
          <TreeMap />
          <Instruction className="paragraph">
            <strong>Reading the chart: </strong>
            <span>
              This chart visualizes the percentage of traffic each source sends
              to the selected title. The legend shows the{' '}
              <a href="https://meta.wikimedia.org/wiki/Research:Wikipedia_clickstream#Data_Preparation">
                naming scheme
              </a>{' '}
              that Wikipedia uses to identify different types of sources.
            </span>
          </Instruction>
          <Heading text="Comparison Across Languages" />
          <LanguageComparison />
          <Instruction className="paragraph">
            <strong>Reading the charts: </strong>
            <span>
              These charts compare the composition of traffic across multiple
              language editions of the selected title by looking up the top
              sources and destinations for the current article in the
              clickstream dump for the selected languages. You can select one or
              more languages to compare to from the search bar above.
            </span>
          </Instruction>
          <Heading text="Numbers in Context" />
          <Instruction className="paragraph">
            <strong>Reading the tables: </strong>
            <span>
              These tables summarize the visualizations above and provide
              additional context. For incoming pageviews, the percentage of
              pageviews is for the current page that comes from each
              source-page. For outgoing pageviews, the percentage of pageviews
              is for the target page that comes from the current page.
              <br />
              To sort the table by a certain column, click the column header.
            </span>
          </Instruction>
          <SummaryTables />
        </section>
        <Footer />
      </div>
    </SearchStateProvider>
  </QueryClientProvider>
);

export default withRouter(App);
