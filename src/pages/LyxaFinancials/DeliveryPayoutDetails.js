/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { Box, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context';

import DetailsAccordion from '../../components/Shared/FinancialsOverview/DetailsAccordion';
import PriceItem from '../../components/Shared/FinancialsOverview/PriceItem';
import { getTotalProfitForLyxa } from '../../components/Shared/FinancialsOverview/helpers';
import StyledBox from '../../components/StyledCharts/StyledBox';
import { bothCurrencyProfitbreakDown } from './helpers';

function DeliveryPayoutDetails({ showFor, deliveryProfitBreakDown = {} }) {
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;

  console.log('deliveryProfitBreakDown', deliveryProfitBreakDown);

  const totalFreeDelivery =
    deliveryProfitBreakDown?.freeDeliveryByShop || 0 + deliveryProfitBreakDown?.freeDeliveryByAdmin;

  const totalProfit = getTotalProfitForLyxa(
    currency,
    secondaryCurrency,
    bothCurrencyProfitbreakDown(deliveryProfitBreakDown, 'delivery'),
    false,
  );

  return (
    <Grid xs={12}>
      <StyledBox
        padding
        sx={{
          paddingBottom: '4px',
        }}
      >
        <Typography variant="body1" fontWeight={600} pb={2}>
          Profit Breakdown
        </Typography>
        <Typography variant="body4" color="#737373">
          Expected profit is scheduled on {moment().endOf('week').calendar()}. Usually, payments deposit in 1-3 business
          days, but the exact time may vary based on your bank.
        </Typography>
        <Box pt={2.5}>
          {/* order amount */}

          <DetailsAccordion
            title="Total Delivery Fee"
            titleAmount={deliveryProfitBreakDown?.totalDeliveryFee}
            isOpen={currentExpanedTab === 0}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 0 : -1);
            }}
          >
            <PriceItem title="Delivery Fees" amount={deliveryProfitBreakDown?.users} showIfZero />
            <PriceItem title="Free Delivery by Shops" amount={deliveryProfitBreakDown?.freeDeliveryByShop} showIfZero />
            <PriceItem title="Free Delivery by Lyxa" amount={deliveryProfitBreakDown?.freeDeliveryByAdmin} showIfZero />
          </DetailsAccordion>

          {/* shop cut */}

          <DetailsAccordion
            title="Riders Cuts"
            titleAmount={deliveryProfitBreakDown?.riderPayout}
            titleAmountStatus="minus"
          />
          <DetailsAccordion
            title="Free Delivery by Lyxa"
            titleAmount={deliveryProfitBreakDown?.freeDeliveryByAdmin}
            titleAmountStatus="minus"
          />
          <DetailsAccordion
            title="Delivery refund"
            titleAmount={deliveryProfitBreakDown?.deliveryRefund}
            titleAmountStatus="minus"
          />

          <DetailsAccordion
            title="Lyxa Delivery Profit"
            sx={{ borderBottom: 'none' }}
            titleAmount={totalProfit}
            isOpen={currentExpanedTab === 2}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 2 : -1);
            }}
          />

          {/* <PriceItem title="Paid" amount={0} showIfZero />
        <PriceItem title="Unpaid" amount={0} showIfZero /> */}
        </Box>
      </StyledBox>
    </Grid>
  );
}

export default DeliveryPayoutDetails;
