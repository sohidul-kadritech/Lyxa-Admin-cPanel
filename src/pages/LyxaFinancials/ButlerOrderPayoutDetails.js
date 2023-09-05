/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
import { Box, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import DetailsAccordion from '../../components/Shared/FinancialsOverview/DetailsAccordion';
// import PriceItem from '../../components/Shared/FinancialsOverview/PriceItem';
import { getTotalProfitForLyxa } from '../../components/Shared/FinancialsOverview/helpers';
import StyledBox from '../../components/StyledCharts/StyledBox';
import { useGlobalContext } from '../../context';
import { modifiedProfitBreakDownDataForSecondaryCurrency } from './helpers';

export default function ButlerOrderPayoutDetails({ paymentDetails }) {
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);

  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;

  console.log('paymentDetails', paymentDetails);

  const totalProfit = getTotalProfitForLyxa(
    currency,
    secondaryCurrency,
    modifiedProfitBreakDownDataForSecondaryCurrency(paymentDetails, 'butler'),
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
          Payout Breakdown
        </Typography>
        <Typography variant="body4" color="#737373">
          Expected profit is scheduled on {moment().endOf('week').calendar()}. Usually, payments deposit in 1-3 business
          days, but the exact time may vary based on your bank.
        </Typography>
        <Box pt={2.5}>
          {/* delivery */}
          <DetailsAccordion
            title="Total Order Amount"
            titleAmount={paymentDetails?.totalOrderAmount || 0}
            isOpen={currentExpanedTab === 2}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 2 : -1);
            }}
          >
            {/* <PriceItem title="Cash" amount={0} showIfZero />
            <PriceItem title="Online" amount={0} showIfZero />
            <PriceItem title="Rider Cut" amount={0} showIfZero isNegative /> */}
          </DetailsAccordion>

          <DetailsAccordion
            title="Rider Payout"
            titleAmount={paymentDetails?.riderPayout || 0}
            isOpen={currentExpanedTab === 2}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 2 : -1);
            }}
            titleAmountStatus="minus"
          >
            {/* <PriceItem title="Cash" amount={0} showIfZero />
            <PriceItem title="Online" amount={0} showIfZero />
            <PriceItem title="Rider Cut" amount={0} showIfZero isNegative /> */}
          </DetailsAccordion>

          {/* profit */}
          <DetailsAccordion
            title="Total Profit"
            titleAmount={totalProfit}
            isOpen={currentExpanedTab === 3}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 3 : -1);
            }}
            sx={{
              borderBottom: '0',
            }}
          ></DetailsAccordion>
        </Box>
      </StyledBox>
    </Grid>
  );
}
