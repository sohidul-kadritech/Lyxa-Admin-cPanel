import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ChartBox from '../../../components/StyledCharts/ChartBox';

// local
import StyledBarChart from '../../../components/StyledCharts/StyledBarChart';
import { useGlobalContext } from '../../../context';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

export default function ProfitChart({ viewUserType = 'shop' }) {
  const [range, setRange] = useState({ ...dateRangeItit });
  const { currentUser } = useGlobalContext();

  const profitGraphQuery = useQuery(
    [
      Api.GET_SHOP_DASHBOARD_PROFIT_GRAPH,
      {
        startDate: moment(range.start).format('YYYY-MM-DD'),
        endDate: moment(range.end).format('YYYY-MM-DD'),
        id: currentUser[viewUserType]?._id,
        type: viewUserType,
      },
    ],
    () =>
      AXIOS.get(Api.GET_SHOP_DASHBOARD_PROFIT_GRAPH, {
        params: {
          startDate: moment(range.start).format('YYYY-MM-DD'),
          endDate: moment(range.end).format('YYYY-MM-DD'),
          id: currentUser[viewUserType]?._id,
          type: viewUserType,
        },
      })
  );

  const profitData = generateGraphData(
    profitGraphQuery?.data?.data?.info || [],
    (item) => item.payout,
    (item) => moment(item?.date).format('MMMM DD')
  );

  const profitChartData = {
    labels: profitData.labels,
    datasets: [
      {
        label: 'Profit',
        data: profitData.data,
        backgroundColor: 'rgba(60, 172, 221, 1)',
      },
    ],
  };

  return (
    <ChartBox
      loading={profitGraphQuery.isLoading}
      chartHeight={325}
      dateRange={range}
      setDateRange={setRange}
      title="Profit details"
      sm={12}
      xl={6}
    >
      <StyledBarChart data={profitChartData} />
    </ChartBox>
  );
}
