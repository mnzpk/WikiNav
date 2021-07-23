import React, { useEffect, useState } from 'react';
import { useSearchState } from '../../searchStateContext';
import useSources from '../../hooks/useSources';
import useDestinations from '../../hooks/useDestinations';
import useTitleinLanguages from '../../hooks/useTitleInLanguages';
import MultiSelect from '../MultiSelect';
import Loader from '../Loader';
import BarChartContainer from './BarChartContainer';
import { directions } from '../../utils';
import Error from '../Error';

export const getLanguageValues = (languages) =>
  languages.map(({ value }) => value);

const LanguageComparison = ({ languages }) => {
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
  const {
    isLoading: isTitleInLanguagesLoading,
    isError: isTitleInLanguagesError,
    data: titleInLanguages,
  } = useTitleinLanguages(language, title, getLanguageValues(languages));
  const [selectedOptions, setSelectedOptions] = useState();

  useEffect(() => setSelectedOptions([]), [language, title]);

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
    const updatedOptions = selectedOptions.filter(({ language }) =>
      removedLanguages.includes(language)
    );
    setSelectedOptions(updatedOptions);
  };

  if (isSourcesLoading || isDestinationsLoading || isTitleInLanguagesLoading) {
    return <Loader />;
  }

  if (isSourcesError || isDestinationsError || isTitleInLanguagesError) {
    return <Error />;
  }

  return (
    <>
      <div>
        <MultiSelect
          fixed={fixedLanguage}
          handleSelection={handleLanguageSelection}
          handleRemoval={handleLanguageRemoval}
          options={otherLanguages}
        />
      </div>
      <p>Incoming Pageviews</p>
      <div>
        <BarChartContainer
          language={language}
          direction={directions.SOURCES}
          clickstream={sources}
          selectedOptions={selectedOptions}
        />
        <p>Percentage of Incoming Pageviews</p>
      </div>
      <p>Outgoing Pageviews</p>
      <div>
        <BarChartContainer
          language={language}
          direction={directions.DESTINATIONS}
          clickstream={destinations}
          selectedOptions={selectedOptions}
        />
        <p>Percentage of Outgoing Pageviews</p>
      </div>
    </>
  );
};

export default LanguageComparison;
