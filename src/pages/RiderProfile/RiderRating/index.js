import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import SearchBar from '../Flags/Searchbar';
import RatingTable from './RatingTable';

const getMockRating = (length) => {
  const items = [];

  for (let i = 0; i < length; i++) {
    items?.push({
      _id: i,
      status: Math.random() < 0.5,
      orderId: '#455167',
      account: 'Karina Clark',
      type: 'Cash',
      amount: '$40',
      shop: {
        shopName: 'Shop 1',
      },
    });
  }

  return items;
};

export const queryParamsInit = {
  page: 1,
  pageSize: 5,
  sortBy: 'DESC',
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
};

export default function RiderRating() {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });

  return (
    <Box>
      <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} />
      <Grid container spacing={5} pb={7.5}>
        <InfoCard title="Positive" value="25" sm={6} md={4} lg={3} />
        <InfoCard title="Negative" value="5" sm={6} md={4} lg={3} />
        <InfoCard title="Average Rating" value="75%" sm={6} md={4} lg={3} />
      </Grid>
      <RatingTable rows={getMockRating(5)} />
    </Box>
  );
}
