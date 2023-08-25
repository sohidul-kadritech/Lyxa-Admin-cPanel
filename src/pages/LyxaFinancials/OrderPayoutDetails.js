/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
import { Box, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';

import DetailsAccordion from '../../components/Shared/FinancialsOverview/DetailsAccordion';
import PriceItem from '../../components/Shared/FinancialsOverview/PriceItem';
import { CommonOrderAmountTooltipText } from '../../components/Shared/FinancialsOverview/helpers';
import StyledBox from '../../components/StyledCharts/StyledBox';
import { useGlobalContext } from '../../context';

export default function OrderPayoutDetails() {
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

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
            title="Order Amount"
            tooltip="The fees you earn depend on how your customer order and receive their order. 
            VAT inclusivea"
            titleAmount={0}
            isOpen={currentExpanedTab === 0}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 0 : -1);
            }}
          >
            <PriceItem title="Cash" amount={0} showIfZero />
            <PriceItem title="Online" amount={0} showIfZero />

            <PriceItem
              title="Discount"
              amount={0}
              isNegative
              tooltip={<CommonOrderAmountTooltipText byAdmin={0} byShop={0} currency={currency} />}
              showIfZero
            />

            <PriceItem
              title="Buy 1 Get 1"
              amount={0}
              isNegative
              tooltip={<CommonOrderAmountTooltipText byShop={0} byAdmin={0} currency={currency} />}
              showIfZero
            />

            <PriceItem
              title="Loyalty points"
              isNegative
              amount={0}
              amountStatus="minus"
              tooltip={<CommonOrderAmountTooltipText byShop={0} byAdmin={0} currency={currency} />}
              showIfZero
            />
          </DetailsAccordion>

          {/* shop cut */}
          <DetailsAccordion title="Shop Cut" titleAmount={0} titleAmountStatus="minus" />

          {/* delivery */}
          <DetailsAccordion
            title="Delivery Profit"
            titleAmount={0}
            tooltip="Fee for Lyxa-powered deliveries: 20%
          Shop-powered deliveries: 10%. 
          VAT inclusive"
            isOpen={currentExpanedTab === 2}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 2 : -1);
            }}
          >
            <PriceItem title="Cash" amount={0} showIfZero />
            <PriceItem title="Online" amount={0} showIfZero />
            <PriceItem title="Rider Cut" amount={0} showIfZero isNegative />
          </DetailsAccordion>

          {/* featured */}
          <DetailsAccordion
            title="Total Featured Amount"
            titleAmount={0}
            tooltip="Fee for Lyxa-powered deliveries: 20%
          Shop-powered deliveries: 10%. 
          VAT inclusive"
            isOpen={currentExpanedTab === 3}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 3 : -1);
            }}
          />

          {/* Other payments */}
          <DetailsAccordion
            title="Other Payments"
            tooltip="Fee for Lyxa-powered deliveries: 20%
          Shop-powered deliveries: 10%. 
          VAT inclusive"
            titleAmount={0}
            titleAmountStatus="minus"
            isOpen={currentExpanedTab === 2}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 2 : -1);
            }}
          >
            <PriceItem title="Refund" amount={0} isNegative showIfZero />
            <PriceItem title="Refused Orders" amount={0} isNegative showIfZero />
            <PriceItem title="Free Delivery" amount={0} isNegative showIfZero />
            <PriceItem title="Points Paid to the Shop" amount={0} isNegative showIfZero />
            <PriceItem title="Coupons" amount={0} isNegative showIfZero />
            <PriceItem title="Shop Add/Remove Credit" amount={0} isNegative showIfZero />
          </DetailsAccordion>

          {/* profit */}
          <DetailsAccordion
            title="Total Profit"
            titleAmount={0}
            tooltip="Fee for Lyxa-powered deliveries: 20%
            Shop-powered deliveries: 10%.
            VAT inclusive"
            isOpen={currentExpanedTab === 3}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 3 : -1);
            }}
            sx={{
              borderBottom: '0',
            }}
          >
            <PriceItem title="Paid" amount={0} showIfZero />
            <PriceItem title="Unpaid" amount={0} showIfZero />
          </DetailsAccordion>
        </Box>
      </StyledBox>
    </Grid>
  );
}
