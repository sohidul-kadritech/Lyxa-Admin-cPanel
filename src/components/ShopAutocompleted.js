import React from "react";
import { Autocomplete, Box, TextField } from "@mui/material";

const ShopAutocompleted = ({
  value,
  onChange,
  searchKey,
  onInputChange,
  list,
  disabled,
}) => {
  return (
    <Autocomplete
      className="cursor-pointer"
      disabled={disabled}
      value={value}
      onChange={onChange}
      getOptionLabel={(option) => option.shopName}
      isOptionEqualToValue={(option, item) => option?._id == item?._id}
      inputValue={searchKey}
      onInputChange={onInputChange}
      id="controllable-states-demo"
      options={list.length > 0 ? list : []}
      sx={{ width: "100%" }}
      renderInput={(params) => (
        <TextField {...params} label="Select a Shop" required name="shop" />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
          key={option._id}
        >
          <img loading="lazy" width="60" src={option.shopBanner} alt="" />
          {option.shopName}
        </Box>
      )}
    />
  );
};

export default ShopAutocompleted;
