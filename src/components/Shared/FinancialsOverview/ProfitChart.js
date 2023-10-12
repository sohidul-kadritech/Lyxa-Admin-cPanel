/* eslint-disable prettier/prettier */
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ChartBox from '../../StyledCharts/ChartBox';

// local
import { useGlobalContext } from '../../../context';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { getFirstMonday } from '../../Styled/StyledDateRangePicker/Presets';
import StyledBarChart from '../../StyledCharts/StyledBarChart';

const getQueryParamsInit = (type, id) => ({
  endDate: moment(),
  startDate: getFirstMonday('week'),
  type,
  id,
});

export default function ProfitChart({ viewUserType = 'shop' }) {
  const { currentUser, general } = useGlobalContext();

  const { currency } = general;
  const [queryParams, setQueryParams] = useState(getQueryParamsInit(viewUserType, currentUser[viewUserType]?._id));

  const profitGraphQuery = useQuery([Api.GET_SHOP_DASHBOARD_PROFIT_GRAPH, queryParams], () =>
    AXIOS.get(Api.GET_SHOP_DASHBOARD_PROFIT_GRAPH, {
      params: queryParams,
    }),
  );

  const profitData = generateGraphData(
    profitGraphQuery?.data?.data?.info || [],
    (item) => parseFloat((item.payout || 0).toFixed(2)),
    (item) => moment(item?.date).format('MMMM DD'),
  );

  const profitChartData = {
    labels: profitData.labels,
    datasets: [
      {
        label: `Profit (${currency?.symbol})`,
        data: profitData.data,
        backgroundColor: 'rgba(60, 172, 221, 1)',
      },
    ],
  };

  return (
    <ChartBox
      loading={profitGraphQuery.isLoading}
      chartHeight={325}
      dateRange={queryParams}
      setDateRange={setQueryParams}
      startDateKey="startDate"
      endDateKey="endDate"
      title="Profit details"
      sm={12}
      xl={6}
    >
      <StyledBarChart data={profitChartData} />
    </ChartBox>
  );
}
