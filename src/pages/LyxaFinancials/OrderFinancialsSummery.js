/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-useless-fragment */
import { Box, Grid, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import DetailsAccordion from '../../components/Shared/FinancialsOverview/DetailsAccordion';
import PriceItem from '../../components/Shared/FinancialsOverview/PriceItem';
import { dateRangeItit } from '../../components/Shared/FinancialsOverview/helpers';
import DateRange from '../../components/StyledCharts/DateRange';
import InfoCard from '../../components/StyledCharts/InfoCard';
import { useGlobalContext } from '../../context';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { convertDate } from './OrderFinancials';

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
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);

  // eslint-disable-next-line no-unused-vars
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const currency = general?.currency?.symbol;

  // eslint-disable-next-line no-unused-vars
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

  console.log('getFinancialsDashBoard', getFinancialsDashBoard?.data?.data);

  const summary = getFinancialsDashBoard?.data?.data;

  const profit = summary?.profit;

  const orderProfit = summary?.orderProfit;

  const deliveryProfit = summary?.deliveryProfit;

  const refund = summary?.refund;

  const marketingSpent = summary?.marketingSpent;

  const marketingCashBack = summary?.adminMarketingCashBack;

  const fetured = summary?.featured;

  const otherAmount = summary?.other;

  return (
    <Box>
      <PageTop
        backTo="/financials/lyxa"
        backButtonLabel="Back to Lyxa Financials"
        breadcrumbItems={breadcrumbItems()}
      />

      <Box>
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4} mb={7.5}>
          <DateRange setRange={setPaymentDetailsRange} range={paymentDetailsRange} />
        </Stack>
        <Grid container spacing={7.5}>
          {/* Total profit including delivery */}
          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              title="Total Profit"
              sx={{ position: 'absolute', left: 0, zIndex: 9999 }}
              isDropdown
              index={1}
              expandedIndex={expandedIndex === 1}
              setExpandedIndex={setExpandedIndex}
              value={`${currency} ${(profit?.totalProfit || 0).toFixed(2)}`}
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
              </Stack>
            </InfoCard>
          </Grid>
          {/* total order profit */}
          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              sx={{ position: 'absolute', left: 0, zIndex: 9999 }}
              title="Total Orders profit"
              isDropdown
              index={2}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 2}
              value={`${currency} ${(orderProfit?.totalOrderProfit || 0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Profit from Restaurant" amount={orderProfit?.orderProfitFromRestaurant} showIfZero />
                <PriceItem title="Profit from Grocery" amount={orderProfit?.orderProfitFromGrocery} showIfZero />
                <PriceItem title="Profit from Pharmacy" amount={orderProfit?.orderProfitFromPharmacy} showIfZero />
                <PriceItem title="Profit from Butler" amount={orderProfit?.orderProfitFromButler} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>
          {/* delivery profit */}
          <Grid item xs={6} md={4}>
            <InfoCard
              title="Total Delivery Profit"
              sx={{ position: 'absolute', left: 0, zIndex: 9999 }}
              isDropdown
              index={3}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 3}
              value={`${currency} ${(deliveryProfit?.totalDeliveryProfit || 0).toFixed(2)}`}
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
              </Stack>
            </InfoCard>
          </Grid>
          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              title="Total Refund"
              sx={{ position: 'absolute', left: 0, zIndex: 999 }}
              isDropdown
              index={4}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 4}
              value={`${currency} ${(refund?.totalRefund || 0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Refund from Restaurant" amount={refund?.refundFromRestaurant} showIfZero />
                <PriceItem title="Refund from Grocery" amount={refund?.refundFromGrocery} showIfZero />
                <PriceItem title="Refund from Pharmacy" amount={refund?.refundFromPharmacy} showIfZero />
                <PriceItem title="Refund from Butler" amount={refund?.refundFromButler} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>
          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              title="Total Marketing Spent"
              sx={{ position: 'absolute', left: 0, zIndex: 999 }}
              isDropdown
              index={5}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 5}
              value={`${currency} ${(marketingSpent?.totalMarketingSpent || 0).toFixed(2)}`}
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
                  titleAmount={marketingSpent?.restaurent?.marketingSpentFromRestaurant || 0}
                  isOpen={currentExpanedTab === 1}
                  onChange={(closed) => {
                    seCurrentExpanedTab(closed ? 1 : -1);
                  }}
                >
                  <PriceItem title="discount" amount={marketingSpent?.restaurent?.discountFromRestaurant} showIfZero />
                  <PriceItem
                    title="loyality"
                    amount={marketingSpent?.restaurent?.loyaltyPointFromRestaurant}
                    showIfZero
                  />
                  <PriceItem
                    title="buy 1, get 1"
                    amount={marketingSpent?.restaurent?.buy1Get1FromRestaurant}
                    showIfZero
                  />
                  <PriceItem
                    title="coupon"
                    amount={marketingSpent?.restaurent?.couponDiscountFromRestaurant}
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
                  <PriceItem title="loyality" amount={marketingSpent?.grocery?.loyaltyPointFromGrocery} showIfZero />
                  <PriceItem title="buy 1, get 1" amount={marketingSpent?.grocery?.buy1Get1FromGrocery} showIfZero />
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
                  <PriceItem title="loyality" amount={marketingSpent?.pharmacy?.loyaltyPointFromPharmacy} showIfZero />
                  <PriceItem title="buy 1, get 1" amount={marketingSpent?.pharmacy?.buy1Get1FromPharmacy} showIfZero />
                  <PriceItem title="coupon" amount={marketingSpent?.pharmacy?.couponDiscountFromPharmacy} showIfZero />
                </DetailsAccordion>
                <DetailsAccordion
                  summarySx={{ padding: '8px 0px' }}
                  title="Marketing spent from Delivery"
                  sx={{ borderBottom: 'none' }}
                  titleAmount={marketingSpent?.delivery?.marketingSpentFromDelivery}
                  isOpen={currentExpanedTab === 1}
                  onChange={(closed) => {
                    seCurrentExpanedTab(closed ? 1 : -1);
                  }}
                >
                  <></>
                  <PriceItem
                    title="Free Delivery"
                    amount={marketingSpent?.delivery?.freeDelivery}
                    isNegative
                    showIfZero
                  />
                </DetailsAccordion>
              </Stack>
            </InfoCard>
          </Grid>

          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              title="Marketing cashback"
              sx={{ position: 'absolute', left: 0, zIndex: 999 }}
              isDropdown
              index={6}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 6}
              value={`${currency} ${(marketingCashBack?.adminMarketingCashback || 0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Discount" amount={marketingCashBack?.discount_amc} showIfZero />
                {/* <PriceItem title="Loyality points" amount={marketingCashBack?.couponDiscount_amc} showIfZero /> */}
                <PriceItem title="Buy 1, get 1" amount={marketingCashBack?.buy1Get1_amc} showIfZero />
                <PriceItem title="Coupon" amount={marketingCashBack?.couponDiscount_amc} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>

          <Grid item xs={6} md={4}>
            <InfoCard
              title="How much earn from featured only?"
              sx={{ position: 'relative', left: 0 }}
              value={`${currency} ${(fetured?.totalFeaturedAmount || 0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard
              title="Other Amount"
              sx={{ position: 'relative', left: 0 }}
              isDropdown
              index={7}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 7}
              value={`${currency} ${(otherAmount?.otherAmount || 0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Lyxa Marketing Cashback" amount={otherAmount?.adminMarketingCashback} showIfZero />
                {/* <PriceItem title="Error Charge" amount={0} showIfZero /> */}
                {/* <PriceItem title="replacement orders by Lyxa" amount={0} showIfZero /> */}
                {/* <PriceItem title="Error order by Lyxa ( endure loss )" amount={0} showIfZero /> */}
                <PriceItem
                  title="Free delivery by shop (Lyxa riders)"
                  amount={otherAmount?.freeDeliveryByShop}
                  showIfZero
                />
              </Stack>
            </InfoCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default OrderFinancialsSummary;
