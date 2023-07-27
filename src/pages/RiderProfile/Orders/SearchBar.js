import { Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import { useMemo } from 'react';
import FilterSelect from '../../../components/Filter/FilterSelect';
import StyledDateRangePicker from '../../../components/Styled/StyledDateRangePicker';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';

export const sortOptions = [
  {
    label: 'Desc',
    value: 'DESC',
  },
  {
    label: 'Asc',
    value: 'ASC',
  },
];

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
            startDate,
            endDate,
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
