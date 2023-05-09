/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FilterSelect from '../../components/Filter/FilterSelect';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { deepClone } from '../../helpers/deepClone';
import { Throttler } from '../../helpers/throttle';

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
  const Throttle = new Throttler(300);
  const [localValue, setLocalValue] = useState(deepClone(filtersValue));

  useEffect(() => {
    Throttle.exec(() => {
      setFiltersValue(deepClone(localValue));
    });
  }, [localValue]);

  return (
    <Stack direction="row" alignItems="center" gap="20px" pb={6.5}>
      <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        value={localValue.searchKey}
        onChange={(e) => {
          setLocalValue((prev) => ({ ...prev, searchKey: e.target.value }));
        }}
      />
      {/* start date */}
      {/* <FilterDate
        tooltip="Start Date"
        maxDate={moment(localValue.date.end).subtract(1, 'day')}
        value={localValue.date.start}
        size="sm"
        onChange={(e) => {
          setLocalValue((prev) => ({
            ...prev,
            date: {
              ...prev.date,
              start: e._d,
            },
          }));
        }}
      /> */}
      {/* end date */}
      {/* <FilterDate
        tooltip="End Date"
        minDate={moment(localValue.date.start).add(1, 'day')}
        value={localValue.date.end}
        size="sm"
        onChange={(e) => {
          setLocalValue((prev) => ({
            ...prev,
            date: {
              ...prev.date,
              end: e._d,
            },
          }));
        }}
      /> */}
      {/* end date */}
      <FilterSelect
        items={listFilterOptions}
        value={localValue.status}
        placeholder="Status"
        tooltip="Status"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setLocalValue((prev) => ({ ...prev, status: e.target.value }));
        }}
      />
    </Stack>
  );
}
