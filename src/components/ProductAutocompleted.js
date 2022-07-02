import React from "react";
import { Autocomplete, Box, TextField } from "@mui/material";

const ProductAutocompleted = ({
  value = "",
  onChange,
  searchKey,
  onInputChange,
  list,
  disabled = false,
  required = true,
}) => {
  return (
    <Autocomplete
      className="cursor-pointer"
      disabled={disabled}
      value={value}
      onChange={onChange}
      getOptionLabel={(option) => (option.name ? option.name : "")}
      isOptionEqualToValue={(option, value) => option._id == value._id}
      inputValue={searchKey}
      onInputChange={onInputChange}
      id="controllable-states-demo"
      options={list.length > 0 ? list : []}
      sx={{ width: "100%" }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select a Product"
          required={required}
          name="Product"
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
          key={option._id}
        >
          <img loading="lazy" width="60" src={option.images[0]} alt="" />
          {option.name}
        </Box>
      )}
    />
  );
};

export default ProductAutocompleted;
