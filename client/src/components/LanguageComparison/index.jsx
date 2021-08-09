import React, { useState, useEffect } from 'react';
import { useSearchState } from '../../searchStateContext';
import useSources from '../../hooks/useSources';
import useDestinations from '../../hooks/useDestinations';
import useTitleinLanguages from '../../hooks/useTitleInLanguages';
import useClickstreamMetadata from '../../hooks/useClickstreamMetadata';
import MultiSelect from '../MultiSelect';
import Loader from '../Loader';
import BarChartContainer from './BarChartContainer';
import { directions } from '../../utils';
import Error from '../Error';

export const getLanguageValues = (languages) =>
  languages?.map(({ value }) => value);

const LanguageComparison = () => {
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
  const { languages } = metadata ?? {};
  const {
    isLoading: isTitleInLanguagesLoading,
    isError: isTitleInLanguagesError,
    data: titleInLanguages,
  } = useTitleinLanguages(language, title, getLanguageValues(languages));
  const [selectedOptions, setSelectedOptions] = useState();

  useEffect(() => setSelectedOptions([]), [language, title]);

  if (isSourcesLoading || isDestinationsLoading || isTitleInLanguagesLoading) {
    return <Loader />;
  }

  if (isSourcesError || isDestinationsError || isTitleInLanguagesError) {
    return <Error />;
  }

  const titleInLanguage = titleInLanguages && new Map(titleInLanguages);
  const fixedLanguage = languages.find(({ value }) => value === language);
  fixedLanguage.isFixed = true;
  let otherLanguages = languages.filter(({ value }) => value !== language);
  otherLanguages = otherLanguages.map((language) => ({
    ...language,
    isFixed: false,
  }));

  const handleLanguageSelection = (selectedLanguage) => {
    setSelectedOptions([
      ...selectedOptions,
      {
        language: selectedLanguage,
        title: titleInLanguage.get(selectedLanguage),
      },
    ]);
  };

  const handleLanguageRemoval = (removedLanguages) => {
    const updatedOptions = selectedOptions.filter(
      ({ language }) =>
        !removedLanguages.find(({ value }) => value === language)
    );
    setSelectedOptions(updatedOptions);
  };

  return (
    <>
      <div className="language-select">
        <MultiSelect
          fixed={fixedLanguage}
          handleSelection={handleLanguageSelection}
          handleRemoval={handleLanguageRemoval}
          options={otherLanguages}
        />
      </div>
      <p className="subsection-text">Incoming Pageviews</p>
      <div className="comparison-container">
        <div className="barchart">
          <BarChartContainer
            language={language}
            direction={directions.SOURCES}
            clickstream={sources}
            selectedOptions={selectedOptions}
          />
        </div>
        <p className="barchart-label">Percentage of Incoming Pageviews</p>
      </div>
      <p className="subsection-text">Outgoing Pageviews</p>
      <div className="comparison-container">
        <div className="barchart">
          <BarChartContainer
            language={language}
            direction={directions.DESTINATIONS}
            clickstream={destinations}
            selectedOptions={selectedOptions}
          />
        </div>
        <p className="barchart-label">Percentage of Outgoing Pageviews</p>
      </div>
    </>
  );
};

export default LanguageComparison;
