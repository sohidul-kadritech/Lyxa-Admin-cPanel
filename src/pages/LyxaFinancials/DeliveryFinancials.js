/* eslint-disable prettier/prettier */
import { Box, Grid, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import DateRange from '../../components/StyledCharts/DateRange';

import { dateRangeItit, getTotalProfitForLyxa } from '../../components/Shared/FinancialsOverview/helpers';
import IncreaseDecreaseTag from '../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../components/StyledCharts/InfoCard';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';

import { useGlobalContext } from '../../context';
import { calculateDateDifference } from '../ShopDashboard/helper';
import DeliveryPayoutDetails from './DeliveryPayoutDetails';
import OrderPayoutDetailsTable from './OrderPayoutDetailsTable';
import { modifiedProfitBreakDownDataForSecondaryCurrency } from './helpers';

const convertDate = (date) => moment(date).format('YYYY-MM-DD');

function DeliveryFinancials({ shopType }) {
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });

  const { general } = useGlobalContext();

  const currency = general?.currency?.symbol;

  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;

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
      }),
  );

  const summary = getFinancialsDashBoardDelivery?.data?.data;
  const deliveryProfitBreakDown = summary?.profitBreakdown;
  return (
    <Box mt={7.5}>
      <Grid container spacing={7.5}>
        <Grid xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
            <DateRange setRange={setPaymentDetailsRange} range={paymentDetailsRange} />
          </Stack>
        </Grid>
        <Grid item xs={6} md={4}>
          <InfoCard
            title="Total Delivery Profit"
            // value={`${currency} ${(deliveryProfitBreakDown?.adminDeliveryProfit || 0).toFixed(2)}`}
            valueComponent={
              <Stack direction="column" alignItems="baseline" gap={2}>
                <Typography
                  variant="h2"
                  sx={{
                    lineHeight: '24px',
                    fontSize: '40px',
                  }}
                >
                  {currency} {(deliveryProfitBreakDown?.totalAdminProfit || 0).toFixed(2)}
                </Typography>

                {deliveryProfitBreakDown?.secondaryCurrency_adminDeliveryProfit ? (
                  <Typography
                    variant="inherit"
                    sx={{
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    {
                      getTotalProfitForLyxa(
                        currency,
                        secondaryCurrency,
                        modifiedProfitBreakDownDataForSecondaryCurrency(deliveryProfitBreakDown, 'delivery'),
                        true,
                      ).printConditionally
                    }
                  </Typography>
                ) : null}
              </Stack>
            }
            Tag={
              <IncreaseDecreaseTag
                status={summary?.adminDeliveryProfitAvgInPercentage >= 0 ? 'increase' : 'minus'}
                amount={`${Math.round(
                  Math.abs(summary?.adminDeliveryProfitAvgInPercentage) || 0,
                )}% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')} days`}
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
                status={summary?.totalDeliveredOrderAvgInPercentage >= 0 ? 'increase' : 'minus'}
                amount={`${Math.round(
                  Math.abs(summary?.totalDeliveredOrderAvgInPercentage) || 0,
                )}% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')} days`}
              />
            }
            sm={6}
            md={4}
            lg={4}
          />
        </Grid>

        <Grid item xs={6} md={4}>
          <InfoCard
            title="Total Riders Cuts"
            Tag={
              <IncreaseDecreaseTag
                status={summary?.riderPayoutAvgInPercentage >= 0 ? 'increase' : 'minus'}
                amount={`${Math.round(
                  Math.abs(summary?.riderPayoutAvgInPercentage) || 0,
                )}% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')} days`}
              />
            }
            value={`${currency} ${(deliveryProfitBreakDown?.riderPayout || 0).toFixed(2)}`}
            sm={6}
            md={4}
            lg={4}
          />
        </Grid>

        <Grid item xs={12} mb={7.5}>
          <DeliveryPayoutDetails deliveryProfitBreakDown={deliveryProfitBreakDown} />
        </Grid>
        <Grid item xs={12}>
          <OrderPayoutDetailsTable showFor="delivery" shopType={shopType} paymentDetailsRange={paymentDetailsRange} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default DeliveryFinancials;
