import { Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import { useMemo } from 'react';
import FilterSelect from '../../components/Filter/FilterSelect';
import StyledDateRangePicker from '../../components/Styled/StyledDateRangePicker';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { sortOptions } from './helpers';

export default function SearchBar({ searchPlaceHolder, queryParams, setQueryParams }) {
  const updateSearch = useMemo(
    () =>
      debounce((e) => {
        setQueryParams((prev) => ({ ...prev, searchKey: e.target.value, page: 1 }));
      }, 300),
    []
  );

  return (
    <Stack direction="row" alignItems="center" gap="20px" pb={6.5}>
      <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        onChange={(e) => {
          updateSearch(e);
        }}
      />
      <StyledDateRangePicker
        startDate={queryParams.startDate}
        endDate={queryParams.endDate}
        onChange={({ startDate, endDate }) => {
          setQueryParams((prev) => ({
            ...prev,
            startDate: startDate?._d,
            endDate: endDate?._d,
            page: 1,
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
          setQueryParams((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }));
        }}
      />
    </Stack>
  );
}
