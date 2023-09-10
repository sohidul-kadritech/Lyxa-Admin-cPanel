/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
import { Box, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';

import DetailsAccordion from '../../components/Shared/FinancialsOverview/DetailsAccordion';
import PriceItem from '../../components/Shared/FinancialsOverview/PriceItem';
import {
  CommonOrderAmountTooltipText,
  CommonOrderMarketingCashbackTooltipText,
  getTotalProfitForLyxa,
} from '../../components/Shared/FinancialsOverview/helpers';
import StyledBox from '../../components/StyledCharts/StyledBox';
import { useGlobalContext } from '../../context';
import { isDeliveryProfitIsVisible } from './helpers';

export default function OrderPayoutDetails({ showFor, paymentDetails = {}, deliveryProfitBreakDown = {} }) {
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;

  const cash = paymentDetails?.cash;
  const online = paymentDetails?.online;
  const lyxaMarketingCashback = paymentDetails?.AdminMarketingCashback;
  const otherPayments = paymentDetails?.otherPayments;
  const deliveryFee = paymentDetails?.deliveryFee;
  const payout = paymentDetails?.payout;

  const totalProfit = getTotalProfitForLyxa(currency, secondaryCurrency, paymentDetails, false);

  
  /*
  Original order amount-discount by shop- buy 1 get 1 by shop-loyalty-
  discount by lyxa+discount by lyxa = order amount (x online and y cash)
  */
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
          {/* order amount */}

          <DetailsAccordion
            title="Order Amount"
            tooltip="The fees you earn depend on how your customer order and receive their order. 
          VAT inclusivea"
            titleAmount={paymentDetails?.orderAmount || 0}
            isOpen={currentExpanedTab === 0}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 0 : -1);
            }}
          >
            <DetailsAccordion
              title="Cash"
              tooltip="How many amount user paid by cash?"
              titleAmount={cash?.totalCash || 0}
              isOpen={currentExpanedTab === 0}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 0 : -1);
              }}
            >
              <PriceItem title="Original Order Amount" amount={cash?.originalOrderAmount_cash || 0} />

              <PriceItem
                title="Discount"
                amount={cash?.discount_cash || 0}
                isNegative
                // tooltip={
                //   <CommonOrderAmountTooltipText
                //     byAdmin={cash?.totalAdminDiscount}
                //     byShop={cash?.totalShopDiscount}
                //     currency={currency}
                //   />
                // }
              />

              <PriceItem
                title="Buy 1 Get 1"
                amount={cash?.buy1Get1_cash || 0}
                isNegative
                // tooltip={
                //   <CommonOrderAmountTooltipText
                //     byShop={orderValue?.totalShopDoubleMenuItemPrice}
                //     byAdmin={orderValue?.totalAdminDoubleMenuItemPrice}
                //     currency={currency}
                //   />
                // }
              />
              <PriceItem title="Loyalty Points" amount={cash?.loyaltyPoints_cash || 0} isNegative />
              <PriceItem title="Coupons" amount={cash?.couponDiscount_cash || 0} isNegative />
            </DetailsAccordion>

            {/* Online */}
            <DetailsAccordion
              sx={{ borderBottom: 'none' }}
              title="Online"
              tooltip="How many amount user paid by online?"
              titleAmount={online?.totalOnline || 0}
              isOpen={currentExpanedTab === 0}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 0 : -1);
              }}
            >
              <PriceItem
                title="Original Order Amount"
                amount={online?.originalOrderAmount_online || 0}
                tooltip={
                  <CommonOrderMarketingCashbackTooltipText
                    value={[
                      {
                        label: 'Discount',
                        value: `${currency}${online?.discount_online}`,
                      },
                      {
                        label: 'Buy 1 Get 1',
                        value: `${currency}${online?.buy1Get1_online}`,
                      },
                      {
                        label: 'Loyalyt Points',
                        value: `${currency}${online?.loyaltyPoints_online}`,
                      },
                    ]}
                  />
                }
              />

              <PriceItem
                title="Discount"
                amount={online?.discount_online || 0}
                isNegative
                tooltip={
                  <CommonOrderAmountTooltipText
                    byAdmin={online?.discount_online}
                    byShop={online?.discount_online}
                    currency={currency}
                  />
                }
              />

              <PriceItem
                title="Buy 1 Get 1"
                amount={online?.buy1Get1_online || 0}
                isNegative
                tooltip={
                  <CommonOrderAmountTooltipText
                    byShop={online?.buy1Get1_online}
                    byAdmin={online?.buy1Get1_online}
                    currency={currency}
                  />
                }
              />

              <PriceItem
                title="Loyalty Points"
                amount={online?.loyaltyPoints_online || 0}
                isNegative
                tooltip={
                  <CommonOrderAmountTooltipText
                    byShop={online?.loyaltyPoints_online}
                    byAdmin={online?.loyaltyPoints_online}
                    currency={currency}
                  />
                }
              />

              <PriceItem
                title="Coupons"
                amount={online?.couponDiscount_online || 0}
                isNegative
                tooltip={
                  <CommonOrderAmountTooltipText
                    byShop={online?.couponDiscount_online}
                    byAdmin={online?.couponDiscount_online}
                    currency={currency}
                  />
                }
              />
            </DetailsAccordion>

            <Box pt={3.5}>
              <PriceItem
                sx={{ paddingLeft: 8 }}
                title="Lyxa Marketing Compensation"
                amount={lyxaMarketingCashback?.adminMarketingCashback || 0}
                tooltip={
                  <CommonOrderMarketingCashbackTooltipText
                    value={[
                      {
                        label: 'Buy 1 Get 1',
                        value: `${currency}${lyxaMarketingCashback?.buy1Get1_amc}`,
                      },
                      {
                        label: 'Discount',
                        value: `${currency}${lyxaMarketingCashback?.discount_amc}`,
                      },
                      {
                        label: 'Coupon',
                        value: `${currency}${lyxaMarketingCashback?.couponDiscount_amc}`,
                      },
                    ]}
                  />
                }
              />
            </Box>
          </DetailsAccordion>

          {/* shop cut */}

          <DetailsAccordion title="Shop Payouts" titleAmount={payout?.totalPayout} titleAmountStatus="minus">
            {/* <PriceItem title="Free delivery by shop" amount={payout?.freeDeliveryByShop || 0} isNegative /> */}
            {/* <PriceItem title="Shop error charge" amount={payout?.totalPayout || 0} /> */}
            {/* <PriceItem title="Shop customer refund" amount={payout?.shopCustomerRefund || 0} /> */}
            {/* <PriceItem title="Shop point cashback" amount={payout?.pointsCashback || 0} isNegative /> */}
            {/* <PriceItem title="Payout" amount={payout?.payout || 0} isNegative /> */}
          </DetailsAccordion>
          <DetailsAccordion title="Featured" titleAmount={paymentDetails?.featuredAmount}>
            {/* <PriceItem title="Free delivery by shop" amount={payout?.freeDeliveryByShop || 0} isNegative /> */}
            {/* <PriceItem title="Shop error charge" amount={payout?.totalPayout || 0} /> */}
            {/* <PriceItem title="Shop customer refund" amount={payout?.shopCustomerRefund || 0} /> */}
            {/* <PriceItem title="Shop point cashback" amount={payout?.pointsCashback || 0} isNegative /> */}
            {/* <PriceItem title="Payout" amount={payout?.payout || 0} isNegative /> */}
          </DetailsAccordion>

          {/* delivery */}

          {isDeliveryProfitIsVisible(showFor) && (
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
          )}

          {/* Other payments */}

          <DetailsAccordion
            title="Other Payments"
            titleAmount={Math.abs(otherPayments?.totalOtherPayments || 0)}
            titleAmountStatus={otherPayments?.totalOtherPayments > 0 ? 'minus' : 0}
            isOpen={currentExpanedTab === 2}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 2 : -1);
            }}
          >
            <PriceItem
              title="Lyxa Marketing cashback"
              amount={otherPayments?.adminMarketingCashback || 0}
              isNegative
              showIfZero
            />
            <PriceItem title="Error charge" amount={0} isNegative showIfZero />
            <PriceItem
              title="Customer refund by Lyxa"
              amount={otherPayments?.customerRefund || 0}
              isNegative
              showIfZero
            />
            <PriceItem
              title="Replacement orders by Lyxa"
              amount={otherPayments?.customerRefund || 0}
              isNegative
              showIfZero
            />
            {/* <PriceItem
              title="Error order by Lyxa ( endure loss )"
              amount={otherPayments?.customerRefund || 0}
              isNegative
              showIfZero
            /> */}
            <PriceItem
              title="Free delivery by shop (Lyxa riders)"
              amount={otherPayments?.freeDeliveryByShop || 0}
              isNegative
              showIfZero
            />
            <PriceItem title="Shop VAT" amount={otherPayments?.shopVat} showIfZero />
            <PriceItem title="Shop Self delivery" amount={otherPayments?.shopDeliveryFee} showIfZero />

            <PriceItem title="Shop Add/Remove Credit" amount={0} isNegative showIfZero />
          </DetailsAccordion>

          {/* profit */}

          <DetailsAccordion
            title="Total Lyxa Profit"
            // titleAmount={paymentDetails?.totalAdminProfit}
            titleAmount={totalProfit}
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
          />
        </Box>
      </StyledBox>
    </Grid>
  );
}
