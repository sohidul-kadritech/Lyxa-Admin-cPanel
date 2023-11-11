/* eslint-disable prettier/prettier */
import { Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import moment from 'moment';
import { useMemo } from 'react';
import FilterSelect from '../../components/Filter/FilterSelect';
import StyledDateRangePicker from '../../components/Styled/StyledDateRangePicker';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { sortOptions } from './helpers';

export default function SearchBar({
  searchPlaceHolder,
  queryParams,
  setQueryParams,
  showFilter = { search: true, date: true, sort: true },
}) {
  const updateSearch = useMemo(
    () =>
      debounce((e) => {
        setQueryParams((prev) => ({ ...prev, searchKey: e.target.value, page: 1 }));
      }, 300),
    [],
  );

  return (
    <Stack direction="row" alignItems="center" gap="20px" pb={6.5}>
      {showFilter?.search && (
        <StyledSearchBar
          fullWidth
          placeholder={searchPlaceHolder}
          onChange={(e) => {
            updateSearch(e);
          }}
        />
      )}

      {showFilter?.date && (
        <StyledDateRangePicker
          startDate={queryParams?.startDate === 'null' ? null : moment(queryParams?.startDate)}
          endDate={queryParams?.endDate === 'null' ? null : moment(queryParams?.endDate)}
          onChange={({ startDate, endDate }) => {
            setQueryParams((prev) => ({
              ...prev,
              startDate: startDate?.format('YYYY-MM-DD'),
              endDate: endDate?.format('YYYY-MM-DD'),
              page: 1,
            }));
          }}
        />
      )}

      {/* sort */}
      {showFilter?.sort && (
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
            setQueryParams((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }));
          }}
        />
      )}
    </Stack>
  );
}
