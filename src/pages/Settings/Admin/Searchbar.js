import { Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import { useMemo } from 'react';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';

export default function SearchBar({ setSearchKey }) {
  const updateSearch = useMemo(
    () =>
      debounce((e) => {
        setSearchKey(e.target.value);
      }, 100),
    []
  );

  return (
    <Stack direction="row" alignItems="center" gap="20px" pb={6.5}>
      <StyledSearchBar
        fullWidth
        placeholder="Search pages"
        onChange={(e) => {
          updateSearch(e);
        }}
      />
    </Stack>
  );
}
