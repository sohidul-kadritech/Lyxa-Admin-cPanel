import { Button, Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import moment from 'moment';
import { useMemo } from 'react';
import FilterDate from '../Filter/FilterDate';
import FilterSelect from '../Filter/FilterSelect';
import StyledSearchBar from '../Styled/StyledSearchBar';

const sortOptions = [
  {
    label: 'Desc',
    value: 'DESC',
  },
  {
    label: 'Asc',
    value: 'ASC',
  },
];

const statusOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
];

export default function SearchBar({
  searchPlaceHolder,
  queryParams,
  setQueryParams,
  hideFilters,
  onButtonClick,
  buttonLabel,
}) {
  const updateSearch = useMemo(
    () =>
      debounce((e) => {
        setQueryParams((prev) => ({ ...prev, searchKey: e.target.value, page: 1 }));
      }, 300),
    []
  );

  return (
    <Stack direction="row" alignItems="center" gap="20px">
      {!hideFilters?.search && (
        <StyledSearchBar
          fullWidth
          placeholder={searchPlaceHolder}
          onChange={(e) => {
            updateSearch(e);
          }}
        />
      )}
      {/* start date */}
      {!hideFilters?.startDate && (
        <FilterDate
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
        />
      )}
      {/* end date */}
      {!hideFilters?.endDate && (
        <FilterDate
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
        />
      )}
      {/* sort */}
      {!hideFilters?.sort && (
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
      {/* status */}
      {!hideFilters?.status && (
        <FilterSelect
          items={statusOptions}
          value={queryParams.status}
          placeholder="Status"
          tooltip="Status"
          size="sm"
          sx={{
            minWidth: 'auto',
          }}
          onChange={(e) => {
            setQueryParams((prev) => ({ ...prev, status: e.target.value, page: 1 }));
          }}
        />
      )}
      {/* button */}
      {!hideFilters?.button && (
        <Button variant="contained" size="small" onClick={onButtonClick}>
          {buttonLabel}
        </Button>
      )}
    </Stack>
  );
}
