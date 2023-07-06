import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import SearchBar from '../../../../../../components/Common/CommonSearchbar';
import InfoCard from '../../../../../../components/StyledCharts/InfoCard';
import CouponOverviewTable from './Table';

const dummyData = () => {
  const rows = [];
  for (let i = 0; i < 4; i += 1) {
    rows.push({
      couponType: 'Global',
      status: '3/3',
      totalOrders: '8/35',
      orderIncrease: '14%',
      usage: '2.5%',
      amountSpent: '$30',
      _id: i,
    });
  }
  return rows;
};

const queryParamsInit = {
  page: 1,
  pageSize: 20,
  sortBy: 'DESC',
  type: 'ongoing',
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
  status: '',
};

export default function CouponOverview() {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });

  return (
    <Box>
      <Box pb={7.5}>
        <SearchBar
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          showFilters={{
            search: true,
            date: true,
          }}
        />
      </Box>
      <Grid container spacing={5} pb={7.5}>
        <InfoCard title="Amount Spent" value="$ 2551" sm={6} md={2.4} />
        <InfoCard title="Ongoing" value="4/10" sm={6} md={2.4} />
        <InfoCard title="Total Orders" value="5/20" sm={6} md={2.4} />
        <InfoCard title="Order Increase" value="14%" sm={6} md={2.4} />
        <InfoCard title="USAGE" value="4/10" sm={6} md={2.4} />
      </Grid>
      <CouponOverviewTable rows={dummyData()} />
    </Box>
  );
}
