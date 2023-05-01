import { Stack } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import FilterDate from '../../components/Filter/FilterDate';
import FilterSelect from '../../components/Filter/FilterSelect';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { deepClone } from '../../helpers/deepClone';
import { sortOptions } from './helpers';

export default function SearchBar({ searchPlaceHolder, queryParams }) {
  const [localState, setLocalState] = useState(deepClone(queryParams));

  return (
    <Stack direction="row" alignItems="center" gap="20px" pb={6.5}>
      <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        value={localState.searchKey}
        onChange={(e) => {
          setLocalState((prev) => ({ ...prev, searchKey: e.target.value }));
        }}
      />
      {/* start date */}
      <FilterDate
        tooltip="Start Date"
        maxDate={moment(localState.endDate).subtract(1, 'day')}
        value={localState.startDate}
        size="sm"
        onChange={(e) => {
          setLocalState((prev) => ({
            ...prev,
            startDate: e._d,
          }));
        }}
      />
      {/* end date */}
      <FilterDate
        tooltip="End Date"
        minDate={moment(localState.startDate).add(1, 'day')}
        value={localState.endDate}
        size="sm"
        onChange={(e) => {
          setLocalState((prev) => ({
            ...prev,
            endDate: e._d,
          }));
        }}
      />
      {/* sort */}
      <FilterSelect
        items={sortOptions}
        value={localState.sortBy}
        placeholder="Sort"
        tooltip="Sort"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setLocalState((prev) => ({ ...prev, sortBy: e.target.value }));
        }}
      />
    </Stack>
  );
}
