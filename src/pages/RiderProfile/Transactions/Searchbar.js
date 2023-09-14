/* eslint-disable prettier/prettier */
import { Box, Button, Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import { useMemo } from 'react';
import FilterSelect from '../../../components/Filter/FilterSelect';
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

export default function SearchBar({
  searchPlaceHolder,
  queryParams,
  setQueryParams,
  onMakePayment,
  showFor,
  onReceiveCash,
  loading,
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
      <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        onChange={(e) => {
          updateSearch(e);
        }}
      />
      {/* start date */}
      {/* <FilterDate
        tooltip="Start Date"
        maxDate={moment(queryParams.endDate).subtract(1, 'day')}
        value={queryParams.startDate}
        size="sm"
        onChange={(e) => {
          setQueryParams((prev) => ({
            ...prev,
            startDate: e._d,
            page: 1,
          }));
        }}
      /> */}
      {/* end date */}
      {/* <FilterDate
        tooltip="End Date"
        minDate={moment(queryParams.startDate).add(1, 'day')}
        value={queryParams.endDate}
        size="sm"
        onChange={(e) => {
          setQueryParams((prev) => ({
            ...prev,
            endDate: e._d,
            page: 1,
          }));
        }}
      /> */}
      {/* <StyledDateRangePicker
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
      /> */}
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
      {/* make payment */}
      <Box flexShrink={0}>
        {showFor === 'cashOrderList' && (
          <Button size="small" variant="contained" onClick={onReceiveCash} disabled={loading}>
            Receive Cash
          </Button>
        )}
        {showFor === 'transactions' && (
          <Button size="small" variant="contained" onClick={onMakePayment}>
            Make Payment
          </Button>
        )}
      </Box>
    </Stack>
  );
}
