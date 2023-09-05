/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Box, Grid, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import PriceItem from '../../../components/Shared/FinancialsOverview/PriceItem';
import IncreaseDecreaseTag from '../../../components/StyledCharts/IncrementDecrementTag';
import { useGlobalContext } from '../../../context';
import DeliveryPayoutDetails from '../../LyxaFinancials/DeliveryPayoutDetails';

import InfoCard from '../../../components/StyledCharts/InfoCard';
import { dateRangeItit } from '../../Marketing/Dashbaord/helpers';
import { calculateDateDifference } from '../../ShopDashboard/helper';

function RiderPayoutBreakDown({ showFor }) {
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;

  const summary = {};
  const deliveryProfitBreakDown = {};
  return (
    <Box mt={7.5}>
      <Grid container spacing={7.5}>
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
              )}% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')} days`}
            />
          }
          sm={6}
          md={4}
          lg={4}
        />

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
        >
          <Stack gap={3}>
            <PriceItem title="Discount" amount={0} showIfZero />
            <PriceItem title="Buy 1 Get 1" amount={0} showIfZero />
            <PriceItem title="Loyalty points" amount={0} showIfZero />
            <PriceItem title="Free delivery" amount={0} showIfZero />
          </Stack>
        </InfoCard>

        <Grid xs={12} mb={7.5}>
          <DeliveryPayoutDetails deliveryProfitBreakDown={deliveryProfitBreakDown} />
        </Grid>
        {/* <Grid item xs={12}>
          <OrderPayoutDetailsTable showFor="delivery" shopType={shopType} paymentDetailsRange={paymentDetailsRange} />
        </Grid> */}
      </Grid>
    </Box>
  );
}

export default RiderPayoutBreakDown;
