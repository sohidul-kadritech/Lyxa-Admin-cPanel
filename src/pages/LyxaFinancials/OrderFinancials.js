/* eslint-disable prettier/prettier */
// third party
import { Box, Unstable_Grid2 as Grid, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

// local
import moment from 'moment';
import { useQuery } from 'react-query';
import DateRange from '../../components/StyledCharts/DateRange';
import { useGlobalContext } from '../../context';

import PageTop from '../../components/Common/PageTop';
import PriceItem from '../../components/Shared/FinancialsOverview/PriceItem';
import { dateRangeItit } from '../../components/Shared/FinancialsOverview/helpers';
import IncreaseDecreaseTag from '../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../components/StyledCharts/InfoCard';
import OrderPayoutDetails from './OrderPayoutDetails';
import OrderPayoutDetailsTable from './OrderPayoutDetailsTable';

import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
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

  const [currentTab, setCurrentTab] = useState(0);

  // eslint-disable-next-line no-unused-vars
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
  console.log('getFinancialsDashBoard', summary);

  return (
    <Box>
      <PageTop
        backTo="/financials"
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
              value={profitBreakdown?.totalAdminProfit || 0}
              Tag={<IncreaseDecreaseTag status="increase" amount={`${0}% last ${0}`} />}
              sm={6}
              md={4}
              lg={4}
            />
            <InfoCard
              title="Total Orders"
              value={summary?.totalDeliveredOrder || 0}
              Tag={
                <IncreaseDecreaseTag
                  status="increase"
                  amount={`${summary?.totalDeliveredOrderAvgInPercentage}% last ${0}`}
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
              Tag={<IncreaseDecreaseTag status="increase" amount={`${0}% last ${0}`} />}
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
              <OrderPayoutDetailsTable showFor="order" />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Delivery financials */}
      {currentTab === 1 && <DeliveryFinancials shopType={shopType} />}
    </Box>
  );
}
