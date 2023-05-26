import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import RidersTable from './RiderTable';
import SearchBar from './Searchbar';
import { queryParamsInit } from './helper';
import { getMockRiders } from './mock';

export default function RiderList() {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });

  return (
    <Box pt={9} pb={10}>
      <Typography variant="h4" pb={10}>
        Riders
      </Typography>
      <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} searchPlaceHolder="Search 24 items" />
      <RidersTable rows={getMockRiders(10)} />
    </Box>
  );
}
