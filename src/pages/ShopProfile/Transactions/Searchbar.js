import { Box, Button, Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import moment from 'moment';
import { useMemo } from 'react';
import FilterDate from '../../../components/Filter/FilterDate';
import FilterSelect from '../../../components/Filter/FilterSelect';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';
import { useGlobalContext } from '../../../context';

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

export default function SearchBar({ searchPlaceHolder, queryParams, setQueryParams, onAddRemove }) {
  const { currentUser } = useGlobalContext();
  // const [render, setRender] = useState(false);

  const updateSearch = useMemo(
    () =>
      debounce((e) => {
        setQueryParams((prev) => ({ ...prev, searchKey: e.target.value, page: 1 }));
      }, 300),
    []
  );

  return (
    <Stack direction="row" alignItems="center" gap="20px">
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
        maxDate={moment(queryParams.tnxFilter.endDate).subtract(1, 'day')}
        value={queryParams.tnxFilter.startDate}
        size="sm"
        onChange={(e) => {
          setQueryParams((prev) => ({
            ...prev,
            page: 1,
            tnxFilter: {
              ...prev.tnxFilter,
              startDate: e._d,
            },
          }));
        }}
      />
      {/* end date */}
      <FilterDate
        tooltip="End Date"
        minDate={moment(queryParams.tnxFilter.startDate).add(1, 'day')}
        value={queryParams.tnxFilter.endDate}
        size="sm"
        onChange={(e) => {
          setQueryParams((prev) => ({
            ...prev,
            page: 1,
            tnxFilter: {
              ...prev.tnxFilter,
              endDate: e._d,
            },
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
      {currentUser?.userType === 'admin' && (
        <Box flexShrink={0}>
          <Button variant="contained" size="small" color="primary" onClick={onAddRemove}>
            Add/Remove Credit
          </Button>
        </Box>
      )}
    </Stack>
  );
}
