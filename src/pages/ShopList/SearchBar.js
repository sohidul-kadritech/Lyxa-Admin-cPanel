/* eslint-disable no-unused-vars */
import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import React from 'react';
import FilterSelect from '../../components/Filter/FilterSelect';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';

const listFilterOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
];

export default function SearchBar({ filtersValue = {}, setFiltersValue, searchPlaceHolder }) {
  return (
    <Stack direction="row" alignItems="center" gap="20px">
      <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        value={filtersValue.searchKey}
        onChange={(e) => {
          filtersValue((prev) => ({ ...prev, searchKey: e.target.value }));
        }}
      />
      <FilterSelect
        items={listFilterOptions}
        // value={filtersValue.status}
        placeholder="Sort"
        value=""
        tooltip="Sort"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          //   setFiltersValue((prev) => ({ ...prev, status: e.target.value }));
        }}
      />
      <FilterSelect
        items={listFilterOptions}
        // value={filtersValue.status}
        value=""
        placeholder="Status"
        tooltip="Status"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          //   setFiltersValue((prev) => ({ ...prev, status: e.target.value }));
        }}
      />
      <Button size="small" variant="contained" startIcon={<Add />}>
        Add
      </Button>
    </Stack>
  );
}
