import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

const SelectOption = ({label, value, onChange, options, disabled = false, required = true }) => {
  return (
    <FormControl fullWidth required={required} name="shopType">
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label={label}
        onChange={onChange}
        disabled={disabled}
      >
        {options.map((item, index) => (
          <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
        ))}

      </Select>
    </FormControl>
  );
};

export default SelectOption;
