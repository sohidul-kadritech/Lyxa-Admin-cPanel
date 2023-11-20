/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-useless-fragment */
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import DetailsAccordion from '../../components/Shared/FinancialsOverview/DetailsAccordion';
import PriceItem from '../../components/Shared/FinancialsOverview/PriceItem';
import { dateRangeItit, getTotalProfitForLyxa } from '../../components/Shared/FinancialsOverview/helpers';
import DateRange from '../../components/StyledCharts/DateRange';
import InfoCard from '../../components/StyledCharts/InfoCard';
import { useGlobalContext } from '../../context';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { convertDate } from './OrderFinancials';
import { bothCurrencyProfitbreakDown } from './helpers';

const breadcrumbItems = () => [
  {
    label: 'Lyxa Financials',
    to: '/financials/lyxa',
  },
  {
    label: `Lyxa Financials Summary`,
    to: '#',
  },
];

function OrderFinancialsSummary() {
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });

  const { general } = useGlobalContext();

  const theme = useTheme();

  const appSettings = general?.appSetting;

  const { baseCurrency, secondaryCurrency } = appSettings;

  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);

  const [expandedIndex, setExpandedIndex] = useState(-1);

  const currency = general?.currency?.symbol;

  const [currentInfoExpanded, setCurrentInfoExpanded] = useState(-1);

  const getFinancialsDashBoard = useQuery(
    [
      API_URL.GET_FINANCIALS_PROFITBREAKDOWN_SUMMARY,
      { startDate: paymentDetailsRange?.start, endDate: paymentDetailsRange?.end },
    ],
    () =>
      AXIOS.get(API_URL.GET_FINANCIALS_PROFITBREAKDOWN_SUMMARY, {
        params: {
          startDate: convertDate(paymentDetailsRange?.start),
          endDate: convertDate(paymentDetailsRange?.end),
          // orderType: shopType,
        },
      }),
  );

  const getPendingFinancialsDashBoard = useQuery(
    [
      API_URL.GET_FINANCIALS_PENDING_AMOUNT_SUMMARY,
      { startDate: paymentDetailsRange?.start, endDate: paymentDetailsRange?.end },
    ],
    () =>
      AXIOS.get(API_URL.GET_FINANCIALS_PENDING_AMOUNT_SUMMARY, {
        params: {
          startDate: convertDate(paymentDetailsRange?.start),
          endDate: convertDate(paymentDetailsRange?.end),
          // orderType: shopType,
        },
      }),
  );

  const summary = getFinancialsDashBoard?.data?.data;

  const profit = summary?.profit;

  const orderProfit = summary?.orderProfit;

  const deliveryProfit = summary?.deliveryProfit;

  const refund = summary?.refund;

  const marketingSpent = summary?.marketingSpent;

  const marketingCashBack = summary?.adminMarketingCashBack;

  const featured = summary?.featured;

  const errorCharge = summary?.errorCharge;

  const otherAmount = summary?.other;

  const addRemoveCredit = summary?.addRemoveCredit;

  const subscriptionEarning = summary?.subscriptionEarning;

  const subscriptionSpent = summary?.subscriptionSpent;

  console.log({ summary });

  return (
    <Box>
      <PageTop
        backTo="/financials/lyxa"
        backButtonLabel="Back to Lyxa Financials"
        breadcrumbItems={breadcrumbItems()}
      />

      <Box paddingBottom="80px">
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4} mb={7.5}>
          <DateRange setRange={setPaymentDetailsRange} range={paymentDetailsRange} />
        </Stack>
        <Grid container spacing={7.5}>
          {/* 
            Total profit  = (all profit)
            + profit from restaurant
            + profit from grocery
            + profit from pharmacy
            + profit from butler
            + profit from delivery
            - Lyxa Pay */}
          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              title="Total profit"
              sx={{ position: 'absolute', left: 0, zIndex: expandedIndex === 1 ? 9999 : 99 }}
              isDropdown
              index={1}
              expandedIndex={expandedIndex === 1}
              setExpandedIndex={setExpandedIndex}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                    }}
                  >
                    {currency} {(profit?.totalProfit || 0).toFixed(2)}
                  </Typography>

                  {profit?.secondaryCurrency_profit >= 0 ? (
                    <Typography
                      variant="inherit"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {
                        getTotalProfitForLyxa(
                          baseCurrency?.symbol,
                          secondaryCurrency?.code,
                          bothCurrencyProfitbreakDown(profit, 'total_profit'),
                          true,
                        ).printConditionally
                      }
                    </Typography>
                  ) : null}
                </Stack>
              }
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Profit from Restaurant" amount={profit?.profitFromRestaurant} showIfZero />
                <PriceItem title="Profit from Grocery" amount={profit?.profitFromGrocery} showIfZero />
                <PriceItem title="Profit from Pharmacy" amount={profit?.profitFromPharmacy} showIfZero />
                <PriceItem title="Profit from Butler" amount={profit?.profitFromButler} showIfZero />
                <PriceItem title="Profit from Delivery" amount={profit?.profitFromDelivery} showIfZero />
                <PriceItem title="Lyxa Pay" amount={summary?.adminPay} isNegative showIfZero />
                <PriceItem title="Lyxa Plus" amount={subscriptionEarning?.totalSubscriptionEarning} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>

          {/* 
          
          Total order profit   = (without delivery)
          + profit from restaurant
          + profit from grocery
          + profit from pharmacy
          
          */}
          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              sx={{ position: 'absolute', left: 0, zIndex: expandedIndex === 2 ? 9999 : 99 }}
              title="Total orders profit"
              isDropdown
              index={2}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 2}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                    }}
                  >
                    {currency} {(orderProfit?.totalOrderProfit || 0).toFixed(2)}
                  </Typography>

                  {orderProfit?.secondaryCurrency_orderProfit >= 0 ? (
                    <Typography
                      variant="inherit"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {
                        getTotalProfitForLyxa(
                          baseCurrency?.symbol,
                          secondaryCurrency?.code,
                          bothCurrencyProfitbreakDown(orderProfit, 'total_order_profit'),
                          true,
                        ).printConditionally
                      }
                    </Typography>
                  ) : null}
                </Stack>
              }
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Profit from Restaurant" amount={orderProfit?.orderProfitFromRestaurant} showIfZero />
                <PriceItem title="Profit from Grocery" amount={orderProfit?.orderProfitFromGrocery} showIfZero />
                <PriceItem title="Profit from Pharmacy" amount={orderProfit?.orderProfitFromPharmacy} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>
          {/* 
            Total Delivery profit   = (only delivery)
            + profit from restaurant
            + profit from grocery
            + profit from pharmacy
            + profit from butler
           */}
          <Grid item xs={6} md={4}>
            <InfoCard
              title="Total delivery profit"
              sx={{ position: 'absolute', left: 0, zIndex: expandedIndex === 3 ? 9999 : 99 }}
              isDropdown
              index={3}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 3}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                    }}
                  >
                    {currency} {(deliveryProfit?.totalDeliveryProfit || 0).toFixed(2)}
                  </Typography>

                  {deliveryProfit?.secondaryCurrency_deliveryProfit >= 0 ? (
                    <Typography
                      variant="inherit"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {
                        getTotalProfitForLyxa(
                          baseCurrency?.symbol,
                          secondaryCurrency?.code,
                          bothCurrencyProfitbreakDown(deliveryProfit, 'total_delivery_profit'),
                          true,
                        ).printConditionally
                      }
                    </Typography>
                  ) : null}
                </Stack>
              }
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem
                  title="Profit from Restaurant"
                  amount={deliveryProfit?.deliveryProfitFromRestaurant}
                  showIfZero
                />
                <PriceItem title="Profit from Grocery" amount={deliveryProfit?.deliveryProfitFromGrocery} showIfZero />
                <PriceItem
                  title="Profit from Pharmacy"
                  amount={deliveryProfit?.deliveryProfitFromPharmacy}
                  showIfZero
                />
                <PriceItem title="Profit from Butler" amount={deliveryProfit?.deliveryProfitFromButler} showIfZero />
                <PriceItem
                  title="Add/Remove Credit from Delivery"
                  amount={addRemoveCredit?.addRemoveCreditFromRider}
                  isNegative={addRemoveCredit?.addRemoveCreditFromRider < 0}
                  showIfZero
                />
              </Stack>
            </InfoCard>
          </Grid>
          {/* 
            Total refund   = 
            + refund from restaurant
            + refund from grocery
            + refund from pharmacy
          */}
          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              title="Total refund"
              sx={{ position: 'absolute', left: 0, zIndex: expandedIndex === 4 ? 9999 : 99 }}
              isDropdown
              index={4}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 4}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                    }}
                  >
                    {currency} {(refund?.totalRefund || 0).toFixed(2)}
                  </Typography>

                  {deliveryProfit?.secondaryCurrency_refund >= 0 ? (
                    <Typography
                      variant="inherit"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {
                        getTotalProfitForLyxa(
                          baseCurrency?.symbol,
                          secondaryCurrency?.code,
                          bothCurrencyProfitbreakDown(refund, 'total_refund'),
                          true,
                        ).printConditionally
                      }
                    </Typography>
                  ) : null}
                </Stack>
              }
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Refund from Restaurant" amount={refund?.refundFromRestaurant} showIfZero />
                <PriceItem title="Refund from Grocery" amount={refund?.refundFromGrocery} showIfZero />
                <PriceItem title="Refund from Pharmacy" amount={refund?.refundFromPharmacy} showIfZero />
                <PriceItem title="Refund from Delivery" amount={refund?.refundFromDelivery} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>
          {/* 
            Total marketing spend = 
 	          + marketing spent from restaurant 
	          	+ discount,
	          	+ loyality,
	          	+ buy 1, get 1,
	          	+ coupon
                  
 	          + marketing spent from grocery
	          	+ discount,
	          	+ loyality,
	          	+ buy 1, get 1,
	          	+ coupon,
	          + marketing spent from pharmacy
	          	+ discount,
	          	+ loyality,
	          	+ buy 1, get 1,
	          	+ coupon,
	          +  Free delivery (Lyxa)
          */}
          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              title="Total marketing spent"
              sx={{ position: 'absolute', left: 0, zIndex: expandedIndex === 5 ? 9999 : 99 }}
              isDropdown
              index={5}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 5}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                    }}
                  >
                    {currency} {(marketingSpent?.totalMarketingSpent || 0).toFixed(2)}
                  </Typography>

                  {marketingSpent?.secondaryCurrency_marketingSpent >= 0 ? (
                    <Typography
                      variant="inherit"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {
                        getTotalProfitForLyxa(
                          baseCurrency?.symbol,
                          secondaryCurrency?.code,
                          bothCurrencyProfitbreakDown(marketingSpent, 'total_marketing_spent'),
                          true,
                        ).printConditionally
                      }
                    </Typography>
                  ) : null}
                </Stack>
              }
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={0}>
                <DetailsAccordion
                  title="Marketing spent from Restaurant"
                  // VAT inclusive"
                  summarySx={{ padding: '8px 0px' }}
                  sx={{ borderBottom: 'none' }}
                  titleAmount={marketingSpent?.restaurant?.marketingSpentFromRestaurant || 0}
                  isOpen={currentExpanedTab === 1}
                  onChange={(closed) => {
                    seCurrentExpanedTab(closed ? 1 : -1);
                  }}
                >
                  <PriceItem
                    title="discount"
                    amount={marketingSpent?.restaurant?.discountFromRestaurant || 0}
                    showIfZero
                  />
                  <PriceItem
                    title="discount for lyxa plus"
                    amount={marketingSpent?.restaurant?.discountFromRestaurantForSubscription || 0}
                    showIfZero
                  />
                  <PriceItem
                    title="loyality"
                    amount={marketingSpent?.restaurant?.loyaltyPointFromRestaurant}
                    showIfZero
                  />
                  <PriceItem
                    title="buy 1, get 1"
                    amount={marketingSpent?.restaurant?.buy1Get1FromRestaurant}
                    showIfZero
                  />
                  <PriceItem
                    title="buy 1, get 1 for lyxa plus"
                    amount={marketingSpent?.restaurant?.buy1Get1FromRestaurantForSubscription}
                    showIfZero
                  />
                  <PriceItem
                    title="coupon"
                    amount={marketingSpent?.restaurant?.couponDiscountFromRestaurant}
                    showIfZero
                  />
                </DetailsAccordion>
                <DetailsAccordion
                  title="Marketing spent from Grocery"
                  // VAT inclusive"
                  sx={{ borderBottom: 'none' }}
                  summarySx={{ padding: '8px 0px' }}
                  titleAmount={marketingSpent?.grocery?.marketingSpentFromGrocery}
                  isOpen={currentExpanedTab === 1}
                  onChange={(closed) => {
                    seCurrentExpanedTab(closed ? 1 : -1);
                  }}
                >
                  <PriceItem title="discount" amount={marketingSpent?.grocery?.discountFromGrocery} showIfZero />
                  <PriceItem
                    title="discount for lyxa plus"
                    amount={marketingSpent?.grocery?.discountFromGroceryForSubscription}
                    showIfZero
                  />
                  <PriceItem title="loyality" amount={marketingSpent?.grocery?.loyaltyPointFromGrocery} showIfZero />
                  <PriceItem title="buy 1, get 1" amount={marketingSpent?.grocery?.buy1Get1FromGrocery} showIfZero />
                  <PriceItem
                    title="buy 1, get 1 for lyxa plus"
                    amount={marketingSpent?.grocery?.buy1Get1FromGroceryForSubscription}
                    showIfZero
                  />
                  <PriceItem title="coupon" amount={marketingSpent?.grocery?.couponDiscountFromGrocery} showIfZero />
                </DetailsAccordion>
                <DetailsAccordion
                  title="Marketing spent from Pharmacy"
                  // VAT inclusive"
                  summarySx={{ padding: '8px 0px' }}
                  sx={{ borderBottom: 'none' }}
                  titleAmount={marketingSpent?.pharmacy?.marketingSpentFromPharmacy}
                  isOpen={currentExpanedTab === 1}
                  onChange={(closed) => {
                    seCurrentExpanedTab(closed ? 1 : -1);
                  }}
                >
                  <PriceItem title="discount" amount={marketingSpent?.pharmacy?.discountFromPharmacy} showIfZero />
                  <PriceItem
                    title="discount for lyxa plus"
                    amount={marketingSpent?.pharmacy?.discountFromPharmacyForSubscription}
                    showIfZero
                  />
                  <PriceItem title="loyality" amount={marketingSpent?.pharmacy?.loyaltyPointFromPharmacy} showIfZero />
                  <PriceItem title="buy 1, get 1" amount={marketingSpent?.pharmacy?.buy1Get1FromPharmacy} showIfZero />
                  <PriceItem
                    title="buy 1, get 1 for lyxa plus"
                    amount={marketingSpent?.pharmacy?.buy1Get1FromPharmacyForSubscription}
                    showIfZero
                  />
                  <PriceItem title="coupon" amount={marketingSpent?.pharmacy?.couponDiscountFromPharmacy} showIfZero />
                </DetailsAccordion>
                <DetailsAccordion
                  summarySx={{ padding: '8px 0px' }}
                  title="Marketing spent from Free Delivery"
                  sx={{ borderBottom: 'none' }}
                  titleAmount={marketingSpent?.delivery?.marketingSpentFromDelivery}
                  isOpen={currentExpanedTab === 1}
                  onChange={(closed) => {
                    seCurrentExpanedTab(closed ? 1 : -1);
                  }}
                >
                  <PriceItem title="Free Delivery by Lyxa" amount={marketingSpent?.delivery?.freeDelivery} showIfZero />
                  <PriceItem
                    title="Free Delivery by Lyxa plus"
                    amount={marketingSpent?.delivery?.freeDeliveryForSubscription}
                    showIfZero
                  />
                </DetailsAccordion>
              </Stack>
            </InfoCard>
          </Grid>

          {/* 
          
            How much earn from featured only
            + refund from restaurant
            + refund from grocery
            + refund from pharmacy
          
          */}

          <Grid item xs={6} md={4}>
            <InfoCard
              title="Featured Earning"
              sx={{ position: 'absolute', left: 0, zIndex: expandedIndex === 7 ? 9999 : 99 }}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                    }}
                  >
                    {currency} {(featured?.totalFeaturedAmount || 0).toFixed(2)}
                  </Typography>

                  {featured?.secondaryCurrency_featuredAmount >= 0 ? (
                    <Typography
                      variant="inherit"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {
                        getTotalProfitForLyxa(
                          baseCurrency?.symbol,
                          secondaryCurrency?.code,
                          bothCurrencyProfitbreakDown(featured, 'featured'),
                          true,
                        ).printConditionally
                      }
                    </Typography>
                  ) : null}
                </Stack>
              }
              isDropdown
              index={7}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 7}
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem
                  title="Featured from Restaurant"
                  amount={featured?.featuredAmountFromRestaurant}
                  showIfZero
                />
                <PriceItem title="Featured from Grocery" amount={featured?.featuredAmountFromGrocery} showIfZero />
                <PriceItem title="Featured from Pharmacy" amount={featured?.featuredAmountFromPharmacy} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard
              title="Error Charge"
              sx={{ position: 'relative', left: 0, zIndex: expandedIndex === 8 ? 9999 : 99 }}
              index={8}
              setExpandedIndex={setExpandedIndex}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                      color:
                        errorCharge?.totalErrorCharge >= 0
                          ? `${theme.palette.danger.main} !important`
                          : `${theme.palette.text.primary} !important`,
                    }}
                  >
                    {errorCharge?.totalErrorCharge >= 0 ? '-' : ''} {currency}{' '}
                    {(errorCharge?.totalErrorCharge || 0).toFixed(2)}
                  </Typography>

                  {errorCharge?.secondaryCurrency_errorCharge >= 0 ? (
                    <Typography
                      variant="inherit"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {
                        getTotalProfitForLyxa(
                          baseCurrency?.symbol,
                          secondaryCurrency?.code,
                          bothCurrencyProfitbreakDown(errorCharge, 'errorCharge'),
                          true,
                        ).printConditionally
                      }
                    </Typography>
                  ) : null}
                </Stack>
              }
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem
                  title="Replacement orders by Lyxa"
                  amount={otherAmount?.replacementOrderByAdmin}
                  showIfZero
                />
                {/* <PriceItem title="Error Charge" amount={0} showIfZero /> */}
                {/* <PriceItem title="replacement orders by Lyxa" amount={0} showIfZero /> */}
                {/* <PriceItem title="Error order by Lyxa ( endure loss )" amount={0} showIfZero /> */}
                <PriceItem
                  title="Error order by Lyxa (endure loss)"
                  amount={otherAmount?.errorOrderByAdmin}
                  showIfZero
                />
              </Stack>
            </InfoCard>
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard
              title="Lyxa Plus Marketing Spent"
              sx={{ position: 'absolute', left: 0, zIndex: expandedIndex === 9 ? 9999 : 99 }}
              isDropdown
              index={9}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 9}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                    }}
                  >
                    {currency} {(subscriptionSpent?.totalSubscriptionSpent || 0).toFixed(2)}
                  </Typography>
                  {subscriptionSpent?.secondaryCurrency_subscriptionSpent >= 0 ? (
                    <Typography
                      variant="inherit"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {
                        getTotalProfitForLyxa(
                          baseCurrency?.symbol,
                          secondaryCurrency?.code,
                          bothCurrencyProfitbreakDown(subscriptionSpent, 'subscription_spent'),
                          true,
                        ).printConditionally
                      }
                    </Typography>
                  ) : null}
                </Stack>
              }
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Discount" amount={subscriptionSpent?.totalSubscriptionDiscount} showIfZero />

                <PriceItem
                  title="Buy 1, Get 1"
                  amount={subscriptionSpent?.totalSubscriptionDoubleMenuLoss}
                  showIfZero
                />

                <PriceItem title="Free delivery" amount={subscriptionSpent?.totalSubscriptionFreeDelivery} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard
              title="Free delivery by shop"
              sx={{ position: 'relative', left: 0 }}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                    }}
                  >
                    {currency} {(summary?.freeDeliveryShopCut || 0).toFixed(2)}
                  </Typography>

                  {summary?.secondaryCurrency_freeDeliveryShopCut >= 0 ? (
                    <Typography
                      variant="inherit"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {
                        getTotalProfitForLyxa(
                          baseCurrency?.symbol,
                          secondaryCurrency?.code,
                          bothCurrencyProfitbreakDown(summary, 'free_delivery'),
                          true,
                        ).printConditionally
                      }
                    </Typography>
                  ) : null}
                </Stack>
              }
              sm={6}
              md={4}
              lg={4}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard
              title="Lyxa pay"
              sx={{ position: 'relative', left: 0 }}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                    }}
                  >
                    {currency} {(summary?.adminPay || 0).toFixed(2)}
                  </Typography>

                  {summary?.secondaryCurrency_adminPay >= 0 ? (
                    <Typography
                      variant="inherit"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {
                        getTotalProfitForLyxa(
                          baseCurrency?.symbol,
                          secondaryCurrency?.code,
                          bothCurrencyProfitbreakDown(summary, 'lyxa_pay'),
                          true,
                        ).printConditionally
                      }
                    </Typography>
                  ) : null}
                </Stack>
              }
              sm={6}
              md={4}
              lg={4}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard
              title="Add/Remove Credit"
              sx={{ position: 'absolute', left: 0, zIndex: 990 }}
              isDropdown
              index={10}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 10}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                    }}
                  >
                    {currency} {(addRemoveCredit?.totalAddRemoveCredit || 0).toFixed(2)}
                  </Typography>

                  {addRemoveCredit?.secondaryCurrency_addRemoveCredit >= 0 ? (
                    <Typography
                      variant="inherit"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {
                        getTotalProfitForLyxa(
                          baseCurrency?.symbol,
                          secondaryCurrency?.code,
                          bothCurrencyProfitbreakDown(addRemoveCredit, 'add_remove_credit'),
                          true,
                        ).printConditionally
                      }
                    </Typography>
                  ) : null}
                </Stack>
              }
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem
                  title="Add/Remove Credit from Restaurant"
                  amount={Math.abs(addRemoveCredit?.addRemoveCreditFromRestaurant)}
                  isNegative={addRemoveCredit?.addRemoveCreditFromRestaurant < 0}
                  showIfZero
                />
                <PriceItem
                  title="Add/Remove Credit from Grocery"
                  amount={Math.abs(addRemoveCredit?.addRemoveCreditFromGrocery)}
                  isNegative={addRemoveCredit?.addRemoveCreditFromGrocery < 0}
                  showIfZero
                />
                <PriceItem
                  title="Add/Remove Credit from Pharmacy"
                  amount={Math.abs(addRemoveCredit?.addRemoveCreditFromPharmacy)}
                  isNegative={addRemoveCredit?.refundFromPharmacy < 0}
                  showIfZero
                />
                <PriceItem
                  title="Add/Remove Credit from Delivery"
                  amount={Math.abs(addRemoveCredit?.addRemoveCreditFromRider)}
                  isNegative={addRemoveCredit?.addRemoveCreditFromRider < 0}
                  showIfZero
                />
              </Stack>
            </InfoCard>
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard
              title="Total Pending Amount"
              sx={{ position: 'relative', left: 0, zIndex: expandedIndex === 8 ? 9999 : 99 }}
              index={8}
              setExpandedIndex={setExpandedIndex}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                    }}
                  >
                    {currency} {(getPendingFinancialsDashBoard?.data?.data?.totalOngoingOrderAmount || 0).toFixed(2)}
                  </Typography>
                </Stack>
              }
              sm={6}
              md={4}
              lg={4}
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <InfoCard
              title="Lyxa Plus Earning"
              sx={{ position: 'relative', left: 0, zIndex: expandedIndex === 8 ? 9999 : 99 }}
              index={8}
              setExpandedIndex={setExpandedIndex}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                    }}
                  >
                    {currency} {(subscriptionEarning?.totalSubscriptionEarning || 0).toFixed(2)}
                  </Typography>
                  {subscriptionEarning?.secondaryCurrency_subscriptionEarning >= 0 ? (
                    <Typography
                      variant="inherit"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {
                        getTotalProfitForLyxa(
                          baseCurrency?.symbol,
                          secondaryCurrency?.code,
                          bothCurrencyProfitbreakDown(subscriptionEarning, 'subscription_earning'),
                          true,
                        ).printConditionally
                      }
                    </Typography>
                  ) : null}
                </Stack>
              }
              sm={6}
              md={4}
              lg={4}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default OrderFinancialsSummary;
