import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ChartBox from '../../components/StyledCharts/ChartBox';
import StyledBarChart from '../../components/StyledCharts/StyledBarChart';
import { useGlobalContext } from '../../context';
import { generateGraphData } from '../../helpers/generateGraphData';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';

const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

export default function SellersChart({ viewUserType = 'shop' }) {
  const [range, setRange] = useState({ ...dateRangeItit });
  const { currentUser } = useGlobalContext();

  const profitGraphQuery = useQuery(
    [
      API_URL.GET_SHOP_DASHBOARD_PROFIT_GRAPH,
      {
        startDate: moment(range.start).format('YYYY-MM-DD'),
        endDate: moment(range.end).format('YYYY-MM-DD'),
        id: currentUser[viewUserType]?._id,
        type: viewUserType,
      },
    ],
    () =>
      AXIOS.get(API_URL.GET_SHOP_DASHBOARD_PROFIT_GRAPH, {
        params: {
          startDate: moment(range.start).format('YYYY-MM-DD'),
          endDate: moment(range.end).format('YYYY-MM-DD'),
          id: currentUser[viewUserType]?._id,
          type: viewUserType,
        },
        // eslint-disable-next-line prettier/prettier
      }),
  );

  const sellersData = generateGraphData(
    profitGraphQuery?.data?.data?.info || [],
    (item) => item.payout,
    // eslint-disable-next-line prettier/prettier
    (item) => moment(item?.date).format('MMMM DD'),
  );

  const profitChartData = {
    labels: sellersData.labels,
    datasets: [
      {
        label: 'Seller',
        data: sellersData.data,
        backgroundColor: 'rgba(126, 130, 153, 1)',
      },
    ],
  };

  return (
    <ChartBox
      loading={profitGraphQuery.isLoading}
      chartHeight={325}
      dateRange={range}
      setDateRange={setRange}
      title="Sellers"
      sm={12}
      xl={6}
    >
      <StyledBarChart data={profitChartData} />
    </ChartBox>
  );
}
