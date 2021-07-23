import React, { useMemo } from 'react';
import useMultipleClickstream from '../../hooks/useMultipleClickstream';
import useTitlesInLanguages from '../../hooks/useTitlesInLanguages';
import HorizontalBar from '../HorizontalBar';
import Loader from '../Loader';
import { getTitles, round, sumClickstream } from '../../utils';

const isError = (results) => results.some(({ isError }) => isError);

const isLoading = (results) => results.some(({ isLoading }) => isLoading);

const percentageOfViews = (views, totalViews) =>
  round((views * 100) / totalViews);

const BarChartContainer = ({
  language,
  direction,
  clickstream,
  selectedOptions,
}) => {
  const limit = 10;
  const limitedClickstream = clickstream?.slice(0, limit);
  const clickstreamViews = sumClickstream(clickstream);

  // hooks for fetching data
  const clickstreamQueries = selectedOptions.map((option) => ({
    ...option,
    direction,
  }));
  const selectedLanguageClickstream =
    useMultipleClickstream(clickstreamQueries);
  const selectedLanguageTitles = useTitlesInLanguages(
    language,
    getTitles(limitedClickstream),
    selectedOptions.map(({ language }) => language)
  );

  // process fetched data to generate chart data
  const selectedLanguageViews = selectedLanguageClickstream.map(({ data }) =>
    sumClickstream(data)
  );
  const chartData = useMemo(
    () =>
      limitedClickstream.map(({ title, views }) => {
        const dataPoint = {
          title,
          [language]: percentageOfViews(views, clickstreamViews),
        };
        selectedOptions?.forEach(({ language }, idx) => {
          const titleInLanguage = selectedLanguageTitles[idx].data?.find(
            (s) => s.title === title
          )?.langlink;
          const titleViews = selectedLanguageClickstream[idx].data?.find(
            (s) => s.title === (titleInLanguage ?? title)
          )?.views;
          dataPoint[language] = percentageOfViews(
            titleViews,
            selectedLanguageViews[idx]
          );
        });
        return dataPoint;
      }),
    [
      limitedClickstream,
      selectedOptions,
      selectedLanguageTitles,
      selectedLanguageClickstream,
    ]
  );

  if (
    isLoading(selectedLanguageClickstream) ||
    isLoading(selectedLanguageTitles)
  ) {
    return <Loader />;
  }

  if (isError(selectedLanguageClickstream) || isError(selectedLanguageTitles)) {
    console.log('Error occurred during fetching selected languages...');
  }

  return (
    <HorizontalBar
      data={chartData}
      keys={[language, ...selectedOptions?.map(({ language }) => language)]}
    />
  );
};

export default BarChartContainer;
