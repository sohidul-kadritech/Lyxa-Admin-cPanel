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
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

import IncreaseDecreaseTag from '../../../components/StyledCharts/IncrementDecrementTag';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import MarketingSpentChart from './MarketingSpentChart';
import OrderAmountChart from './OrderAmontChat';
import PayoutDetails from './PayoutDetails';
import PriceItem from './PriceItem';
import ProfitChart from './ProfitChart';

const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

export function calculateDateDifference(date1, date2, unit) {
  const momentDate1 = moment(date1);
  const momentDate2 = moment(date2);
  const difference = momentDate2.diff(momentDate1, unit);
  return difference;
}

export default function Overview({ viewUserType }) {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency);
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });
  const { currentUser } = useGlobalContext();
  const { shop, seller } = currentUser;

  const viewUserTypeToApiMap = {
    shop: {
      api: Api.GET_SHOP_DASHBOARD_SUMMARY,
      params: { shopId: shop?._id },
    },
    seller: {
      api: Api.GET_SELLER_DASHBOARD_SUMMARY,
      params: { sellerId: seller?._id },
    },
  };

  // summary
  const query = useQuery(
    [
      viewUserTypeToApiMap[viewUserType]?.api,
      {
        startDate: moment(paymentDetailsRange.start).format('YYYY-MM-DD'),
        endDate: moment(paymentDetailsRange.end).format('YYYY-MM-DD'),
        ...viewUserTypeToApiMap[viewUserType]?.params,
      },
    ],
    () =>
      AXIOS.get(viewUserTypeToApiMap[viewUserType]?.api, {
        params: {
          startDate: moment(paymentDetailsRange.start).format('YYYY-MM-DD'),
          endDate: moment(paymentDetailsRange.end).format('YYYY-MM-DD'),
          ...viewUserTypeToApiMap[viewUserType]?.params,
        },
      })
  );

  console.log('shopDashBoard: ', query.data?.data?.summary);
  const marketingSpentAmount =
    query?.data?.data?.summary?.orderValue?.totalDiscount +
    query?.data?.data?.summary?.orderValue?.totalDoubleMenuItemPrice +
    query?.data?.data?.summary?.orderValue?.totalRewardAmount +
    query?.data?.data?.summary?.freeDeliveryShopCut;

  return (
    <Grid container spacing={7.5} pb={3} pt={7.5}>
      <OrderAmountChart viewUserType={viewUserType} />
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
        console={console.log(query?.data?.data)}
        title="Total Profit"
        value={`${currency?.symbol_native} ${(query?.data?.data?.summary?.totalProfit || 0).toFixed(2)}`}
        Tag={
          <IncreaseDecreaseTag
            status={`${
              Math.round(query?.data?.data?.summary?.totalProfitAvgInPercentage) >= 0 ? 'increase' : 'decrement'
            }`}
            amount={`${
              Math.round(Math.abs(query?.data?.data?.summary?.totalProfitAvgInPercentage)) || 0
            }% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')}`}
          />
        }
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title="Orders"
        value={`${query?.data?.data?.summary?.totalDeliveredOrder || 0}`}
        Tag={
          <IncreaseDecreaseTag
            status={
              Math.round(query?.data?.data?.summary?.totalDeliveredOrderAvgInPercentage) >= 0 ? 'increase' : 'decrement'
            }
            amount={`${
              Math.round(Math.abs(query?.data?.data?.summary?.totalDeliveredOrderAvgInPercentage)) || 0
            }% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')}`}
          />
        }
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title="Marketing Spent"
        isDropdown
        value={`${currency?.symbol_native} ${(marketingSpentAmount || 0).toFixed(2)}`}
        Tag={
          <IncreaseDecreaseTag
            status={
              Math.round(query?.data?.data?.summary?.totalMarketingSpentAvgInPercentage) >= 0 ? 'increase' : 'decrement'
            }
            amount={`${
              Math.round(Math.abs(query?.data?.data?.summary?.totalMarketingSpentAvgInPercentage)) || 0
            }% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')}`}
          />
        }
        sm={6}
        md={4}
        lg={4}
      >
        <Stack gap={3}>
          <PriceItem title="Discount" amount={query?.data?.data?.summary?.orderValue?.totalDiscount} />
          <PriceItem title="Buy 1 Get 1" amount={query?.data?.data?.summary?.orderValue?.totalDoubleMenuItemPrice} />
          <PriceItem title="Loyalty points" amount={query?.data?.data?.summary?.orderValue?.totalRewardAmount} />
          <PriceItem title="Free delivery" amount={query?.data?.data?.summary?.freeDeliveryShopCut} />
          <PriceItem title="Featured" amount={query?.data?.data?.summary?.totalFeaturedAmount} />
        </Stack>
      </InfoCard>
      <PayoutDetails paymentDetails={query?.data?.data?.summary} />
      <ProfitChart viewUserType={viewUserType} />
      <MarketingSpentChart viewUserType={viewUserType} />
    </Grid>
  );
}
