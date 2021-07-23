import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useSearchState } from '../../searchStateContext';

const TitleSearch = ({ name }) => {
  const [{ language, title }, onChange] = useSearchState();
  const [query, setQuery] = useState('');
  const loadOptions = () => {
    const url = `https://${language}.wikipedia.org/w/api.php?action=query&list=prefixsearch&format=json&pssearch=${query}&origin=*`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => data.query.prefixsearch);
  };

  return (
    <AsyncSelect
      cacheOptions
      value={{ title: title.replaceAll('_', ' ') || ' ' }}
      getOptionLabel={(option) => option.title}
      getOptionValue={(option) => option.title.replaceAll(' ', '_')}
      loadOptions={loadOptions}
      onInputChange={(value) => setQuery(value)}
      onChange={(option) => onChange(name, option.title.replaceAll(' ', '_'))}
      noOptionsMessage={() => 'Enter one or more characters to get started.'}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
      maxMenuHeight={175}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          neutral50: 'black',
        },
      })}
    />
  );
};

export default TitleSearch;
