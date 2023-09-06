/* eslint-disable prettier/prettier */
// third party
import { Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';

// local
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import DateRange from '../../StyledCharts/DateRange';

import { convertDate } from '../../../pages/LyxaFinancials/OrderFinancials';
import StyledTabs2 from '../../Styled/StyledTab2';
import IncreaseDecreaseTag from '../../StyledCharts/IncrementDecrementTag';
import InfoCard from '../../StyledCharts/InfoCard';
import PayoutDetails from './PayoutDetails';
import PayoutDetailsTable from './PayoutDetailsTable';
import PriceItem from './PriceItem';
import {
  calculateDateDifference,
  dateRangeItit,
  getMarketingTypeValues,
  getTotalProfit,
  marketingSpentTypeOptions,
} from './helpers';

export default function Overview({ viewUserType, adminParams = {}, adminPaymentDetailsRange }) {
  const [paymentDetailsRange, setPaymentDetailsRange] = useState({ ...dateRangeItit });
  const { currentUser, general } = useGlobalContext();

  const [marketingSpentType, setMarketingSpentType] = useState('all');

  const { shop, seller } = currentUser;

  const currency = general?.currency?.symbol;

  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;

  const viewUserTypeToApiMap = {
    shop: {
      api: Api.GET_SHOP_DASHBOARD_SUMMARY,
      params: { id: shop?._id, type: 'shop' },
    },
    seller: {
      api: Api.GET_SHOP_DASHBOARD_SUMMARY,
      params: { id: seller?._id, type: 'seller' },
    },
    admin: {
      api: Api.GET_SHOP_DASHBOARD_SUMMARY,
      params: { ...adminParams },
    },
    adminShop: {
      api: Api.GET_SHOP_DASHBOARD_SUMMARY,
      params: { ...adminParams },
    },
  };

  console.log('adminParams', adminParams);
  // summary
  const query = useQuery(
    [
      viewUserTypeToApiMap[viewUserType]?.api,
      {
        startDate: viewUserType === 'admin' ? adminPaymentDetailsRange?.start : paymentDetailsRange.start,
        endDate: viewUserType === 'admin' ? adminPaymentDetailsRange?.end : paymentDetailsRange.end,
        ...viewUserTypeToApiMap[viewUserType]?.params,
      },
    ],
    () =>
      AXIOS.get(viewUserTypeToApiMap[viewUserType]?.api, {
        params: {
          startDate: convertDate(
            viewUserType === 'admin' ? adminPaymentDetailsRange?.start : paymentDetailsRange?.start,
          ),
          endDate: convertDate(viewUserType === 'admin' ? adminPaymentDetailsRange?.end : paymentDetailsRange?.end),
          ...viewUserTypeToApiMap[viewUserType]?.params,
        },
      }),
  );

  //
  console.log('query', query?.data?.data);

  // eslint-disable-next-line no-unused-vars
  const summary = query?.data?.data;
  const profitBreakdown = summary?.profitBreakdown;
  const marketingSpent = summary?.marketingSpent;

  const marketingSpentValues = useMemo(
    () => getMarketingTypeValues(marketingSpentType, marketingSpent),
    [query?.data, marketingSpentType],
  );

  return (
    <Grid container spacing={7.5} pb={7.5} pt={7.5}>
      {viewUserType !== 'admin' && (
        <Grid xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
            <DateRange setRange={setPaymentDetailsRange} range={paymentDetailsRange} />
          </Stack>
        </Grid>
      )}
      <InfoCard
        title="Total Payouts"
        valueComponent={
          <Stack direction="column" alignItems="baseline" gap={2}>
            <Typography
              variant="h2"
              sx={{
                lineHeight: '24px',
                fontSize: '40px',
              }}
            >
              {currency} {(profitBreakdown?.totalPayout || 0).toFixed(2)}
            </Typography>

            {profitBreakdown?.secondaryCurrency_totalPayout ? (
              <Typography
                variant="inherit"
                sx={{
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {getTotalProfit(currency, secondaryCurrency, profitBreakdown, true).printConditionally}
              </Typography>
            ) : null}
          </Stack>
        }
        Tag={
          <IncreaseDecreaseTag
            status={`${Math.round(profitBreakdown?.totalPayout) >= 0 ? 'increase' : 'decrement'}`}
            amount={`${
              Math.round(Math.abs(profitBreakdown?.totalPayoutAvgInPercentage)) || 0
            }% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')} days`}
          />
        }
        sm={6}
        md={4}
        lg={4}
      />
      <InfoCard
        title="Orders"
        value={`${summary?.totalDeliveredOrder || 0}`}
        Tag={
          <IncreaseDecreaseTag
            status={Math.round(summary?.totalDeliveredOrderAvgInPercentage) >= 0 ? 'increase' : 'decrement'}
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
        title={
          <Stack alignItems="center" gap={6} direction="row" justifyContent="space-between" pr={4}>
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
        value={`${currency} ${(marketingSpentValues?.sum || 0).toFixed(2)}`}
        Tag={
          <IncreaseDecreaseTag
            status={Math.round(marketingSpent?.totalMarketingSpentAvgInPercentage) >= 0 ? 'increase' : 'decrement'}
            amount={`${
              Math.round(Math.abs(marketingSpent?.totalMarketingSpentAvgInPercentage)) || 0
            }% last ${calculateDateDifference(paymentDetailsRange.start, paymentDetailsRange.end, 'day')} days`}
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
      <PayoutDetails viewUserType={viewUserType} paymentDetails={profitBreakdown} />
      {viewUserType !== 'admin' && (
        <Grid xs={12}>
          <PayoutDetailsTable startDate={paymentDetailsRange.start} endDate={paymentDetailsRange.end} />
        </Grid>
      )}
    </Grid>
  );
}
