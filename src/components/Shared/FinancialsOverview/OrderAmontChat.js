/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import moment from 'moment';
import { useQuery } from 'react-query';

// local
import { useState } from 'react';
import { useGlobalContext } from '../../../context';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { getFirstMonday } from '../../Styled/StyledDateRangePicker/Presets';
import ChartBox from '../../StyledCharts/ChartBox';
import StyledAreaChart from '../../StyledCharts/StyledAreaChart';

const getQueryParamsInit = (type, id) => ({
  endDate: moment(),
  startDate: getFirstMonday('week'),
  type,
  id,
});

export default function OrderAmountChart({ viewUserType, title = 'Total Order Amount' }) {
  const { currentUser, general } = useGlobalContext();

  const { currency } = general;

  const [queryParams, setQueryParams] = useState(getQueryParamsInit(viewUserType, currentUser[viewUserType]?._id));

  console.log({ general });

  // order amount graph
  const orderAmountGraphQuery = useQuery([Api.GET_SHOP_DASHBOARD_ORDER_AMOUNT_GRAPH, queryParams], () =>
    AXIOS.get(Api.GET_SHOP_DASHBOARD_ORDER_AMOUNT_GRAPH, {
      params: queryParams,
    }),
  );

  const orderAmountData = generateGraphData(
    orderAmountGraphQuery?.data?.data?.info || [],
    (item) => item.revenue,
    (item) => moment(item?.date).format('MMMM DD'),
  );

  const areaChartData = {
    labels: orderAmountData.labels,
    datasets: [
      {
        fill: true,
        label: `Amount (${currency?.symbol})`,
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
      dateRange={queryParams}
      setDateRange={setQueryParams}
      startDateKey="startDate"
      endDateKey="endDate"
      title={title}
      lg={6}
      sm={12}
    >
      <StyledAreaChart data={areaChartData} />
    </ChartBox>
  );
}
