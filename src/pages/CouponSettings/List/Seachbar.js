import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import React from 'react';
import FilterSelect from '../../../components/Filter/FilterSelect';
import StyledDateRangePicker from '../../../components/Styled/StyledDateRangePicker';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';
import { sortOptions, statusOptions } from '../helpers';

export default function Searchbar({ queryParams, setQueryParams, searchPlaceHolder, onAdd }) {
  return (
    <Stack direction="row" alignItems="center" gap="20px" pb={6.5}>
      <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        value={queryParams.searchKey}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, searchKey: e.target.value }));
        }}
      />
      {/* <FilterDate
        tooltip="Start Date"
        maxDate={moment(queryParams.date.end).subtract(1, 'day')}
        value={queryParams.date.start}
        size="sm"
        onChange={(e) => {
          setQueryParams((prev) => ({
            ...prev,
            date: {
              ...prev.date,
              start: e._d,
            },
          }));
        }}
      />
      <FilterDate
        tooltip="End Date"
        minDate={moment(queryParams.date.start).add(1, 'day')}
        value={queryParams.date.end}
        size="sm"
        onChange={(e) => {
          setQueryParams((prev) => ({
            ...prev,
            date: {
              ...prev.date,
              end: e._d,
            },
          }));
        }}
      /> */}
      <StyledDateRangePicker
        startDate={queryParams.startDate}
        endDate={queryParams.endDate}
        onChange={({ startDate, endDate }) => {
          setQueryParams((prev) => ({
            ...prev,
            startDate: startDate?._d,
            endDate: endDate?._d,
          }));
        }}
      />
      {/* sort */}
      <FilterSelect
        items={sortOptions}
        value={queryParams.sortBy}
        placeholder="Sort"
        tooltip="Sort"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, sortBy: e.target.value }));
        }}
      />
      {/* status */}
      <FilterSelect
        items={statusOptions}
        value={queryParams.couponStatus}
        placeholder="Status"
        tooltip="Status"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, couponStatus: e.target.value }));
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
