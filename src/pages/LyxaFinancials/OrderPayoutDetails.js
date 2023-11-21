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

export default function OrderPayoutDetails({ showFor, paymentDetails = {} }) {
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

  console.log({ paymentDetails });

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
            tooltip="The total amount of products the user purchased (including Lyxa Marketing Cashback and excluding deals)."
            titleAmount={paymentDetails?.orderAmount || 0}
            isOpen={currentExpanedTab === 0}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 0 : -1);
            }}
          >
            <DetailsAccordion
              title="Cash"
              tooltip="How much amount user paid by cash?"
              titleAmount={cash?.totalCash || 0}
              isOpen={currentExpanedTab === 0}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 0 : -1);
              }}
            >
              <PriceItem
                title="Original Order Amount"
                amount={cash?.originalOrderAmount_cash || 0}
                tooltip={
                  <CommonOrderMarketingCashbackTooltipText
                    value={[
                      {
                        label: 'Discount',
                        value: `${currency}${cash?.discount_cash}`,
                      },
                      {
                        label: 'Loyalty Points',
                        value: `${currency}${cash?.loyaltyPoints_cash}`,
                      },
                      {
                        label: 'Buy 1 Get 1',
                        value: `${currency}${cash?.buy1Get1_cash}`,
                      },
                      {
                        label: 'Coupon',
                        value: `${currency}${cash?.couponDiscount_cash}`,
                      },
                    ]}
                  />
                }
              />

              <PriceItem title="Discount" amount={cash?.discount_cash || 0} isNegative />

              <PriceItem title="Loyalty Points" amount={cash?.loyaltyPoints_cash || 0} isNegative />
              <PriceItem title="Buy 1 Get 1" amount={cash?.buy1Get1_cash || 0} isNegative />
              <PriceItem title="Coupons" amount={cash?.couponDiscount_cash || 0} isNegative />
              <PriceItem title="Lyxa Pay" amount={cash?.wallet_cash || 0} amountSx={{ color: '#B5B5C3' }} showIfZero />
            </DetailsAccordion>

            {/* Online */}
            <DetailsAccordion
              sx={{ borderBottom: 'none' }}
              title="Online"
              tooltip="How much amount user paid by online?"
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
                        label: 'Loyalty Points',
                        value: `${currency}${online?.loyaltyPoints_online}`,
                      },
                      {
                        label: 'Buy 1 Get 1',
                        value: `${currency}${online?.buy1Get1_online}`,
                      },
                      {
                        label: 'Coupon',
                        value: `${currency}${online?.couponDiscount_online}`,
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
              <PriceItem
                title="Lyxa Pay"
                amount={online?.wallet_online || 0}
                amountSx={{ color: '#B5B5C3' }}
                showIfZero
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
          <DetailsAccordion
            title="Shop Payouts"
            titleAmount={Math.abs(payout?.totalPayout)}
            titleAmountStatus={`${payout?.totalPayout > 0 ? 'minus' : ''}`}
          />

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
              amount={Math.abs(otherPayments?.adminMarketingCashback || 0)}
              isNegative={otherPayments?.adminMarketingCashback > 0}
              showIfZero
            />

            <PriceItem
              title="Error charge by Lyxa"
              amount={Math.abs(otherPayments?.errorCharge)}
              isNegative={otherPayments?.errorCharge > 0}
              showIfZero
            />

            <PriceItem
              title="Error charge by Shop"
              amount={Math.abs(otherPayments?.shopErrorCharge)}
              isNegative={otherPayments?.shopErrorCharge > 0}
              showIfZero
            />

            <PriceItem
              title="Customer refund by Lyxa"
              amount={Math.abs(otherPayments?.customerRefund || 0)}
              isNegative={otherPayments?.customerRefund > 0}
              showIfZero
            />
            <PriceItem
              title="Customer refund by Shop"
              amount={Math.abs(otherPayments?.shopCustomerRefund || 0)}
              isNegative={otherPayments?.shopCustomerRefund > 0}
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
          </DetailsAccordion>

          {/* profit */}

          <DetailsAccordion
            title="Total Lyxa Profit"
            titleAmount={totalProfit}
            tooltip="How much lyxa earn from order only."
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
