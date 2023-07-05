import { Box, Button, Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import moment from 'moment';
import { useMemo } from 'react';
import FilterDate from '../Filter/FilterDate';
import FilterSelect from '../Filter/FilterSelect';
import StyledSearchBar from '../Styled/StyledSearchBar';
import ThreeDotsMenu from '../ThreeDotsMenu2';

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
  showFilters,
  onButtonClick,
  buttonLabel,
  menuHandler,
  menuItems,
  MenuButton,
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
      {showFilters?.search && (
        <StyledSearchBar
          fullWidth
          placeholder={searchPlaceHolder}
          onChange={(e) => {
            updateSearch(e);
          }}
        />
      )}
      {/* start date */}
      {showFilters?.date && (
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
      {showFilters?.date && (
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
      {showFilters?.sort && (
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
      {showFilters?.status && (
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
      {showFilters?.button && (
        <Box flexShrink={0}>
          <Button variant="contained" size="small" onClick={onButtonClick}>
            {buttonLabel}
          </Button>
        </Box>
      )}
      {/* menu */}
      {showFilters?.menu && (
        <ThreeDotsMenu handleMenuClick={menuHandler} menuItems={menuItems} ButtonComponent={MenuButton} />
      )}
    </Stack>
  );
}
