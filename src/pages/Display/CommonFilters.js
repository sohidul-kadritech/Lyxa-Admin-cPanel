import { Stack } from '@mui/material';
import React from 'react';
import FilterDate from '../../components/Filter/FilterDate';
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

export default function CommonFilters({ filtersValue, setFiltersValue, searchPlaceHolder }) {
  return (
    <Stack direction="row" alignItems="center" gap="20px" pb={6.5}>
      <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        value={filtersValue.searchKey}
        onChange={(e) => {
          setFiltersValue((prev) => ({ ...prev, searchKey: e.target.value }));
        }}
      />
      {/* start date */}
      <FilterDate
        tooltip="Start Date"
        value={filtersValue.date.start}
        size="sm"
        onChange={(e) => {
          setFiltersValue((prev) => ({
            ...prev,
            date: {
              ...prev.date,
              start: e._d,
            },
          }));
        }}
      />
      {/* end date */}
      <FilterDate
        tooltip="End Date"
        value={filtersValue.date.end}
        size="sm"
        onChange={(e) => {
          setFiltersValue((prev) => ({
            ...prev,
            date: {
              ...prev.date,
              end: e._d,
            },
          }));
        }}
      />
      {/* end date */}
      <FilterSelect
        items={listFilterOptions}
        value={filtersValue.status}
        placeholder="Status"
        tooltip="Status"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setFiltersValue((prev) => ({ ...prev, status: e.target.value }));
        }}
      />
    </Stack>
  );
}
