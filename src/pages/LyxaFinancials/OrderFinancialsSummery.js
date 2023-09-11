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

  const summary = getFinancialsDashBoard?.data?.data;

  const profit = summary?.profit;

  const orderProfit = summary?.orderProfit;

  const deliveryProfit = summary?.deliveryProfit;

  const refund = summary?.refund;

  const marketingSpent = summary?.marketingSpent;

  const marketingCashBack = summary?.adminMarketingCashBack;

  const featured = summary?.featured;

  const otherAmount = summary?.other;

  const addRemoveCredit = summary?.addRemoveCredit;

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
                <PriceItem title="Lyxa Pay" amount={summary?.adminPay} isNegative showIfZero />
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
              sx={{ position: 'absolute', left: 0, zIndex: 9999 }}
              title="Total orders profit"
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
          {/* 
            Total refund   = 
            + refund from restaurant
            + refund from grocery
            + refund from pharmacy
          */}
          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              title="Total refund"
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
                  title="Marketing spent from Free Delivery"
                  sx={{ borderBottom: 'none' }}
                  titleAmount={marketingSpent?.delivery?.marketingSpentFromDelivery}
                  isOpen={currentExpanedTab === 1}
                  onChange={(closed) => {
                    seCurrentExpanedTab(closed ? 1 : -1);
                  }}
                >
                  <></>
                  <PriceItem
                    title="Free Delivery by Lyxa"
                    amount={marketingSpent?.delivery?.freeDelivery}
                    // isNegative
                    showIfZero
                  />
                </DetailsAccordion>
              </Stack>
            </InfoCard>
          </Grid>

          {/* <Grid item xs={6} md={4} height="140px">
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
                <PriceItem title="Loyality points" amount={marketingCashBack?.couponDiscount_amc} showIfZero />
                <PriceItem title="Buy 1, get 1" amount={marketingCashBack?.buy1Get1_amc} showIfZero />
                <PriceItem title="Coupon" amount={marketingCashBack?.couponDiscount_amc} showIfZero />
              </Stack>
            </InfoCard>
          </Grid> */}

          {/* 
          
            How much earn from featured only
            + refund from restaurant
            + refund from grocery
            + refund from pharmacy
          
          */}

          <Grid item xs={6} md={4}>
            <InfoCard
              title="Featured Earning"
              sx={{ position: 'absolute', left: 0, zIndex: 999 }}
              value={`${currency} ${(featured?.totalFeaturedAmount || 0).toFixed(2)}`}
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
              title="Other amount"
              sx={{ position: 'absolute', left: 0, zIndex: 999 }}
              isDropdown
              index={8}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 8}
              value={`${currency} ${(otherAmount?.otherAmount || 0).toFixed(2)}`}
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
              title="Free delivery by shop"
              sx={{ position: 'relative', left: 0 }}
              value={`${currency} ${(summary?.freeDeliveryShopCut || 0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard
              title="Lyxa pay"
              sx={{ position: 'relative', left: 0 }}
              value={`${currency} ${(summary?.adminPay || 0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard
              title="Shop Add/Remove Credit"
              sx={{ position: 'absolute', left: 0, zIndex: 990 }}
              isDropdown
              index={10}
              setExpandedIndex={setExpandedIndex}
              expandedIndex={expandedIndex === 10}
              value={`${currency} ${(addRemoveCredit?.totalAddRemoveCredit || 0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem
                  title="Add/Remove from Restaurant"
                  amount={Math.abs(addRemoveCredit?.addRemoveCreditFromRestaurant)}
                  isNegative={addRemoveCredit?.addRemoveCreditFromRestaurant > 0}
                  showIfZero
                />
                <PriceItem
                  title="Add/Remove from Grocery"
                  amount={Math.abs(addRemoveCredit?.addRemoveCreditFromPharmacy)}
                  isNegative={addRemoveCredit?.addRemoveCreditFromPharmacy > 0}
                  showIfZero
                />
                <PriceItem
                  title="Add/Remove from Pharmacy"
                  amount={Math.abs(addRemoveCredit?.refundFromPharmacy)}
                  isNegative={addRemoveCredit?.refundFromPharmacy > 0}
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
