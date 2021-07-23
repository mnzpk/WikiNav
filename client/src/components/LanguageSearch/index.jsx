import React from 'react';
import Select from 'react-select';
import { useSearchState } from '../../searchStateContext';

const LanguageSearch = ({ options, name }) => {
  const [{ language }, onChange] = useSearchState();

  return (
    <Select
      value={options.find(({ value }) => value === language)}
      cacheOptions
      onChange={(option) => onChange(name, option.value)}
      defaultValue={options[0]}
      options={options}
      noOptionsMessage={() => null}
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

export default LanguageSearch;
