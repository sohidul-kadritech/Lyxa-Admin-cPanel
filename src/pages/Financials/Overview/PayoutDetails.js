/* eslint-disable no-unsafe-optional-chaining */
import { Box, Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import StyledBox from '../../../components/StyledCharts/StyledBox';
import DetailsAccordion from './DetailsAccordion';
import PriceItem from './PriceItem';

export default function Payout({ paymentDetails, transactionDetails }) {
  const shop = useSelector((store) => store.Login.admin);
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);

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
          Expected payout is scheduled on March 2, 2020. Usually, payments deposit in 1-3 business days, but the exact
          time may vary based on your bank.
        </Typography>
        <Box pt={2.5}>
          {/* order amount */}
          <DetailsAccordion
            title="Order Amount"
            tooltip="The fees you earn depend on how your customer order and receive their order. 
            VAT inclusivea"
            titleAmount={`$${(
              paymentDetails?.orderValue?.productAmount -
              (paymentDetails?.orderValue?.totalDiscount +
                paymentDetails?.orderValue?.totalDoubleMenuItemPrice +
                paymentDetails?.orderValue?.totalRewardAmount)
            )?.toFixed(2)}`}
            isOpen={currentExpanedTab === 0}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 0 : -1);
            }}
          >
            {paymentDetails?.orderValue?.productAmountCash > 0 && (
              <PriceItem title="Cash" amount={`$${paymentDetails?.orderValue?.productAmountCash?.toFixed(2)}`} />
            )}
            {paymentDetails?.orderValue?.productAmountOnline > 0 && (
              <PriceItem title="Online" amount={`$${paymentDetails?.orderValue?.productAmountOnline?.toFixed(2)}`} />
            )}
            {paymentDetails?.orderValue?.totalDiscount > 0 && (
              <PriceItem
                title="Discount applied"
                amount={`-$${paymentDetails?.orderValue?.totalDiscount?.toFixed(2)}`}
                amountStatus="minus"
              />
            )}
            {paymentDetails?.orderValue?.totalDoubleMenuItemPrice > 0 && (
              <PriceItem
                title="Buy 1 Get 1"
                amount={`-$${paymentDetails?.orderValue?.totalDoubleMenuItemPrice?.toFixed(2)}`}
                amountStatus="minus"
              />
            )}
            {paymentDetails?.orderValue?.totalRewardAmount > 0 && (
              <PriceItem
                title="Loyalty points"
                amount={`-$${paymentDetails?.orderValue?.totalRewardAmount?.toFixed(2)}`}
                amountStatus="minus"
              />
            )}
          </DetailsAccordion>
          {/* lyxa fees */}
          <DetailsAccordion
            title="Lyxa fees"
            tooltip="Fee for Lyxa-powered deliveries: 20%
            Shop-powered deliveries: 10%. 
            VAT inclusive"
            isOpen={currentExpanedTab === 1}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 1 : -1);
            }}
          >
            <Stack gap={2}>
              <PriceItem
                title="10% of total order excluding delivery"
                amount={`-$${paymentDetails?.totalDropGet?.toFixed(2)}`}
                amountStatus="minus"
              />
            </Stack>
          </DetailsAccordion>
          {/* Other payments */}
          <DetailsAccordion
            title="Other Payments"
            tooltip="Fee for Lyxa-powered deliveries: 20%
            Shop-powered deliveries: 10%. 
            VAT inclusive"
            isOpen={currentExpanedTab === 2}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 2 : -1);
            }}
          >
            <Stack gap={2}>
              <PriceItem title="Promotion: free delivery (store side)" amount="-$25" amountStatus="minus" />
            </Stack>
          </DetailsAccordion>
          {/* free delivery */}
          {shop?.haveOwnDeliveryBoy && (
            <DetailsAccordion
              title="Delivery fee"
              tooltip="Fee for Lyxa-powered deliveries: 20%
          Shop-powered deliveries: 10%. 
          VAT inclusive"
              isOpen={currentExpanedTab === 2}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 2 : -1);
              }}
            >
              <Stack gap={2}>
                <PriceItem title="Promotion: free delivery (store side)" amount="-$25" amountStatus="minus" />
              </Stack>
            </DetailsAccordion>
          )}
          {/* total payout */}
          <DetailsAccordion
            title="Points cashback"
            titleAmount={`$${(transactionDetails?.totalShopDeliveryFee + transactionDetails?.toalShopProfile)?.toFixed(
              2
            )}`}
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
          ></DetailsAccordion>
          {/* total payout */}
          <DetailsAccordion
            title="Total Payout"
            titleAmount={`$${(transactionDetails?.totalShopDeliveryFee + transactionDetails?.toalShopProfile)?.toFixed(
              2
            )}`}
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
          ></DetailsAccordion>
        </Box>
      </StyledBox>
    </Grid>
  );
}
