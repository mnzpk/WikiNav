import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const styles = {
  multiValue: (base, state) =>
    state.data.isFixed ? { ...base, backgroundColor: 'gray' } : base,
  multiValueLabel: (base, state) =>
    state.data.isFixed
      ? {
          ...base,
          fontWeight: 'bold',
          color: 'white',
          paddingRight: 6,
        }
      : base,
  multiValueRemove: (base, state) =>
    state.data.isFixed ? { ...base, display: 'none' } : base,
};

const orderOptions = (values) =>
  values.filter((v) => v.isFixed).concat(values.filter((v) => !v.isFixed));

export default ({ fixed, options, handleSelection, handleRemoval }) => {
  const [state, setState] = useState();
  useEffect(() => {
    setState({
      value: orderOptions([fixed]),
    });
  }, [fixed]);

  const onChange = (value, { action, option, removedValue }) => {
    // eslint-disable-next-line default-case
    switch (action) {
      case 'select-option':
        handleSelection(option.value);
        break;
      case 'remove-value':
      case 'pop-value':
        if (removedValue.isFixed) {
          return;
        }
        handleRemoval([removedValue]);
        break;
      case 'clear':
        // eslint-disable-next-line no-param-reassign
        value = [fixed];
        handleRemoval(options);
        break;
    }

    // eslint-disable-next-line no-param-reassign
    value = orderOptions(value);
    setState({ value });
  };
  return (
    <div>
      {state && (
        <Select
          value={state.value}
          isMulti
          styles={styles}
          isClearable={state.value.some((v) => !v.isFixed)}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={onChange}
          options={options}
        />
      )}
    </div>
  );
};
