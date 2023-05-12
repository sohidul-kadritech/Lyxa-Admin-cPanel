import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ChartBox from '../../../components/StyledCharts/ChartBox';
import StyledAreaChart from '../../../components/StyledCharts/StyledAreaChart';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

const generateData = (data) => {
  const discount = [];
  const points = [];
  const doubleDeal = [];
  const freeDelivery = [];
  const featureAmount = [];
  const date = [];
  // const featured = [];

  data?.forEach((node) => {
    date.push(moment(node?.date).format('MMMM DD'));
    discount.push(node?.totalDiscount);
    points.push(node?.totalRewardAmount);
    doubleDeal.push(node?.totalDoubleMenuItemPrice);
    freeDelivery.push(node?.freeDeliveryShopCut);
    featureAmount.push(node?.totalFeaturedAmount);
    console.log(node);
  });

  return { discount, points, doubleDeal, freeDelivery, featureAmount, date };
};

const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

export default function MarketingSpentChart() {
  const [range, setRange] = useState({ ...dateRangeItit });

  const marketingSpentQuery = useQuery(
    ['shop-marketing-spent-graph', { startDate: range.start, endDate: range.end }],
    () =>
      AXIOS.get(Api.GET_SHOP_DASHBOARD_MARKETING_SPENT_GRAPH, {
        params: { startDate: range.start, endDate: range.end, type: 'normal' },
        // eslint-disable-next-line prettier/prettier
      }),
  );

  console.log('marketing data: ', marketingSpentQuery?.data?.data);

  const chartdata = generateData(marketingSpentQuery?.data?.data?.info);

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
        borderColor: 'rgba(21, 191, 100, 1)',
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
      {
        label: 'Featured',
        data: chartdata.featureAmount,
        borderColor: 'rgba(76, 153, 0, 1)',
        backgroundColor: 'rgba(21, 191, 202, 0)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <ChartBox chartHeight={325} dateRange={range} setDateRange={setRange} title="Marketing Spent" sm={12} xl={6}>
      <StyledAreaChart data={lineChartData} />
    </ChartBox>
  );
}
