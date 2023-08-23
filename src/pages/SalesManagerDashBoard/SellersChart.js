/* eslint-disable prettier/prettier */
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ChartBox from '../../components/StyledCharts/ChartBox';
import StyledBarChart from '../../components/StyledCharts/StyledBarChart';
import { generateGraphData } from '../../helpers/generateGraphData';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';

const dateRangeItit = {
  end: moment(),
  start: moment().subtract(7, 'd'),
};

export default function SellersChart({ viewUserType = 'shop' }) {
  const [range, setRange] = useState({ ...dateRangeItit });

  const salesGraphQuery = useQuery(
    [
      API_URL.SALES_MANAGER_DASHBOARD_SALES_GRAPH,
      {
        startDate: moment(range.start).format('YYYY-MM-DD'),
        endDate: moment(range.end).format('YYYY-MM-DD'),
        type: viewUserType,
      },
    ],
    () =>
      AXIOS.get(API_URL.SALES_MANAGER_DASHBOARD_SALES_GRAPH, {
        params: {
          startDate: moment(range.start).format('YYYY-MM-DD'),
          endDate: moment(range.end).format('YYYY-MM-DD'),
          type: viewUserType,
        },
      }),
  );

  const sellersData = generateGraphData(
    salesGraphQuery?.data?.data?.info || [],
    (item) => item.seller,
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
      loading={salesGraphQuery.isLoading}
      chartHeight={325}
      dateRange={range}
      setDateRange={setRange}
      title="Sellers"
      sx={{ overflow: 'visible' }}
      sm={12}
      xl={6}
    >
      <StyledBarChart data={profitChartData} />
    </ChartBox>
  );
}
