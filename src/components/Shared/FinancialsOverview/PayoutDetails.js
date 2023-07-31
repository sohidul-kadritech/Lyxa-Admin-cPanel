/* eslint-disable no-unsafe-optional-chaining */
import { Box, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';

import { useGlobalContext } from '../../../context';
import StyledBox from '../../StyledCharts/StyledBox';
import DetailsAccordion from './DetailsAccordion';
import PriceItem from './PriceItem';
import { CommonOrderAmountTooltipText } from './helpers';

export default function Payout({ paymentDetails }) {
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
            titleAmount={
              paymentDetails?.orderValue?.productAmount -
              (paymentDetails?.orderValue?.totalDiscount + paymentDetails?.orderValue?.totalRewardAmount)
            }
            isOpen={currentExpanedTab === 0}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 0 : -1);
            }}
          >
            {paymentDetails?.orderValue?.productAmountCash + paymentDetails?.orderValue?.doubleMenuItemPriceCash >
              0 && (
              <PriceItem
                title="Cash"
                amount={
                  paymentDetails?.orderValue?.productAmountCash + paymentDetails?.orderValue?.doubleMenuItemPriceCash
                }
              />
            )}

            {paymentDetails?.orderValue?.productAmountOnline + paymentDetails?.orderValue?.doubleMenuItemPriceOnline >
              0 && (
              <PriceItem
                title="Online"
                amount={
                  paymentDetails?.orderValue?.productAmountOnline +
                  paymentDetails?.orderValue?.doubleMenuItemPriceOnline
                }
              />
            )}
            {/* shop */}
            {paymentDetails?.orderValue?.totalDiscount > 0 && (
              <PriceItem
                title="Discount"
                amount={paymentDetails?.orderValue?.totalDiscount}
                amountStatus="minus"
                tooltip={
                  <CommonOrderAmountTooltipText
                    byAdmin={paymentDetails?.orderValue?.totalAdminDiscount}
                    byShop={paymentDetails?.orderValue?.totalShopDiscount}
                    currency={currency}
                  />
                }
              />
            )}
            {paymentDetails?.orderValue?.totalDoubleMenuItemPrice > 0 && (
              <PriceItem
                title="Buy 1 Get 1"
                amount={paymentDetails?.orderValue?.totalDoubleMenuItemPrice}
                amountStatus="minus"
                tooltip={
                  <CommonOrderAmountTooltipText
                    byShop={paymentDetails?.orderValue?.totalShopDoubleMenuItemPrice}
                    byAdmin={paymentDetails?.orderValue?.totalAdminDoubleMenuItemPrice}
                    currency={currency}
                  />
                }
              />
            )}
            {paymentDetails?.orderValue?.totalRewardAmount > 0 && (
              <PriceItem
                title="Loyalty points"
                amount={paymentDetails?.orderValue?.totalRewardAmount}
                amountStatus="minus"
                tooltip={
                  <CommonOrderAmountTooltipText
                    byShop={paymentDetails?.orderValue?.totalShopRewardAmount}
                    byAdmin={paymentDetails?.orderValue?.totalAdminRewardAmount}
                    currency={currency}
                  />
                }
              />
            )}
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
                  // eslint-disable-next-line prettier/prettier
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
              {Math.abs(paymentDetails?.freeDeliveryShopCut) > 0 && (
                <PriceItem
                  title="Promotion: free delivery"
                  amount={paymentDetails?.freeDeliveryShopCut}
                  amountStatus="minus"
                />
              )}

              {Math.abs(paymentDetails?.totalFeaturedAmount) > 0 && (
                <PriceItem
                  title="Promotion: featured"
                  amount={paymentDetails?.totalFeaturedAmount}
                  amountStatus="minus"
                />
              )}
              {paymentDetails?.totalRefundAmount !== 0 && (
                <PriceItem
                  title="Refunded Amount"
                  amount={Math.abs(paymentDetails?.totalRefundAmount)}
                  amountStatus={`${paymentDetails?.totalRefundAmount > 0 ? 'minus' : ''}`}
                />
              )}
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
              {paymentDetails?.orderValue?.deliveryFeeCash > 0 && (
                <PriceItem title="Cash" amount={paymentDetails?.orderValue?.deliveryFeeCash} />
              )}

              {paymentDetails?.orderValue?.deliveryFeeOnline > 0 && (
                <PriceItem title="Online" amount={paymentDetails?.orderValue?.deliveryFeeOnline} />
              )}

              {paymentDetails?.orderValue?.riderTipOnline > 0 && (
                <PriceItem title="Rider tip" amount={paymentDetails?.orderValue?.riderTipOnline} />
              )}
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
            titleAmount={`${currency} ${(Math.abs(paymentDetails?.totalProfit) || 0)?.toFixed(2)}`}
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
            {Math.abs(paymentDetails?.totalProfit - paymentDetails?.totalUnsettle) > 0 && (
              <PriceItem
                title="Paid"
                amount={`${Math.abs(paymentDetails?.totalProfit - paymentDetails?.totalUnsettle)}`}
                amountStatus={paymentDetails?.totalProfit - paymentDetails?.totalUnsettle < 0 ? 'minus' : ''}
              />
            )}

            {Math.abs(paymentDetails?.totalUnsettle) > 0 && (
              <PriceItem
                title="Unpaid"
                amount={Math.abs(paymentDetails?.totalUnsettle)}
                amountStatus={paymentDetails?.totalUnsettle < 0 ? 'minus' : ''}
              />
            )}
          </DetailsAccordion>
        </Box>
      </StyledBox>
    </Grid>
  );
}
