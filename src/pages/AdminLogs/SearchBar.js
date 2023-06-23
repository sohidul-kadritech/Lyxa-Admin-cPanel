import { Stack, debounce } from '@mui/material';
import { useMemo } from 'react';
import FilterSelect from '../../components/Filter/FilterSelect';

import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import DateRange from '../../components/StyledCharts/DateRange';
import { sortOptions } from '../Faq2/helpers';
import { adminLogTypeOptions } from './helpers';

export default function SearchBar({ searchPlaceHolder, queryParams, setQueryParams }) {
  const updateSearch = useMemo(
    () =>
      debounce((e) => {
        setQueryParams((prev) => ({ ...prev, searchKey: e.target.value, page: 1 }));
      }, 300),
    // eslint-disable-next-line prettier/prettier
    [],
  );

  // const [range, setRange] = useState({ ...dateRangeInit });

  return (
    <Stack direction="row" alignItems="center" gap="20px" pb={6.5}>
      <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        onChange={(e) => {
          updateSearch(e);
        }}
      />

      <DateRange range={queryParams} startKey="startDate" endKey="endDate" setRange={setQueryParams} />

      {/* sort */}
      <FilterSelect
        items={sortOptions}
        value={queryParams.sortBy}
        placeholder="sortBy"
        tooltip="Sorting Order"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }));
        }}
      />
      {/* status */}
      <FilterSelect
        items={adminLogTypeOptions}
        value={queryParams.type}
        placeholder="Type"
        tooltip="Admin Logs Type"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, type: e.target.value, page: 1 }));
        }}
      />
    </Stack>
  );
}
