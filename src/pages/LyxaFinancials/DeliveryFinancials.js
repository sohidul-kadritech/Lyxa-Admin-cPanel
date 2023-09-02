import { Box, Grid, Stack } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import DateRange from '../../components/StyledCharts/DateRange';

import PriceItem from '../../components/Shared/FinancialsOverview/PriceItem';
import { dateRangeItit } from '../../components/Shared/FinancialsOverview/helpers';
import IncreaseDecreaseTag from '../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../components/StyledCharts/InfoCard';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';

import { useGlobalContext } from '../../context';
import DeliveryPayoutDetails from './DeliveryPayoutDetails';
import OrderPayoutDetailsTable from './OrderPayoutDetailsTable';

const convertDate = (date) => moment(date).format('YYYY-MM-DD');

function DeliveryFinancials({ shopType }) {
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const getFinancialsDashBoardDelivery = useQuery(
    [
      API_URL.GET_ADMIN_DELIVERY_FINANCIALS_DASHBOARD,
      { startDate: paymentDetailsRange?.start, endDate: paymentDetailsRange?.end, orderType: shopType },
    ],
    () =>
      AXIOS.get(API_URL.GET_ADMIN_DELIVERY_FINANCIALS_DASHBOARD, {
        params: {
          startDate: convertDate(paymentDetailsRange?.start),
          endDate: convertDate(paymentDetailsRange?.end),
          orderType: shopType,
        },
        // eslint-disable-next-line prettier/prettier
      }),
  );

  console.log('getFinancialsDashBoard for delivery', getFinancialsDashBoardDelivery?.data?.data);
  const summary = getFinancialsDashBoardDelivery?.data?.data;
  const deliveryProfitBreakDown = summary?.profitBreakdown;
  return (
    <Box>
      <Grid container spacing={7.5}>
        <Grid xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
            <DateRange setRange={setPaymentDetailsRange} range={paymentDetailsRange} />
          </Stack>
        </Grid>
        <Grid item xs={6} md={4}>
          <InfoCard
            title="Total Delivery Profit"
            value={`${currency} ${(deliveryProfitBreakDown?.adminDeliveryProfit || 0).toFixed(2)}`}
            Tag={
              <IncreaseDecreaseTag
                status="increase"
                amount={`${summary?.adminDeliveryProfitAvgInPercentage}% last ${0}`}
              />
            }
            sm={6}
            md={4}
            lg={4}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <InfoCard
            title="Total Orders"
            value={summary?.totalDeliveredOrder || 0}
            Tag={
              <IncreaseDecreaseTag
                status="increase"
                amount={`${summary?.totalDeliveredOrderAvgInPercentage}% last ${0}`}
              />
            }
            sm={6}
            md={4}
            lg={4}
          />
        </Grid>

        <Grid item xs={6} md={4}>
          <InfoCard
            title="Total Riders Payouts"
            Tag={<IncreaseDecreaseTag status="increase" amount={`${summary?.riderPayoutAvgInPercentage}% last ${0}`} />}
            value={`${currency} ${(deliveryProfitBreakDown?.riderPayout || 0).toFixed(2)}`}
            sm={6}
            md={4}
            lg={4}
          >
            <Stack gap={3}>
              <PriceItem title="Discount" amount={0} showIfZero />
              <PriceItem title="Buy 1 Get 1" amount={0} showIfZero />
              <PriceItem title="Loyalty points" amount={0} showIfZero />
              <PriceItem title="Free delivery" amount={0} showIfZero />
            </Stack>
          </InfoCard>
        </Grid>

        <Grid item xs={12} mb={7.5}>
          <DeliveryPayoutDetails deliveryProfitBreakDown={deliveryProfitBreakDown} />
        </Grid>
        <Grid item xs={12}>
          <OrderPayoutDetailsTable showFor="delivery" />
        </Grid>
      </Grid>
    </Box>
  );
}

export default DeliveryFinancials;
