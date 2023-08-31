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
import { CommonOrderAmountTooltipText, CommonOrderMarketingCashbackTooltipText } from './helpers';

export default function PayoutDetails({ paymentDetails }) {
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.symbol;

  const totalProfit = paymentDetails?.secondaryCurrency_Profit
    ? `${currency} ${(Math.abs(paymentDetails?.totalProfit) || 0)?.toFixed(2)} 
      (${currency} ${(paymentDetails?.baseCurrency_Profit || 0).toFixed(2)} + 
      ${secondaryCurrency || ''} ${Math.round(paymentDetails?.secondaryCurrency_Profit || 0)})`
    : `${currency} ${(Math.abs(paymentDetails?.totalProfit) || 0)?.toFixed(2)}`;

  const orderValue = paymentDetails?.orderValue;

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
          {/* 
          order amount
          ---------------
          Formula: 
          ---------
          Original Order amount
          - double deal/buy 1 get 1 added by shop
          - discount added by shop
          - loyalty points added boy shop
          - coupon added by lyxa (it only applicable by lyxa)
          = cash/online
          + marketing lyxa cashback
          = order amount
          ---------------
          */}

          <DetailsAccordion
            title="Order Amount"
            tooltip="The fees you earn depend on how your customer order and receive their order. 
            VAT inclusivea"
            titleAmount={orderValue?.productAmount}
            isOpen={currentExpanedTab === 0}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 0 : -1);
            }}
          >
            <DetailsAccordion
              title="Cash"
              tooltip="How many amount user paid by cash?"
              titleAmount={orderValue?.productAmountCash}
              isOpen={currentExpanedTab === 0}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 0 : -1);
              }}
            >
              <PriceItem
                title="Original Order Amount"
                amount={
                  orderValue?.productAmount +
                  orderValue?.totalDiscount +
                  orderValue?.totalDoubleMenuItemPrice +
                  orderValue?.totalRewardAmount
                }
                tooltip={
                  <CommonOrderMarketingCashbackTooltipText
                    discount={orderValue?.totalDiscount || 0}
                    doubleMenu={orderValue?.totalDoubleMenuItemPrice || 0}
                    rewards={orderValue?.totalRewardAmount || 0}
                  />
                }
              />

              <PriceItem
                title="Discount"
                amount={orderValue?.totalDiscount}
                isNegative
                tooltip={
                  <CommonOrderAmountTooltipText
                    byAdmin={orderValue?.totalAdminDiscount}
                    byShop={orderValue?.totalShopDiscount}
                    currency={currency}
                  />
                }
              />

              <PriceItem
                title="Buy 1 Get 1"
                amount={orderValue?.totalDoubleMenuItemPrice}
                isNegative
                tooltip={
                  <CommonOrderAmountTooltipText
                    byShop={orderValue?.totalShopDoubleMenuItemPrice}
                    byAdmin={orderValue?.totalAdminDoubleMenuItemPrice}
                    currency={currency}
                  />
                }
              />
              <PriceItem
                title="Loyalty Points"
                amount={orderValue?.totalRewardAmount || 0}
                isNegative
                tooltip={
                  <CommonOrderAmountTooltipText
                    byShop={orderValue?.totalShopDoubleMenuItemPrice}
                    byAdmin={orderValue?.totalAdminDoubleMenuItemPrice}
                    currency={currency}
                  />
                }
              />
              <PriceItem
                title="Coupons"
                amount={orderValue?.totalRewardAmount || 0}
                isNegative
                tooltip={
                  <CommonOrderAmountTooltipText
                    byShop={orderValue?.totalShopDoubleMenuItemPrice}
                    byAdmin={orderValue?.totalAdminDoubleMenuItemPrice}
                    currency={currency}
                  />
                }
              />
            </DetailsAccordion>

            {/* Online */}
            <DetailsAccordion
              // sx={{ borderBottom: 'none' }}
              title="Online"
              tooltip="How many amount user paid by online?"
              titleAmount={orderValue?.productAmountOnline}
              isOpen={currentExpanedTab === 0}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 0 : -1);
              }}
            >
              <PriceItem
                title="Original Order Amount"
                amount={
                  orderValue?.productAmount +
                  orderValue?.totalDiscount +
                  orderValue?.totalDoubleMenuItemPrice +
                  orderValue?.totalRewardAmount
                }
                tooltip={
                  <CommonOrderMarketingCashbackTooltipText
                    discount={orderValue?.totalDiscount}
                    doubleMenu={orderValue?.totalDoubleMenuItemPrice}
                    rewards={orderValue?.totalDoubleMenuItemPrice}
                  />
                }
              />

              <PriceItem
                title="Discount"
                amount={orderValue?.totalDiscount || 0}
                isNegative
                tooltip={
                  <CommonOrderAmountTooltipText
                    byAdmin={orderValue?.totalAdminDiscount}
                    byShop={orderValue?.totalShopDiscount}
                    currency={currency}
                  />
                }
              />

              <PriceItem
                title="Buy 1 Get 1"
                amount={orderValue?.totalDoubleMenuItemPrice || 0}
                isNegative
                tooltip={
                  <CommonOrderAmountTooltipText
                    byShop={orderValue?.totalShopDoubleMenuItemPrice}
                    byAdmin={orderValue?.totalAdminDoubleMenuItemPrice}
                    currency={currency}
                  />
                }
              />

              <PriceItem
                title="Loyalty Points"
                amount={orderValue?.totalRewardAmount || 0}
                isNegative
                tooltip={
                  <CommonOrderAmountTooltipText
                    byShop={orderValue?.totalShopDoubleMenuItemPrice}
                    byAdmin={orderValue?.totalAdminDoubleMenuItemPrice}
                    currency={currency}
                  />
                }
              />

              <PriceItem
                title="Coupons"
                amount={orderValue?.totalRewardAmount || 0}
                isNegative
                tooltip={
                  <CommonOrderAmountTooltipText
                    byShop={orderValue?.totalShopDoubleMenuItemPrice}
                    byAdmin={orderValue?.totalAdminDoubleMenuItemPrice}
                    currency={currency}
                  />
                }
              />
            </DetailsAccordion>

            <Box pt={3.5}>
              <PriceItem
                title="Marketing Lyxa Cashback"
                amount={
                  orderValue?.productAmount +
                  orderValue?.totalDiscount +
                  orderValue?.totalDoubleMenuItemPrice +
                  orderValue?.totalRewardAmount
                }
                tooltip={
                  <CommonOrderMarketingCashbackTooltipText
                    discount={orderValue?.totalDiscount}
                    doubleMenu={orderValue?.totalDoubleMenuItemPrice}
                    rewards={orderValue?.totalDoubleMenuItemPrice}
                  />
                }
              />
            </Box>
          </DetailsAccordion>

          {/* 
          lyxa fees 
          ---------------
          - Lyxa fees ( x% out of the order amount ) 
          - Free delivery by shop (if Lyxa rider)
          - Error charge
          - Customer refund 
          + Delivery fees if self delivery
            = Payout ( amount =  base + secondary )
            
          */}

          <DetailsAccordion
            title="Lyxa fees"
            titleAmount={Math.abs(paymentDetails?.totalDropGet + orderValue?.pointsCashback)}
            titleAmountStatus={paymentDetails?.totalDropGet + orderValue?.pointsCashback > 0 ? 'minus' : ''}
          />

          {/* total vat */}
          <DetailsAccordion
            title="Total VAT"
            tooltip="Fee for Lyxa-powered deliveries: 20%
            Shop-powered deliveries: 10%. 
            VAT inclusive"
            titleAmount={Math.abs(orderValue?.totalVat)}
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
                  paymentDetails?.totalRefundAmount,
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
          {orderValue?.deliveryFee > 0 && (
            <DetailsAccordion
              title="Delivery fee"
              titleAmount={orderValue?.deliveryFee}
              tooltip="Fee for Lyxa-powered deliveries: 20%
          Shop-powered deliveries: 10%. 
          VAT inclusive"
              isOpen={currentExpanedTab === 2}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 2 : -1);
              }}
            >
              <PriceItem title="Cash" amount={orderValue?.deliveryFeeCash} />

              <PriceItem title="Online" amount={orderValue?.deliveryFeeOnline} />

              <PriceItem title="Rider tip" amount={orderValue?.riderTipOnline} isRefused />
            </DetailsAccordion>
          )}

          {/* points cashback */}
          {orderValue?.pointsCashback > 0 && (
            <DetailsAccordion
              title="Points cashback"
              titleAmount={orderValue?.pointsCashback}
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
