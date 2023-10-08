/* eslint-disable no-unused-vars */
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
import { CommonOrderAmountTooltipText, CommonOrderMarketingCashbackTooltipText, getTotalProfit } from './helpers';

export default function PayoutDetails({ paymentDetails, viewUserType }) {
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;

  const totalProfit = getTotalProfit(currency, secondaryCurrency, paymentDetails);

  const cash = paymentDetails?.cash;
  const online = paymentDetails?.online;
  const lyxaMarketingCashback = paymentDetails?.AdminMarketingCashback;
  const otherPayments = paymentDetails?.otherPayments;
  const deliveryFee = paymentDetails?.deliveryFee;

  // console.log('shopConsole', deliveryFee);

  const orderValue = {};

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
          order amount
          ---------------
          Formula: 
          ---------
          Original Order amount
          - double deal/buy 1 get 1 added by shop
          - discount added by shop
          - loyalty points added boy shop
          - coupon added by lyxa (it only applicable by lyxa)
          = cash/online (when we expand it will show the above list items)
          + marketing lyxa cashback
          = order amount
          ---------------
          */}

          <DetailsAccordion
            title="Order Amount"
            tooltip="The fees you earn depend on how your customer order and receive their order."
            titleAmount={paymentDetails?.orderAmount}
            isOpen={currentExpanedTab === 0}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 0 : -1);
            }}
          >
            <DetailsAccordion
              title="Cash"
              tooltip="How much amount user paid by cash?"
              titleAmount={cash?.totalCash}
              isOpen={currentExpanedTab === 0}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 0 : -1);
              }}
            >
              <PriceItem
                title="Original Order Amount"
                amount={cash?.originalOrderAmount_cash}
                tooltip={
                  <CommonOrderMarketingCashbackTooltipText
                    value={[
                      {
                        label: 'Discount',
                        value: `${currency}${cash?.discount_cash}`,
                      },
                      {
                        label: 'Buy 1 Get 1',
                        value: `${currency}${cash?.buy1Get1_cash}`,
                      },

                      {
                        label: 'Loyalyt Points',
                        value: `${currency}${cash?.loyaltyPoints_cash}`,
                      },
                    ]}
                  />
                }
              />

              <PriceItem title="Discount" amount={cash?.discount_cash} isNegative />

              <PriceItem title="Buy 1 Get 1" amount={cash?.buy1Get1_cash} isNegative />

              <PriceItem title="Loyalty Points" amount={cash?.loyaltyPoints_cash || 0} isNegative />

              <PriceItem title="Coupons" amount={cash?.couponDiscount_cash || 0} isNegative />
            </DetailsAccordion>

            {/* Online */}
            <DetailsAccordion
              sx={{ borderBottom: 'none' }}
              title="Online"
              tooltip="How much amount user paid by online?"
              titleAmount={online?.totalOnline}
              isOpen={currentExpanedTab === 0}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 0 : -1);
              }}
            >
              <PriceItem
                title="Original Order Amount"
                amount={online?.originalOrderAmount_online}
                tooltip={
                  <CommonOrderMarketingCashbackTooltipText
                    value={[
                      {
                        label: 'Discount',
                        value: `${currency} ${online?.discount_online}`,
                      },
                      {
                        label: 'Buy 1 Get 1',
                        value: `${currency} ${online?.buy1Get1_online}`,
                      },
                      {
                        label: 'Loyalyt Points',
                        value: `${currency} ${online?.loyaltyPoints_online}`,
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
                title="Lyxa Marketing Cashback"
                amount={lyxaMarketingCashback?.adminMarketingCashback}
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

          <PriceItem
            sx={{ padding: '14px 0px 14px 32px', borderBottom: '1px solid #EEEEEE' }}
            title="Lyxa fees"
            amount={Math.abs(paymentDetails?.adminFees)}
            isNegative={paymentDetails?.adminFees > 0}
          />

          <PriceItem
            sx={{ padding: '14px 0px 14px 32px', borderBottom: '1px solid #EEEEEE' }}
            title="Lyxa Points cashback"
            amount={paymentDetails?.pointsCashback}
          />

          {/* Other payments */}

          <DetailsAccordion
            title="Other Payments"
            titleAmount={Math.abs(otherPayments?.totalOtherPayments)}
            titleAmountStatus={`${otherPayments?.totalOtherPayments < 0 ? '' : 'minus'}`}
            isOpen={currentExpanedTab === 2}
            onChange={(closed) => {
              seCurrentExpanedTab(closed ? 2 : -1);
            }}
          >
            <PriceItem
              title="Promotion: Free delivery"
              tooltip="If Lxya rider"
              amount={otherPayments?.freeDeliveryByShop}
              showIfZero
              isNegative
            />

            <PriceItem title="Promotion: Featured" amount={otherPayments?.featuredAmount} showIfZero isNegative />

            <PriceItem
              title="Error Charge"
              amount={Math.abs(otherPayments?.errorCharge)}
              isNegative={otherPayments?.errorCharge > 0}
              showIfZero
            />

            <PriceItem
              title="Shop add/remove credit"
              amount={Math.abs(otherPayments?.shopAddRemoveCredit)}
              isNegative={otherPayments?.shopAddRemoveCredit < 0}
              showIfZero
            />

            <PriceItem title="Refunded Amount" amount={otherPayments?.customerRefund} isNegative showIfZero />
          </DetailsAccordion>

          {/* total vat */}

          <PriceItem
            sx={{ padding: '14px 0px 14px 32px', borderBottom: '1px solid #EEEEEE' }}
            title="Total VAT"
            amount={Math.abs(paymentDetails?.totalVat)}
          />

          {/* delivery */}
          {deliveryFee?.deliveryFee > 0 && (
            <DetailsAccordion
              title="Delivery fee"
              titleAmount={deliveryFee?.deliveryFee}
              tooltip="If self delivery"
              isOpen={currentExpanedTab === 2}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 2 : -1);
              }}
            >
              <PriceItem title="Cash" amount={deliveryFee?.cash} />

              {deliveryFee?.online > 0 && (
                <DetailsAccordion
                  title="Online"
                  titleAmount={deliveryFee?.online}
                  sx={{ borderBottom: 'none' }}
                  isOpen={currentExpanedTab === 4}
                  onChange={(closed) => {
                    seCurrentExpanedTab(closed ? 4 : -1);
                  }}
                >
                  <PriceItem title="Delivery fee" amount={deliveryFee?.deliveryFee_online} />
                  <PriceItem title="Rider tip" amount={deliveryFee?.riderTip_online} />
                </DetailsAccordion>
              )}
            </DetailsAccordion>
          )}

          {/* total payout */}
          {viewUserType === 'seller' || viewUserType === 'shop' ? (
            <DetailsAccordion
              title="Total Payouts"
              titleAmount={totalProfit}
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
                amount={Math.abs(paymentDetails?.totalPaid)}
                isNegative={paymentDetails?.totalPaid < 0}
              />

              <PriceItem
                title="Unpaid"
                // console={console.log('totalUnsettle', paymentDetails?.totalUnpaid)}
                amount={Math.abs(paymentDetails?.totalUnpaid)}
                isNegative={paymentDetails?.totalUnpaid < 0}
              />
            </DetailsAccordion>
          ) : (
            <DetailsAccordion
              title="Total Payouts"
              titleAmount={totalProfit}
              tooltip="Shop's overall income: orders, delivery, VAT."
              titleAmountStatus={paymentDetails?.totalProfit < 0 ? 'minus' : ''}
              isOpen={currentExpanedTab === 3}
              onChange={(closed) => {
                seCurrentExpanedTab(closed ? 3 : -1);
              }}
              sx={{
                borderBottom: '0',
              }}
            />
          )}
        </Box>
      </StyledBox>
    </Grid>
  );
}
