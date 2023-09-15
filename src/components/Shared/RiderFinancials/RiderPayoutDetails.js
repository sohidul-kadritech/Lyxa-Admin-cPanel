/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable prettier/prettier */

import { Box, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useGlobalContext } from '../../../context';
import StyledBox from '../../StyledCharts/StyledBox';
import DetailsAccordion from '../FinancialsOverview/DetailsAccordion';
import PriceItem from '../FinancialsOverview/PriceItem';

function RiderPayoutDetails({ deliveryProfitBreakDown = {}, currencyType }) {
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);
  const { general } = useGlobalContext();

  const baseCurrency = general?.currency?.symbol;

  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;

  const totalFreeDelivery =
    deliveryProfitBreakDown?.freeDeliveryByShop + deliveryProfitBreakDown?.freeDeliveryByAdmin || 0;

  //   const totalProfit = getTotalProfitForLyxa(
  //     currency,
  //     secondaryCurrency,
  //     modifiedProfitBreakDownDataForSecondaryCurrency(deliveryProfitBreakDown, 'delivery'),
  //     false,
  //   );

  console.log('deliveryProfitBreakDown', deliveryProfitBreakDown);

  return (
    <Grid xs={12}>
      <StyledBox
        padding
        sx={{
          paddingBottom: '4px',
        }}
      >
        <Typography variant="body1" fontWeight={600} pb={2}>
          Payout Breakdown
        </Typography>
        <Typography variant="body4" color="#737373">
          Expected profit is scheduled on {moment().endOf('week').calendar()}. Usually, payments deposit in 1-3 business
          days, but the exact time may vary based on your bank.
        </Typography>
        <Box pt={2.5}>
          {/* 
            Users (including butler and normal orders)
            +free delivery shops
            +free delivery lyxa 
            = Total delivery fee (Cash/online) 
          */}

          <DetailsAccordion
            title="Total Delivery Fee"
            currencyType={currencyType}
            titleAmount={deliveryProfitBreakDown?.totalDeliveryFee}
            isOpen={currentExpanedTab === 0}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 0 : -1);
            }}
          >
            <PriceItem
              title="Delivery Fees"
              currencyType={currencyType}
              amount={deliveryProfitBreakDown?.users}
              showIfZero
            />
            <PriceItem
              title="Free Delivery by Shops"
              currencyType={currencyType}
              amount={deliveryProfitBreakDown?.freeDeliveryByShop || 0}
              showIfZero
            />
            <PriceItem
              title="Free Delivery by Lxya"
              currencyType={currencyType}
              amount={deliveryProfitBreakDown?.freeDeliveryByAdmin || 0}
              showIfZero
            />
          </DetailsAccordion>

          {/* 

            - Lyxa delivery profit
            +Rider tips
            +/- (+/- add/remove credit)
            = Rider payout (LBP)

          */}
          <DetailsAccordion
            title="Lyxa Delivery Cut"
            currencyType={currencyType}
            titleAmount={deliveryProfitBreakDown?.adminDeliveryProfit}
            titleAmountStatus="minus"
          />
          <DetailsAccordion
            title="Rider Tips"
            currencyType={currencyType}
            titleAmount={deliveryProfitBreakDown?.riderTips}
            isOpen={currentExpanedTab === 3}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 3 : -1);
            }}
          />
          <DetailsAccordion
            title="Rider Add/Remove credit"
            currencyType={currencyType}
            titleAmount={Math.abs(deliveryProfitBreakDown?.riderAddRemoveCredit || 0)}
            titleAmountStatus={`${deliveryProfitBreakDown?.riderAddRemoveCredit < 0 ? 'minus' : ''}`}
          />

          <DetailsAccordion
            sx={{ borderBottom: 'none' }}
            title="Rider Payout"
            currencyType={currencyType}
            titleAmount={deliveryProfitBreakDown?.riderPayout}
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

export default RiderPayoutDetails;
