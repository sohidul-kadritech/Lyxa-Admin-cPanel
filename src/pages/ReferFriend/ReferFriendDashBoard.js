import { Box, Grid } from '@mui/material';
import React from 'react';
import InfoCard from '../../components/StyledCharts/InfoCard';

function ReferFriendDashBoard({ summery }) {
  console.log('summery', summery);
  const currency = { symbol: '$' };
  return (
    <Box>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 2.25, sm: 3.25, md: 6.5 }}>
        <Grid item xs={6} md={4}>
          <InfoCard
            title="Total amount spent"
            value={`${currency?.symbol} ${summery?.totalAmountSpent || 0}`}
            sm={6}
            md={6}
            lg={6}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <InfoCard
            title="Conversion Rate"
            value={`${(summery?.conversionRate || 0).toFixed(2)}%`}
            sm={6}
            md={6}
            lg={6}
          />
        </Grid>

        <Grid item xs={6} md={4}>
          <InfoCard
            title="Customer Increase"
            value={`${(summery?.customerIncrease || 0).toFixed(2)}%`}
            sm={6}
            md={6}
            lg={6}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReferFriendDashBoard;
