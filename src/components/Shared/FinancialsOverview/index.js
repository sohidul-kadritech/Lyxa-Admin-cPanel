/* eslint-disable max-len */
/* eslint-disable no-unsafe-optional-chaining */
// third party
import { Button, Unstable_Grid2 as Grid, Stack } from '@mui/material';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';

// local
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import DateRange from '../../StyledCharts/DateRange';

import StyledTabs2 from '../../Styled/StyledTab2';
import IncreaseDecreaseTag from '../../StyledCharts/IncrementDecrementTag';
import InfoCard from '../../StyledCharts/InfoCard';
import MarketingSpentChart from './MarketingSpentChart';
import OrderAmountChart from './OrderAmontChat';
import PayoutDetails from './PayoutDetails';
import PriceItem from './PriceItem';
import ProfitChart from './ProfitChart';

const marketingSpentTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Shop', value: 'shop' },
  { label: 'Admin', value: 'admin' },
];

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

const getMarketingTypeValues = (marketingType, summary = {}) => {
  const marketingSpentValues = {
    totalDiscount: 0,
    totalDoubleMenuItemPrice: 0,
    totalRewardAmount: 0,
    freeDeliveryShopCut: 0,
    totalFeaturedAmount: 0,
    sum: 0,
  };

  if (marketingType === 'all') {
    marketingSpentValues.totalDiscount = summary?.orderValue?.totalDiscount;
    marketingSpentValues.totalDoubleMenuItemPrice = summary?.orderValue?.totalDoubleMenuItemPrice;
    marketingSpentValues.totalRewardAmount = summary?.orderValue?.totalRewardAmount;
    marketingSpentValues.freeDeliveryShopCut = summary?.freeDeliveryCut;
    marketingSpentValues.totalFeaturedAmount = summary?.totalFeaturedAmount;
  }

  if (marketingType === 'shop') {
    marketingSpentValues.totalDiscount = summary?.orderValue?.totalShopDiscount;
    marketingSpentValues.totalDoubleMenuItemPrice = summary?.orderValue?.totalShopDoubleMenuItemPrice;
    marketingSpentValues.totalRewardAmount = summary?.orderValue?.totalShopRewardAmount;
    marketingSpentValues.freeDeliveryShopCut = summary?.freeDeliveryShopCut;
    marketingSpentValues.totalFeaturedAmount = summary?.totalFeaturedAmount;
  }

  if (marketingType === 'admin') {
    marketingSpentValues.totalDiscount = summary?.orderValue?.totalAdminDiscount;
    marketingSpentValues.totalDoubleMenuItemPrice = summary?.orderValue?.totalAdminDoubleMenuItemPrice;
    marketingSpentValues.totalRewardAmount = summary?.orderValue?.totalAdminRewardAmount;
    marketingSpentValues.freeDeliveryShopCut = summary?.freeDeliveryDropCut;
    // marketingSpentValues.totalFeaturedAmount = summary?.totalFeaturedAmount;
  }

  marketingSpentValues.sum =
    marketingSpentValues.totalDiscount +
    marketingSpentValues.totalDoubleMenuItemPrice +
    marketingSpentValues.totalRewardAmount +
    marketingSpentValues.freeDeliveryShopCut +
    marketingSpentValues.totalFeaturedAmount;

  return marketingSpentValues;
};

export default function Overview({ viewUserType }) {
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });
  const { currentUser, general } = useGlobalContext();

  const [marketingSpentType, setMarketingSpentType] = useState('all');

  const { shop, seller } = currentUser;
  const currency = general?.currency;

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

  const marketingSpentValues = useMemo(
    () => getMarketingTypeValues(marketingSpentType, query.data?.data?.summary),
    [query?.data, marketingSpentType]
  );

  console.log('shopDashBoard:', query.data?.data?.summary);

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
        value={`${query?.data?.data?.summary?.totalExpectedOrder || 0}`}
        Tag={
          <IncreaseDecreaseTag
            status={
              Math.round(query?.data?.data?.summary?.totalExpectedOrderAvgInPercentage) >= 0 ? 'increase' : 'decrement'
            }
            amount={`${
              Math.round(Math.abs(query?.data?.data?.summary?.totalExpectedOrderAvgInPercentage)) || 0
            }% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')}`}
          />
        }
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title={
          <Stack alignItems="center" gap={6} direction="row">
            <span>Marketing Spent</span>
            <StyledTabs2
              size="small"
              options={marketingSpentTypeOptions}
              value={marketingSpentType}
              onChange={(value) => {
                setMarketingSpentType(value);
              }}
            />
          </Stack>
        }
        isDropdown
        value={`${currency?.symbol_native} ${(marketingSpentValues?.sum || 0).toFixed(2)}`}
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
          <PriceItem title="Discount" amount={marketingSpentValues.totalDiscount} />
          <PriceItem title="Buy 1 Get 1" amount={marketingSpentValues?.totalDoubleMenuItemPrice} />
          <PriceItem title="Loyalty points" amount={marketingSpentValues?.totalRewardAmount} />
          <PriceItem title="Free delivery" amount={marketingSpentValues?.freeDeliveryShopCut} />
          {marketingSpentType !== 'admin' && (
            <PriceItem title="Featured" amount={query?.data?.data?.summary?.totalFeaturedAmount} />
          )}
        </Stack>
      </InfoCard>
      <PayoutDetails paymentDetails={query?.data?.data?.summary} />
      <ProfitChart viewUserType={viewUserType} />
      <MarketingSpentChart viewUserType={viewUserType} />
    </Grid>
  );
}
