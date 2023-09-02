/* eslint-disable react/jsx-no-useless-fragment */
import { Box, Grid, Stack } from '@mui/material';
import React, { useState } from 'react';
import PageTop from '../../components/Common/PageTop';
import DetailsAccordion from '../../components/Shared/FinancialsOverview/DetailsAccordion';
import PriceItem from '../../components/Shared/FinancialsOverview/PriceItem';
import { dateRangeItit } from '../../components/Shared/FinancialsOverview/helpers';
import DateRange from '../../components/StyledCharts/DateRange';
import InfoCard from '../../components/StyledCharts/InfoCard';
import { useGlobalContext } from '../../context';

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
  // eslint-disable-next-line no-unused-vars
  const [currentExpanedTab, seCurrentExpanedTab] = useState(-1);
  const currency = general?.currency?.symbol;
  return (
    <Box>
      <PageTop backTo="/financials" backButtonLabel="Back to Lyxa Financials" breadcrumbItems={breadcrumbItems()} />

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
              value={`${currency} ${(0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Profit from Restaurant" amount={0} showIfZero />
                <PriceItem title="Profit from Grocery" amount={0} showIfZero />
                <PriceItem title="Profit from Pharmacy" amount={0} showIfZero />
                <PriceItem title="Profit from Butler" amount={0} showIfZero />
                <PriceItem title="Profit from Delivery" amount={0} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>
          {/* total order profit */}
          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              sx={{ position: 'absolute', left: 0, zIndex: 9999 }}
              title="Total Orders profit"
              isDropdown
              value={`${currency} ${(0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Profit from Restaurant" amount={0} showIfZero />
                <PriceItem title="Profit from Grocery" amount={0} showIfZero />
                <PriceItem title="Profit from Pharmacy" amount={0} showIfZero />
                <PriceItem title="Profit from Butler" amount={0} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>
          {/* delivery profit */}
          <Grid item xs={6} md={4}>
            <InfoCard
              title="Total Delivery Profit"
              sx={{ position: 'absolute', left: 0, zIndex: 9999 }}
              isDropdown
              value={`${currency} ${(0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Profit from Restaurant" amount={0} showIfZero />
                <PriceItem title="Profit from Grocery" amount={0} showIfZero />
                <PriceItem title="Profit from Pharmacy" amount={0} showIfZero />
                <PriceItem title="Profit from Butler" amount={0} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>
          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              title="Total Refund"
              sx={{ position: 'absolute', left: 0, zIndex: 999 }}
              isDropdown
              value={`${currency} ${(0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Refund from Restaurant" amount={0} showIfZero />
                <PriceItem title="Refund from Grocery" amount={0} showIfZero />
                <PriceItem title="Refund from Pharmacy" amount={0} showIfZero />
                <PriceItem title="Refund from Butler" amount={0} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>
          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              title="Total Marketing Spent"
              sx={{ position: 'absolute', left: 0, zIndex: 999 }}
              isDropdown
              value={`${currency} ${(0).toFixed(2)}`}
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
                  titleAmount={10}
                  isOpen={currentExpanedTab === 1}
                  onChange={(closed) => {
                    seCurrentExpanedTab(closed ? 1 : -1);
                  }}
                >
                  <PriceItem title="discount" amount={2} isNegative showIfZero />
                  <PriceItem title="loyality" amount={0} showIfZero />
                  <PriceItem title="buy 1, get 1" amount={0} showIfZero />
                  <PriceItem title="coupon" amount={0} showIfZero />
                </DetailsAccordion>
                <DetailsAccordion
                  title="Marketing spent from Grocery"
                  // VAT inclusive"
                  sx={{ borderBottom: 'none' }}
                  summarySx={{ padding: '8px 0px' }}
                  titleAmount={10}
                  isOpen={currentExpanedTab === 1}
                  onChange={(closed) => {
                    seCurrentExpanedTab(closed ? 1 : -1);
                  }}
                >
                  <PriceItem title="discount" amount={2} isNegative showIfZero />
                  <PriceItem title="loyality" amount={0} showIfZero />
                  <PriceItem title="buy 1, get 1" amount={0} showIfZero />
                  <PriceItem title="coupon" amount={0} showIfZero />
                </DetailsAccordion>
                <DetailsAccordion
                  title="Marketing spent from Pharmacy"
                  // VAT inclusive"
                  summarySx={{ padding: '8px 0px' }}
                  sx={{ borderBottom: 'none' }}
                  titleAmount={10}
                  isOpen={currentExpanedTab === 1}
                  onChange={(closed) => {
                    seCurrentExpanedTab(closed ? 1 : -1);
                  }}
                >
                  <PriceItem title="discount" amount={2} isNegative showIfZero />
                  <PriceItem title="loyality" amount={0} showIfZero />
                  <PriceItem title="buy 1, get 1" amount={0} showIfZero />
                  <PriceItem title="coupon" amount={0} showIfZero />
                </DetailsAccordion>
                <DetailsAccordion
                  summarySx={{ padding: '8px 0px' }}
                  title="Marketing spent from Delivery"
                  sx={{ borderBottom: 'none' }}
                  titleAmount={10}
                  isOpen={currentExpanedTab === 1}
                  onChange={(closed) => {
                    seCurrentExpanedTab(closed ? 1 : -1);
                  }}
                >
                  <></>
                  <PriceItem title="Free Delivery" amount={2} isNegative showIfZero />
                </DetailsAccordion>
              </Stack>
            </InfoCard>
          </Grid>

          <Grid item xs={6} md={4} height="140px">
            <InfoCard
              title="Marketing cashback"
              sx={{ position: 'absolute', left: 0, zIndex: 999 }}
              isDropdown
              value={`${currency} ${(0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Discount" amount={0} showIfZero />
                <PriceItem title="Loyality points" amount={0} showIfZero />
                <PriceItem title="Buy 1, get 1" amount={0} showIfZero />
                <PriceItem title="Coupon" amount={0} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>

          <Grid item xs={6} md={4}>
            <InfoCard
              title="How much earn from featured only?"
              sx={{ position: 'relative', left: 0 }}
              value={`${currency} ${(0).toFixed(2)}`}
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
              value={`${currency} ${(0).toFixed(2)}`}
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Lyxa Marketing Cashback" amount={0} showIfZero />
                <PriceItem title="Error Charge" amount={0} showIfZero />
                <PriceItem title="replacement orders by Lyxa" amount={0} showIfZero />
                <PriceItem title="Error order by Lyxa ( endure loss )" amount={0} showIfZero />
                <PriceItem title="Free delivery by shop (Lyxa riders)" amount={0} showIfZero />
              </Stack>
            </InfoCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default OrderFinancialsSummary;
