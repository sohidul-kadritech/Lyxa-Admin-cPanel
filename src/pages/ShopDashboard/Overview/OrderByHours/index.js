/* eslint-disable prettier/prettier */
// thrid party
import { Unstable_Grid2 as Grid, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';

// project import
import { TitleWithToolTip } from '../../../../components/Common/TitleWithToolTip';
import StyledBox from '../../../../components/StyledCharts/StyledBox';
import { useGlobalContext } from '../../../../context';
import * as Api from '../../../../network/Api';
import AXIOS from '../../../../network/axios';
import OrderByHoursChart from './Chart';

const tabValueToOrderTypeMap = { 0: 'delivered', 1: 'incomplete' };
let utcDiff = new Date().getTimezoneOffset() / 60;
utcDiff = utcDiff < 0 ? Math.abs(utcDiff) : utcDiff;

export default function OrdersByHour() {
  const [currentTab, setCurrentTab] = useState(0);
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;
  const ordersGraph = useQuery(
    [
      Api.SHOP_DASHBOARD_ORDER_BY_HOURS,
      { type: tabValueToOrderTypeMap[currentTab], shopId: shop?._id, timeZone: utcDiff },
    ],
    () =>
      AXIOS.get(Api.SHOP_DASHBOARD_ORDER_BY_HOURS, {
        params: { type: tabValueToOrderTypeMap[currentTab], shopId: shop?._id, timeZone: utcDiff },
      }),
  );

  console.log('time zone', { timeOffset: new Date().getTimezoneOffset(), utcDiff });
  console.log('orders-by-hours', ordersGraph?.data?.data?.hourlyOrders);

  return (
    <Grid xs={12}>
      <StyledBox
        sx={{
          padding: '8px 50px 18px 20px',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" pb={10}>
          <TitleWithToolTip
            title="Orders by Hour"
            tooltip="These graphs show daily order deliveries 24/7, 
            helping us find the best times and days for selling. 
            This is the complete order report from start to now, not just a weekly summary."
            sx={{ fontSize: '16px!important' }}
          />
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
