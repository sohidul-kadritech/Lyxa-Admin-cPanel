// thrid party
import { Unstable_Grid2 as Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';

// project import
import StyledBox from '../../../../components/StyledCharts/StyledBox';
import * as Api from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import OrderByHoursChart from './Chart';

const tabValueToOrderTypeMap = { 0: 'delivered', 1: 'incomplete' };

export default function OrdersByHour() {
  const [currentTab, setCurrentTab] = useState(0);

  const ordersGraph = useQuery(['order-by-hours', { type: tabValueToOrderTypeMap[currentTab] }], () =>
    AXIOS.get(Api.SHOP_DASHBOARD_ORDER_BY_HOURS, {
      params: { type: tabValueToOrderTypeMap[currentTab] },
    })
  );

  return (
    <Grid xs={12}>
      <StyledBox
        sx={{
          padding: '8px 50px 18px 20px',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" pb={10}>
          <Typography variant="body1" fontWeight={600} pb={5}>
            Orders by Hour
          </Typography>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
            }}
            sx={{
              '& .MuiTab-root': {
                padding: '8px 12px',
                textTransform: 'none',
              },
            }}
          >
            <Tab label="Delivered" />
            <Tab label="Incomplete" />
          </Tabs>
        </Stack>
        <OrderByHoursChart hourlyOrders={ordersGraph?.data?.data?.hourlyOrders} />
      </StyledBox>
    </Grid>
  );
}
