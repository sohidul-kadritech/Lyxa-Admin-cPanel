/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Box, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { useQuery } from 'react-query';
import { useGlobalContext } from '../../../context';
import IncreaseDecreaseTag from '../../StyledCharts/IncrementDecrementTag';

import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { convertDate } from '../../../pages/LyxaFinancials/OrderFinancials';
import { dateRangeItit } from '../../../pages/Marketing/Dashbaord/helpers';
import { calculateDateDifference } from '../../../pages/ShopDashboard/helper';
import InfoCard from '../../StyledCharts/InfoCard';
import RiderPayoutDetails from './RiderPayoutDetails';

function RiderPayoutBreakDown({ showFor, riderParams = { ...dateRangeItit } }) {
  const { general } = useGlobalContext();

  const currency = general?.currency?.symbol;

  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;

  const getFinancialsDashBoardRider = useQuery(
    [
      API_URL.GET_ADMIN_RIDER_FINANCIALS_PROFITBREAKDOWN,
      { ...riderParams, startDate: riderParams?.start, endDate: riderParams?.end },
    ],
    () =>
      AXIOS.get(API_URL.GET_ADMIN_RIDER_FINANCIALS_PROFITBREAKDOWN, {
        params: {
          startDate: convertDate(riderParams?.start),
          endDate: convertDate(riderParams?.end),
          ...riderParams,
        },
      }),
  );

  const summary = getFinancialsDashBoardRider?.data?.data;

  const deliveryProfitBreakDown = summary?.profitBreakdown;

  console.log('summary rider ', summary);
  return (
    <Box mt={7.5}>
      <Grid container spacing={7.5}>
        <Grid item sm={6} md={4} lg={4}>
          <InfoCard
            title="Total Lyxa Delivery Profit"
            valueComponent={
              <Stack direction="column" alignItems="baseline" gap={2}>
                <Typography
                  variant="h2"
                  sx={{
                    lineHeight: '24px',
                    fontSize: `${showFor === 'specific' ? '28px !important' : '40px !important'}`,
                  }}
                >
                  {secondaryCurrency} {Math.round(deliveryProfitBreakDown?.adminDeliveryProfit || 0)}
                </Typography>

                {deliveryProfitBreakDown?.secondaryCurrency_adminDeliveryProfit ? (
                  <Typography
                    variant="inherit"
                    sx={{
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    {0}
                  </Typography>
                ) : null}
              </Stack>
            }
            Tag={
              <IncreaseDecreaseTag
                status={summary?.adminDeliveryProfitAvgInPercentage >= 0 ? 'increase' : 'minus'}
                amount={`${Math.round(
                  Math.abs(summary?.adminDeliveryProfitAvgInPercentage) || 0,
                )}% last ${calculateDateDifference(riderParams.start, riderParams.end, 'day')} days`}
              />
            }
            sm={6}
            md={4}
            lg={4}
          />
        </Grid>

        <Grid item sm={6} md={4} lg={4}>
          <InfoCard
            title="Total Orders"
            value={summary?.totalDeliveredOrder || 0}
            valueSx={{ fontSize: `${showFor === 'specific' ? '28px !important' : '40px !important'}` }}
            Tag={
              <IncreaseDecreaseTag
                status={summary?.totalDeliveredOrderAvgInPercentage >= 0 ? 'increase' : 'minus'}
                amount={`${Math.round(
                  Math.abs(summary?.totalDeliveredOrderAvgInPercentage) || 0,
                )}% last ${calculateDateDifference(riderParams.start, riderParams.end, 'day')} days`}
              />
            }
            sm={6}
            md={4}
            lg={4}
          />
        </Grid>

        {/* riders payout menas including butler and normal order
         , rider cuts means excluding butler only normal order includes */}

        <Grid item sm={6} md={4} lg={4}>
          <InfoCard
            title="Total Riders Payouts"
            valueSx={{ fontSize: `${showFor === 'specific' ? '28px !important' : '40px !important'}` }}
            Tag={
              <IncreaseDecreaseTag
                status={summary?.riderPayoutAvgInPercentage >= 0 ? 'increase' : 'minus'}
                amount={`${Math.round(
                  Math.abs(summary?.riderPayoutAvgInPercentage) || 0,
                )}% last ${calculateDateDifference(riderParams.start, riderParams.end, 'day')} days`}
              />
            }
            value={`${secondaryCurrency} ${Math.round(deliveryProfitBreakDown?.riderPayout || 0)}`}
            sm={6}
            md={4}
            lg={4}
          />
        </Grid>

        <Grid item xs={12} mb={7.5}>
          <RiderPayoutDetails deliveryProfitBreakDown={deliveryProfitBreakDown} />
        </Grid>
        {/* <Grid item xs={12}>
          <OrderPayoutDetailsTable showFor="delivery" shopType={shopType} riderParams={riderParams} />
        </Grid> */}
      </Grid>
    </Box>
  );
}

export default RiderPayoutBreakDown;
