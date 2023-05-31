import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ChartBox from '../../../components/StyledCharts/ChartBox';
import StyledAreaChart from '../../../components/StyledCharts/StyledAreaChart';
import { useGlobalContext } from '../../../context';
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

export default function MarketingSpentChart({ viewUserType = 'shop' }) {
  const [range, setRange] = useState({ ...dateRangeItit });
  const { currentUser } = useGlobalContext();

  const marketingSpentQuery = useQuery(
    [
      Api.GET_SHOP_DASHBOARD_MARKETING_SPENT_GRAPH,
      {
        startDate: moment(range.start).format('YYYY-MM-DD'),
        endDate: moment(range.end).format('YYYY-MM-DD'),
        id: currentUser[viewUserType]?._id,
        type: viewUserType,
      },
    ],
    () =>
      AXIOS.get(Api.GET_SHOP_DASHBOARD_MARKETING_SPENT_GRAPH, {
        params: {
          startDate: moment(range.start).format('YYYY-MM-DD'),
          endDate: moment(range.end).format('YYYY-MM-DD'),
          id: currentUser[viewUserType]?._id,
          type: viewUserType,
        },
        // eslint-disable-next-line prettier/prettier
      })
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
