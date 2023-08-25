/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
import { Box, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';

import { useGlobalContext } from '../../../context';
import StyledBox from '../../StyledCharts/StyledBox';
import DetailsAccordion from './DetailsAccordion';
import PriceItem from './PriceItem';
import { CommonOrderAmountTooltipText } from './helpers';

export default function PayoutDetails({ paymentDetails }) {
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.symbol;

  const totalProfit = paymentDetails?.secondaryCurrency_Profit
    ? `${currency} ${(Math.abs(paymentDetails?.totalProfit) || 0)?.toFixed(2)} 
      (${currency} ${(paymentDetails?.baseCurrency_Profit || 0).toFixed(2)} + 
      ${secondaryCurrency} ${Math.round(paymentDetails?.secondaryCurrency_Profit || 0)})`
    : `${currency} ${(Math.abs(paymentDetails?.totalProfit) || 0)?.toFixed(2)}`;

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
            titleAmount={
              paymentDetails?.orderValue?.productAmount -
              (paymentDetails?.orderValue?.totalDiscount + paymentDetails?.orderValue?.totalRewardAmount)
            }
            isOpen={currentExpanedTab === 0}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 0 : -1);
            }}
          >
            <PriceItem
              title="Cash"
              amount={
                paymentDetails?.orderValue?.productAmountCash + paymentDetails?.orderValue?.doubleMenuItemPriceCash
              }
            />

            <PriceItem
              title="Online"
              amount={
                paymentDetails?.orderValue?.productAmountOnline + paymentDetails?.orderValue?.doubleMenuItemPriceOnline
              }
            />

            {/* shop */}
            <PriceItem
              title="Discount"
              amount={paymentDetails?.orderValue?.totalDiscount}
              isNegative
              tooltip={
                <CommonOrderAmountTooltipText
                  byAdmin={paymentDetails?.orderValue?.totalAdminDiscount}
                  byShop={paymentDetails?.orderValue?.totalShopDiscount}
                  currency={currency}
                />
              }
            />

            <PriceItem
              title="Buy 1 Get 1"
              amount={paymentDetails?.orderValue?.totalDoubleMenuItemPrice}
              isNegative
              tooltip={
                <CommonOrderAmountTooltipText
                  byShop={paymentDetails?.orderValue?.totalShopDoubleMenuItemPrice}
                  byAdmin={paymentDetails?.orderValue?.totalAdminDoubleMenuItemPrice}
                  currency={currency}
                />
              }
            />

            <PriceItem
              title="Loyalty points"
              amount={paymentDetails?.orderValue?.totalRewardAmount}
              isNegative
              tooltip={
                <CommonOrderAmountTooltipText
                  byShop={paymentDetails?.orderValue?.totalShopRewardAmount}
                  byAdmin={paymentDetails?.orderValue?.totalAdminRewardAmount}
                  currency={currency}
                />
              }
            />
          </DetailsAccordion>

          {/* lyxa fees */}
          <DetailsAccordion
            title="Lyxa fees"
            titleAmount={Math.abs(paymentDetails?.totalDropGet + paymentDetails?.orderValue?.pointsCashback)}
            titleAmountStatus={
              paymentDetails?.totalDropGet + paymentDetails?.orderValue?.pointsCashback > 0 ? 'minus' : ''
            }
          />

          {/* total vat */}
          <DetailsAccordion
            title="Total VAT"
            tooltip="Fee for Lyxa-powered deliveries: 20%
            Shop-powered deliveries: 10%. 
            VAT inclusive"
            titleAmount={Math.abs(paymentDetails?.orderValue?.totalVat)}
          />

          {/* Other payments */}
          {(paymentDetails?.freeDeliveryShopCut > 0 ||
            paymentDetails?.totalFeaturedAmount > 0 ||
            paymentDetails?.totalRefundAmount !== 0) && (
            <DetailsAccordion
              title="Other Payments"
              tooltip="Fee for Lyxa-powered deliveries: 20%
          Shop-powered deliveries: 10%. 
          VAT inclusive"
              titleAmount={Math.abs(
                paymentDetails?.freeDeliveryShopCut +
                  paymentDetails?.totalFeaturedAmount +
                  paymentDetails?.totalRefundAmount
              )}
              titleAmountStatus={`${
                paymentDetails?.freeDeliveryShopCut +
                  paymentDetails?.totalFeaturedAmount +
                  paymentDetails?.totalRefundAmount <
                0
                  ? ''
                  : 'minus'
              }`}
              isOpen={currentExpanedTab === 2}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 2 : -1);
              }}
            >
              <PriceItem title="Promotion: free delivery" amount={paymentDetails?.freeDeliveryShopCut} isNegative />

              <PriceItem title="Promotion: featured" amount={paymentDetails?.totalFeaturedAmount} isNegative />

              <PriceItem
                title="Refunded Amount"
                amount={Math.abs(paymentDetails?.totalRefundAmount)}
                isNegative={paymentDetails?.totalRefundAmount > 0}
              />
            </DetailsAccordion>
          )}

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

              <PriceItem title="Rider tip" amount={paymentDetails?.orderValue?.riderTipOnline} isRefused />
            </DetailsAccordion>
          )}

          {/* points cashback */}
          {paymentDetails?.orderValue?.pointsCashback > 0 && (
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
            />
          )}

          {/* total payout */}
          <DetailsAccordion
            title="Total Profit"
            titleAmount={totalProfit}
            tooltip="Fee for Lyxa-powered deliveries: 20%
            Shop-powered deliveries: 10%.
            VAT inclusive"
            titleAmountStatus={paymentDetails?.totalProfit < 0 ? 'minus' : ''}
            isOpen={currentExpanedTab === 3}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 3 : -1);
            }}
            sx={{
              borderBottom: '0',
            }}
          >
            <PriceItem
              title="Paid"
              amount={Math.abs(paymentDetails?.totalProfit - paymentDetails?.totalUnsettle)}
              isNegative={paymentDetails?.totalProfit - paymentDetails?.totalUnsettle < 0}
            />

            <PriceItem
              title="Unpaid"
              console={console.log('totalUnsettle', paymentDetails?.totalUnsettle)}
              amount={Math.abs(paymentDetails?.totalUnsettle)}
              isNegative={paymentDetails?.totalUnsettle < 0}
            />
          </DetailsAccordion>
        </Box>
      </StyledBox>
    </Grid>
  );
}
