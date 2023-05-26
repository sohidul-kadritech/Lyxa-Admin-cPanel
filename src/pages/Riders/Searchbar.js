import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { debounce } from '@mui/material/utils';
import { useMemo } from 'react';
import FilterSelect from '../../components/Filter/FilterSelect';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { riderLiveStatusOptions, riderStatusOptions } from './helper';

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
      {/* Live Status */}
      <FilterSelect
        items={riderLiveStatusOptions}
        value={queryParams.liveStatus}
        placeholder="Live Status"
        tooltip="Live Status"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, liveStatus: e.target.value }));
        }}
      />
      {/* status */}
      <FilterSelect
        items={riderStatusOptions}
        value={queryParams.status}
        placeholder="Status"
        tooltip="Status"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setQueryParams((prev) => ({ ...prev, status: e.target.value }));
        }}
      />
      <Button size="small" variant="contained" onClick={onAdd} startIcon={<Add />}>
        Add
      </Button>
    </Stack>
  );
}
