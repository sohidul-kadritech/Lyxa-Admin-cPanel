import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

function SelectOption({ label, value, onChange, options, disabled = false, required = true, name = '' }) {
  return (
    <FormControl fullWidth required={required} name="shopType">
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        name={name}
        value={value}
        label={label}
        onChange={onChange}
        disabled={disabled}
      >
        {options.map((item) => (
          <MenuItem key={Math.random()} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectOption;
