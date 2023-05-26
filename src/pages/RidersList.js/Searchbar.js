import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import moment from 'moment';
import { useMemo } from 'react';
import FilterDate from '../../components/Filter/FilterDate';
import FilterSelect from '../../components/Filter/FilterSelect';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';

export default function SearchBar({ searchPlaceHolder, queryParams, setQueryParams, onAdd }) {
  const updateSearch = useMemo(
    () =>
      debounce((e) => {
        setQueryParams((prev) => ({ ...prev, searchKey: e.target.value }));
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
      {/* start date */}
      <FilterDate
        tooltip="Start Date"
        maxDate={moment(queryParams.endDate).subtract(1, 'day')}
        value={queryParams.startDate}
        size="sm"
        onChange={(e) => {
          setQueryParams((prev) => ({
            ...prev,
            startDate: e._d,
          }));
        }}
      />
      {/* end date */}
      <FilterDate
        tooltip="End Date"
        minDate={moment(queryParams.startDate).add(1, 'day')}
        value={queryParams.endDate}
        size="sm"
        onChange={(e) => {
          setQueryParams((prev) => ({
            ...prev,
            endDate: e._d,
          }));
        }}
      />
      {/* sort */}
      <FilterSelect
        items={[]}
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
        items={[]}
        value={queryParams.sortBy}
        placeholder="Status"
        tooltip="Status"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, sortBy: e.target.value }));
        }}
      />
      <Button size="small" variant="contained" onClick={onAdd} startIcon={<Add />}>
        Add
      </Button>
    </Stack>
  );
}
