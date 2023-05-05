import { Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import CommonAreaChart from '../CommonAreaChart';
import ItemRanking from './ItemRanking';
import OrderByHours from './OrderByHours';

export default function Orders() {
  return (
    <Grid container spacing={6.5}>
      <CommonAreaChart
        title="Total Orders"
        api={Api.SHOP_DASHBOARD_ORDER_GRAPH}
        cacheKey="SHOP_DASHBOARD_ORDER_GRAPH"
        generateData={(data = {}) =>
          generateGraphData(
            data?.data?.info || [],
            (item) => item.order,
            (item) => moment(item?.date).format('MMMM DD')
          )
        }
      />
      <ItemRanking />
      <OrderByHours />
      <CommonAreaChart
        title="Orders with issues"
        api={Api.SHOP_DASHBOARD_ORDER_WITH_ISSUES_GRAPH}
        cacheKey="SHOP_DASHBOARD_ORDER_WITH_ISSUES_GRAPH"
        generateData={(data = {}) =>
          generateGraphData(
            data?.data?.info || [],
            (item) => item.ordersIssue,
            (item) => moment(item?.date).format('MMMM DD')
          )
        }
      />
    </Grid>
  );
}
