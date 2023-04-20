/* eslint-disable no-unsafe-optional-chaining */
import { Box, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import { useState } from 'react';
import StyledBox from '../../../components/StyledCharts/StyledBox';
import DetailsAccordion from './DetailsAccordion';
import PriceItem from './PriceItem';

export default function Payout({ paymentDetails }) {
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
          Profit Breakdown
        </Typography>
        <Typography variant="body4" color="#737373">
          Expected profit is scheduled on March 2, 2020. Usually, payments deposit in 1-3 business days, but the exact
          time may vary based on your bank.
        </Typography>
        <Box pt={2.5}>
          {/* order amount */}
          <DetailsAccordion
            title="Order Amount"
            tooltip="The fees you earn depend on how your customer order and receive their order. 
            VAT inclusivea"
            titleAmount={
              paymentDetails?.orderValue?.productAmount -
              (paymentDetails?.orderValue?.totalDiscount +
                paymentDetails?.orderValue?.totalDoubleMenuItemPrice +
                paymentDetails?.orderValue?.totalRewardAmount)
            }
            isOpen={currentExpanedTab === 0}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 0 : -1);
            }}
          >
            {paymentDetails?.orderValue?.productAmountCash > 0 && (
              <PriceItem title="Cash" amount={paymentDetails?.orderValue?.productAmountCash} />
            )}
            {paymentDetails?.orderValue?.productAmountOnline > 0 && (
              <PriceItem title="Online" amount={paymentDetails?.orderValue?.productAmountOnline} />
            )}
            {paymentDetails?.orderValue?.totalDiscount > 0 && (
              <PriceItem
                title="Discount applied"
                amount={paymentDetails?.orderValue?.totalDiscount}
                amountStatus="minus"
              />
            )}
            {paymentDetails?.orderValue?.totalDoubleMenuItemPrice > 0 && (
              <PriceItem
                title="Buy 1 Get 1"
                amount={paymentDetails?.orderValue?.totalDoubleMenuItemPrice}
                amountStatus="minus"
              />
            )}
            {paymentDetails?.orderValue?.totalRewardAmount > 0 && (
              <PriceItem
                title="Loyalty points"
                amount={paymentDetails?.orderValue?.totalRewardAmount}
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
            titleAmount={Math.abs(paymentDetails?.totalDropGet)}
            titleAmountStatus="minus"
            isOpen={currentExpanedTab === 1}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 1 : -1);
            }}
          ></DetailsAccordion>
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
            {paymentDetails?.freeDeliveryShopCut > 0 && (
              <PriceItem
                title="Promotion: free delivery"
                amount={paymentDetails?.freeDeliveryShopCut}
                amountStatus="minus"
              />
            )}
          </DetailsAccordion>
          {/* delivery */}
          {paymentDetails?.orderValue?.deliveryFee > 0 && (
            <DetailsAccordion
              title="Delivery fee"
              titleAmount={paymentDetails?.orderValue?.deliveryFee}
              tooltip="Fee for Lyxa-powered deliveries: 20%
          Shop-powered deliveries: 10%. 
          VAT inclusive"
              isOpen={currentExpanedTab === 2}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 2 : -1);
              }}
            >
              <PriceItem title="Cash" amount={paymentDetails?.orderValue?.deliveryFeeCash} />
              <PriceItem title="Online" amount={paymentDetails?.orderValue?.deliveryFeeOnline} />
              <PriceItem title="Rider tip" amount={paymentDetails?.orderValue?.deliveryFeeOnline} />
            </DetailsAccordion>
          )}
          {/* points cashback */}
          <DetailsAccordion
            title="Points cashback"
            titleAmount={paymentDetails?.orderValue?.pointsCashback}
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
            titleAmount={paymentDetails?.orderValue?.deliveryFee + paymentDetails?.toalShopProfile}
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
            {paymentDetails?.orderValue?.deliveryFee + paymentDetails?.toalShopProfile > 0 && (
              <PriceItem
                title="Paid"
                amount={
                  paymentDetails?.orderValue?.deliveryFee +
                  paymentDetails?.toalShopProfile -
                  paymentDetails?.totalShopUnsettle
                }
              />
            )}
            {paymentDetails?.totalShopUnsettle > 0 && (
              <PriceItem title="Unpaid" amount={paymentDetails?.totalShopUnsettle} />
            )}
          </DetailsAccordion>
        </Box>
      </StyledBox>
    </Grid>
  );
}
