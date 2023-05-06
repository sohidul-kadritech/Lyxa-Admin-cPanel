import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import moment from 'moment';
import React from 'react';
import FilterDate from '../../../../../components/Filter/FilterDate';
import FilterSelect from '../../../../../components/Filter/FilterSelect';
import StyledSearchBar from '../../../../../components/Styled/StyledSearchBar';
import { sortOptions, statusOptions } from './helpers';

export default function Searchbar({ filters, setFilters, searchPlaceHolder, onAdd }) {
  return (
    <Stack direction="row" alignItems="center" gap="20px" pb={6.5}>
      <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        value={filters.searchKey}
        onChange={(e) => {
          setFilters((prev) => ({ ...prev, searchKey: e.target.value }));
        }}
      />
      {/* start date */}
      <FilterDate
        tooltip="Start Date"
        maxDate={moment(filters.date.end).subtract(1, 'day')}
        value={filters.date.start}
        size="sm"
        onChange={(e) => {
          setFilters((prev) => ({
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
        minDate={moment(filters.date.start).add(1, 'day')}
        value={filters.date.end}
        size="sm"
        onChange={(e) => {
          setFilters((prev) => ({
            ...prev,
            date: {
              ...prev.date,
              end: e._d,
            },
          }));
        }}
      />
      {/* sort */}
      <FilterSelect
        items={sortOptions}
        value={filters.sortBy}
        placeholder="Sort"
        tooltip="Sort"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setFilters((prev) => ({ ...prev, sortBy: e.target.value }));
        }}
      />
      {/* status */}
      <FilterSelect
        items={statusOptions}
        value={filters.couponStatus}
        placeholder="Status"
        tooltip="Status"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setFilters((prev) => ({ ...prev, couponStatus: e.target.value }));
        }}
      />
      {/* add */}
      <Button
        variant="contained"
        color="primary"
        size="small"
        sx={{
          minWidth: 'auto',
          flexShrink: 0,
          gap: 2,
        }}
        startIcon={<Add />}
        onClick={onAdd}
      >
        {' '}
        Add
      </Button>
    </Stack>
  );
}
