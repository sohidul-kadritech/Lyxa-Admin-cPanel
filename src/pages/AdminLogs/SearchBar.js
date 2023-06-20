import { Stack } from '@mui/material';
import FilterSelect from '../../components/Filter/FilterSelect';

import { adminLogTypeOptions } from './helpers';

// eslint-disable-next-line no-unused-vars
export default function SearchBar({ searchPlaceHolder, queryParams, setQueryParams }) {
  //   const updateSearch = useMemo(
  //     () =>
  //       debounce((e) => {
  //         setQueryParams((prev) => ({ ...prev, searchKey: e.target.value, page: 1 }));
  //       }, 300),
  //     // eslint-disable-next-line prettier/prettier
  //     [],
  //   );

  return (
    <Stack direction="row" alignItems="center" gap="20px" pb={6.5}>
      {/* <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        onChange={(e) => {
          updateSearch(e);
        }}
      /> */}

      {/* sort */}
      {/* <FilterSelect
        items={statusTypeOptions}
        value={queryParams.status}
        placeholder="sortBy"
        tooltip="Sorting Order"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, status: e.target.value, page: 1 }));
        }}
      /> */}
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
