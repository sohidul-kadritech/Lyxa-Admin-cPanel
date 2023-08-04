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
          setLocalValue((prev) => ({ ...prev, searchKey: e.target.value, page: 1 }));
        }}
      />
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
          setLocalValue((prev) => ({ ...prev, status: e.target.value, page: 1 }));
        }}
      />
    </Stack>
  );
}
