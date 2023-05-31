import moment from 'moment';
import { useQuery } from 'react-query';

// local
import { useState } from 'react';
import ChartBox from '../../../components/StyledCharts/ChartBox';
import StyledAreaChart from '../../../components/StyledCharts/StyledAreaChart';
import { useGlobalContext } from '../../../context';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

export default function OrderAmountChart({ viewUserType }) {
  const [range, setRange] = useState({ ...dateRangeItit });
  const { currentUser } = useGlobalContext();

  console.log({ viewUserType });

  // order amount graph
  const orderAmountGraphQuery = useQuery(
    [
      Api.GET_SHOP_DASHBOARD_ORDER_AMOUNT_GRAPH,
      {
        startDate: moment(range.start).format('YYYY-MM-DD'),
        endDate: moment(range.end).format('YYYY-MM-DD'),
        id: currentUser[viewUserType]?._id,
        type: viewUserType,
      },
    ],
    () =>
      AXIOS.get(Api.GET_SHOP_DASHBOARD_ORDER_AMOUNT_GRAPH, {
        params: {
          startDate: moment(range.start).format('YYYY-MM-DD'),
          endDate: moment(range.end).format('YYYY-MM-DD'),
          id: currentUser[viewUserType]?._id,
          type: viewUserType,
        },
      })
  );

  const orderAmountData = generateGraphData(
    orderAmountGraphQuery?.data?.data?.info || [],
    (item) => item.revenue,
    (item) => moment(item?.date).format('MMMM DD')
  );

  const areaChartData = {
    labels: orderAmountData.labels,
    datasets: [
      {
        fill: true,
        label: 'Amount',
        data: orderAmountData.data,
        borderColor: 'rgba(126, 130, 153, 1)',
        borderWidth: 1,
        backgroundColor: 'rgba(126, 130, 153, 0.15)',
      },
    ],
  };

  return (
    <ChartBox
      loading={orderAmountGraphQuery?.isLoading}
      chartHeight={300}
      dateRange={range}
      setDateRange={setRange}
      title="Total Order Amount"
      sm={12}
    >
      <StyledAreaChart data={areaChartData} />
    </ChartBox>
  );
}
