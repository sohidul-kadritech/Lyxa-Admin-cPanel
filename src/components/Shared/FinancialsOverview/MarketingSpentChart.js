import { Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import StyledTabs2 from '../../Styled/StyledTab2';
import ChartBox from '../../StyledCharts/ChartBox';
import StyledAreaChart from '../../StyledCharts/StyledAreaChart';
import { marketingSpentTypeOptions } from './helpers';

const generateData = (data, marketingSpentType = '') => {
  const typeNameMap = {
    all: {
      discount: 'totalDiscount',
      points: 'totalRewardAmount',
      doubleDeal: 'totalDoubleMenuItemPrice',
      freeDelivery: 'freeDeliveryShopCut',
      featureAmount: 'totalFeaturedAmount',
    },
    shop: {
      discount: 'totalShopDiscount',
      points: 'totalShopRewardAmount',
      doubleDeal: 'totalShopDoubleMenuItemPrice',
      freeDelivery: 'freeDeliveryShopCut',
      featureAmount: 'totalFeaturedAmount',
    },
    admin: {
      discount: 'totalAdminDiscount',
      points: 'totalAdminRewardAmount',
      doubleDeal: 'totalAdminDoubleMenuItemPrice',
      freeDelivery: 'freeDeliveryDropCut',
    },
  };

  const discount = [];
  const points = [];
  const doubleDeal = [];
  const freeDelivery = [];
  const featureAmount = [];
  const date = [];

  data?.forEach((node) => {
    const dprop = typeNameMap[marketingSpentType]?.discount;
    const pprop = typeNameMap[marketingSpentType]?.points;
    const douprop = typeNameMap[marketingSpentType]?.doubleDeal;
    const freeprop = typeNameMap[marketingSpentType]?.freeDelivery;
    const feaprop = typeNameMap[marketingSpentType]?.featureAmount;

    date.push(moment(node?.date).format('MMMM DD'));
    discount.push(node?.[dprop]);
    points.push(node?.[pprop]);
    doubleDeal.push(node?.[douprop]);
    freeDelivery.push(node?.[freeprop]);
    featureAmount.push(node?.[feaprop]);
  });

  return { discount, points, doubleDeal, freeDelivery, featureAmount, date };
};

const getQueryParamsInit = (type, id) => ({
  endDate: moment(),
  startDate: moment().subtract(7, 'd'),
  type,
  id,
});

export default function MarketingSpentChart({ viewUserType = 'shop' }) {
  const { currentUser } = useGlobalContext();
  const [marketingSpentType, setMarketingSpentType] = useState('all');
  const [queryParams, setQueryParams] = useState(getQueryParamsInit(viewUserType, currentUser[viewUserType]?._id));

  const marketingSpentQuery = useQuery([Api.GET_SHOP_DASHBOARD_MARKETING_SPENT_GRAPH, queryParams], () =>
    AXIOS.get(Api.GET_SHOP_DASHBOARD_MARKETING_SPENT_GRAPH, {
      params: queryParams,
    })
  );

  const chartdata = useMemo(
    () => generateData(marketingSpentQuery?.data?.data?.info, marketingSpentType),
    [marketingSpentType, marketingSpentQuery?.data]
  );

  const lineChartData = {
    labels: chartdata.date,
    datasets: [
      {
        label: 'Discount',
        data: chartdata.discount,
        borderColor: 'rgba(221, 91, 99, 1)',
        backgroundColor: 'rgba(21, 191, 202, 0)',
        borderWidth: 1,
      },
      {
        label: 'Points',
        data: chartdata.points,
        borderColor: 'rgba(21, 11, 202, 1)',
        backgroundColor: 'rgba(21, 191, 202, 0)',
        borderWidth: 1,
      },
      {
        label: 'Double Deal',
        data: chartdata.doubleDeal,
        borderColor: 'rgba(21, 255, 0, 1)',
        backgroundColor: 'rgba(21, 191, 202, 0)',
        borderWidth: 1,
      },
      {
        label: 'Free Delivery',
        data: chartdata.freeDelivery,
        borderColor: 'rgba(255, 176, 23, 1)',
        backgroundColor: 'rgba(21, 191, 202, 0)',
        borderWidth: 1,
      },
    ],
  };

  if (marketingSpentType !== 'admin') {
    lineChartData?.datasets.push({
      label: 'Featured',
      data: chartdata.featureAmount,
      borderColor: 'rgba(76, 153, 0, 1)',
      backgroundColor: 'rgba(21, 191, 202, 0)',
      borderWidth: 1,
    });
  }

  return (
    <ChartBox
      chartHeight={325}
      dateRange={queryParams}
      setDateRange={setQueryParams}
      startDateKey="startDate"
      endDateKey="endDate"
      customTitle={
        <Stack alignItems="center" gap={6} direction="row" justifyContent="space-between" pr={4}>
          <Typography variant="body1" fontWeight={600}>
            Marketing Spent
          </Typography>
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
      sm={12}
      xl={6}
    >
      <StyledAreaChart data={lineChartData} />
    </ChartBox>
  );
}
