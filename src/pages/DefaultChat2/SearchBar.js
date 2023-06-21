import { Button, Stack, debounce } from '@mui/material';
import { useMemo } from 'react';

import { Add } from '@mui/icons-material';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';

// eslint-disable-next-line no-unused-vars
export default function SearchBar({ searchPlaceHolder, queryParams, setQueryParams, onAdd }) {
  const updateSearch = useMemo(
    () =>
      debounce((e) => {
        setQueryParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
      }, 300),
    // eslint-disable-next-line prettier/prettier
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
      <Button size="small" variant="contained" onClick={onAdd} startIcon={<Add />}>
        Add
      </Button>
    </Stack>
  );
}
