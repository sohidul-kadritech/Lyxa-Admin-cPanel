/* eslint-disable max-len */
/* eslint-disable no-unsafe-optional-chaining */
// third party
import { Button, Unstable_Grid2 as Grid, Stack } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

// local
import DateRange from '../../../components/StyledCharts/DateRange';
import IncreaseDecreaseTag from '../../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import MarketingSpentChart from './MarketingSpentChart';
import OrderAmountChart from './OrderAmontChat';
import PayoutDetails from './PayoutDetails';
import PriceItem from './PriceItem';
import ProfitChart from './ProfitChart';

const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};
export default function Overview() {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency);
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });

  // summary
  const shopDashboardQuery = useQuery(
    ['shop-dashboard', { startDate: paymentDetailsRange.start, endDate: paymentDetailsRange.end }],
    () =>
      AXIOS.get(Api.GET_SHOP_DASHBOARD_SUMMARY, {
        params: { startDate: paymentDetailsRange.start, endDate: paymentDetailsRange.end },
      })
  );

  // order amount graph
  const marketingSpentAmount =
    shopDashboardQuery?.data?.data?.summary?.orderValue?.totalDiscount +
    shopDashboardQuery?.data?.data?.summary?.orderValue?.totalDoubleMenuItemPrice +
    shopDashboardQuery?.data?.data?.summary?.orderValue?.totalRewardAmount +
    shopDashboardQuery?.data?.data?.summary?.freeDeliveryShopCut;

  return (
    <Grid container spacing={7.5} pb={3} pt={7.5}>
      <OrderAmountChart />
      <Grid xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
          <Button
            variant="outlined"
            sx={{
              color: '#404040',
              padding: '7px 15px',
              fontSize: '13px',
              lineHeight: '20px',
              fontWeight: 500,
              background: '#F6F8FA',
            }}
            onClick={() => {
              setPaymentDetailsRange({
                end: moment().format('YYYY-MM-DD'),
                start: moment().subtract(1, 'd').format('YYYY-MM-DD'),
              });
            }}
          >
            Daily Profit
          </Button>
          <DateRange setRange={setPaymentDetailsRange} range={paymentDetailsRange} />
        </Stack>
      </Grid>
      <InfoCard
        title="Total Profit"
        value={`${currency?.symbol_native} ${
          Math.round(
            shopDashboardQuery?.data?.data?.summary?.orderValue?.deliveryFee +
              shopDashboardQuery?.data?.data?.summary?.toalShopProfile
          ) || 0
        }`}
        Tag={<IncreaseDecreaseTag status="increase" amount="29%" />}
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title="Orders"
        value={`${
          shopDashboardQuery?.data?.data?.summary?.totalCancelOrder +
            shopDashboardQuery?.data?.data?.summary?.totalDeliverOrder || 0
        }`}
        Tag={<IncreaseDecreaseTag status="increase" amount="11%" />}
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title="Marketing Spent"
        isDropdown
        value={`${currency?.symbol_native} ${marketingSpentAmount || 0}`}
        Tag={<IncreaseDecreaseTag status="decrement" amount="9%" />}
        sm={6}
        md={4}
        lg={4}
      >
        <Stack gap={3}>
          {/* {shopDashboardQuery?.datapaymentDetails?.orderValue?.totalDiscount > 0 && ( */}
          <PriceItem title="Discount" amount={shopDashboardQuery?.data?.data?.summary?.orderValue?.totalDiscount} />
          {/* )} */}
          {/* {(shopDashboardQuery?.data?.data?.summary?.orderValue?.totalDoubleMenuItemPrice > 0 || true) && ( */}
          <PriceItem
            title="Buy 1 Get 1"
            amount={shopDashboardQuery?.data?.data?.summary?.orderValue?.totalDoubleMenuItemPrice}
          />
          {/* )} */}
          {/* {(shopDashboardQuery?.data?.data?.summary?.orderValue?.totalRewardAmount > 0 || true) && ( */}
          <PriceItem
            title="Loyalty points"
            amount={shopDashboardQuery?.data?.data?.summary?.orderValue?.totalRewardAmount}
          />
          {/* )} */}
          {/* {shopDashboardQuery?.data?.data?.summary?.freeDeliveryShopCut > 0 && ( */}
          <PriceItem title="Free delivery" amount={shopDashboardQuery?.data?.data?.summary?.freeDeliveryShopCut} />
          {/* )} */}
        </Stack>
      </InfoCard>
      <PayoutDetails paymentDetails={shopDashboardQuery?.data?.data?.summary} />
      <ProfitChart />
      <MarketingSpentChart />
    </Grid>
  );
}
