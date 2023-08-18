/* eslint-disable no-unused-vars */
import { Add } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import React from 'react';
import FilterSelect from '../../components/Filter/FilterSelect';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { useGlobalContext } from '../../context';

const listFilterOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
];

// user?._id === credentialUserId

export default function SearchBar({ filters = {}, setFilters, searchPlaceHolder, onAdd }) {
  const { currentUser } = useGlobalContext();
  const { userType, seller } = currentUser;

  return (
    <Stack direction="row" alignItems="center" gap="20px">
      <StyledSearchBar
        fullWidth
        placeholder={searchPlaceHolder}
        value={filters.searchKey}
        onChange={(e) => {
          setFilters((prev) => ({ ...prev, searchKey: e.target.value }));
        }}
      />
      <FilterSelect
        items={listFilterOptions}
        value={filters.status}
        placeholder="Status"
        tooltip="Status"
        size="sm"
        sx={{
          minWidth: 'auto',
        }}
        onChange={(e) => {
          setFilters((prev) => ({ ...prev, status: e.target.value }));
        }}
      />
      {/* hidden for seller credential user */}
      {(userType === 'admin' || (userType === 'seller' && seller?._id === seller?.credentialUserId)) && (
        <Button size="small" variant="contained" onClick={onAdd} startIcon={<Add />}>
          Add
        </Button>
      )}
    </Stack>
  );
}
