/* eslint-disable prettier/prettier */
// third party
import { Box, Unstable_Grid2 as Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

// local
import moment from 'moment';
import { useQuery } from 'react-query';
import DateRange from '../../components/StyledCharts/DateRange';
import { useGlobalContext } from '../../context';

import PageTop from '../../components/Common/PageTop';
import PriceItem from '../../components/Shared/FinancialsOverview/PriceItem';
import { dateRangeItit, getTotalProfitForLyxa } from '../../components/Shared/FinancialsOverview/helpers';
import IncreaseDecreaseTag from '../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../components/StyledCharts/InfoCard';
import OrderPayoutDetails from './OrderPayoutDetails';
import OrderPayoutDetailsTable from './OrderPayoutDetailsTable';

import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { calculateDateDifference } from '../ShopDashboard/helper';
import DeliveryFinancials from './DeliveryFinancials';

const shopTypeToLabelMap = { food: 'Resturant', grocery: 'Grocery', pharmacy: 'Pharmacy' };

const breadcrumbItems = (shopType) => [
  {
    label: 'Lyxa Financials',
    to: '/financials/lyxa',
  },
  {
    label: `Lyxa ${shopTypeToLabelMap[shopType]} Financials`,
    to: '#',
  },
];

export const convertDate = (date) => moment(date).format('YYYY-MM-DD');

export default function LyxaOrderFinancials({ shopType }) {
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;

  const [currentTab, setCurrentTab] = useState(0);

  const getFinancialsDashBoard = useQuery(
    [
      API_URL.GET_ADMIN_ORDER_FINANCIALS_DASHBOARD,
      { startDate: paymentDetailsRange?.start, endDate: paymentDetailsRange?.end, orderType: shopType },
    ],
    () =>
      AXIOS.get(API_URL.GET_ADMIN_ORDER_FINANCIALS_DASHBOARD, {
        params: {
          startDate: convertDate(paymentDetailsRange?.start),
          endDate: convertDate(paymentDetailsRange?.end),
          orderType: shopType,
        },
      }),
  );

  const summary = getFinancialsDashBoard?.data?.data;

  const profitBreakdown = summary?.profitBreakdown;

  console.log('getFinancials', getFinancialsDashBoard?.data?.data);

  return (
    <Box>
      <PageTop
        backTo="/financials/lyxa"
        backButtonLabel="Back to Lyxa Financials"
        breadcrumbItems={breadcrumbItems(shopType)}
      />

      <Tabs value={currentTab}>
        <Tab onClick={() => setCurrentTab(0)} label="Order" />
        <Tab onClick={() => setCurrentTab(1)} label="Delivery" />
      </Tabs>
      {/* Order financials */}
      {currentTab === 0 && (
        <Box>
          <Grid container spacing={7.5}>
            <Grid xs={12}>
              <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
                <DateRange setRange={setPaymentDetailsRange} range={paymentDetailsRange} />
              </Stack>
            </Grid>
            <InfoCard
              title="Total Lyxa Profit"
              // value={`${currency} ${(profitBreakdown?.totalAdminProfit || 0).toFixed(2)}`}
              valueComponent={
                <Stack direction="column" alignItems="baseline" gap={2}>
                  <Typography
                    variant="h2"
                    sx={{
                      lineHeight: '24px',
                      fontSize: '40px',
                    }}
                  >
                    {currency} {(profitBreakdown?.totalAdminProfit || 0).toFixed(2)}
                  </Typography>

                  {profitBreakdown?.secondaryCurrency_totalAdminProfit ? (
                    <Typography
                      variant="inherit"
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      {getTotalProfitForLyxa(currency, secondaryCurrency, profitBreakdown, true).printConditionally}
                    </Typography>
                  ) : null}
                </Stack>
              }
              Tag={
                <IncreaseDecreaseTag
                  status={summary?.totalAdminProfitAvgInPercentage >= 0 ? 'increase' : 'minus'}
                  amount={`${Math.round(
                    Math.abs(summary?.totalAdminProfitAvgInPercentage) || 0,
                  )}% last  ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')} days`}
                />
              }
              sm={6}
              md={4}
              lg={4}
            />
            <InfoCard
              title="Total Orders"
              value={summary?.totalDeliveredOrder || 0}
              Tag={
                <IncreaseDecreaseTag
                  status={summary?.totalDeliveredOrderAvgInPercentage >= 0 ? 'increase' : 'minus'}
                  amount={`${
                    Math.round(Math.abs(summary?.totalDeliveredOrderAvgInPercentage)) || 0
                  }% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')} days`}
                />
              }
              sm={6}
              md={4}
              lg={4}
            />
            <InfoCard
              title="Total Payouts"
              // isDropdown
              value={`${currency} ${(profitBreakdown?.payout?.totalPayout || 0).toFixed(2)}`}
              Tag={
                <IncreaseDecreaseTag
                  status={summary?.totalPayoutAvgInPercentage >= 0 ? 'increase' : 'minus'}
                  amount={`${Math.round(
                    Math.abs(summary?.totalPayoutAvgInPercentage) || 0,
                  )}% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')} days`}
                />
              }
              sm={6}
              md={4}
              lg={4}
            >
              <Stack gap={3}>
                <PriceItem title="Discount" amount={0} showIfZero />
                <PriceItem title="Buy 1 Get 1" amount={0} showIfZero />
                <PriceItem title="Loyalty points" amount={0} showIfZero />
                <PriceItem title="Free delivery" amount={0} showIfZero />
              </Stack>
            </InfoCard>
            <OrderPayoutDetails paymentDetails={profitBreakdown} showFor="adminFinancials" />
            <Grid xs={12}>
              <OrderPayoutDetailsTable showFor="order" shopType={shopType} paymentDetailsRange={paymentDetailsRange} />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Delivery financials */}
      {currentTab === 1 && <DeliveryFinancials shopType={shopType} />}
    </Box>
  );
}
