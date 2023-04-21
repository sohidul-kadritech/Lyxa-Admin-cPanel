/* eslint-disable  */
import { Autocomplete, Box, TextField } from '@mui/material';
import React from 'react';

function AutocompletedInput({ value, onChange, searchKey, onInputChange, list, disabled, type, showImg = false }) {
  return (
    <Autocomplete
      className="cursor-pointer"
      disabled={disabled}
      value={value}
      onChange={onChange}
      getOptionLabel={(option) => (type === 'shop' ? option.shopName : option?.name ? option?.name : '')}
      isOptionEqualToValue={(option, item) => option?._id == item?._id}
      inputValue={searchKey}
      onInputChange={onInputChange}
      id="controllable-states-demo"
      options={list.length > 0 ? list : []}
      sx={{ width: '100%' }}
      renderInput={(params) => <TextField {...params} label={`Select a ${type}`} required name={type} />}
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option?._id}>
          {showImg && <img loading="lazy" width="60" src={type === 'shop' ? option.shopBanner : ''} alt="" />}
          {type === 'shop' ? option.shopName : option?.name}
        </Box>
      )}
    />
  );
}

export default AutocompletedInput;
