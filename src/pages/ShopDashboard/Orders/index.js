import { Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import { useQuery } from 'react-query';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import CommonAreaChart from '../CommonAreaChart';
import ItemRanking from './ItemRanking';
import OrderByHours from './OrderByHours';

export default function Orders() {
  const getRankedItem = useQuery([Api.SHOP_DASHBOARD_ITEM_RANKING], () =>
    // eslint-disable-next-line prettier/prettier
    AXIOS.get(Api.SHOP_DASHBOARD_ITEM_RANKING),
  );
  console.log('ranked item: ', getRankedItem?.data?.data);
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
            // eslint-disable-next-line prettier/prettier
            (item) => moment(item?.date).format('MMMM DD'),
          )
        }
      />
      <ItemRanking loading={getRankedItem} rankedData={getRankedItem?.data?.data?.items || []} />
      <OrderByHours />
      <CommonAreaChart
        title="Orders with issues"
        api={Api.SHOP_DASHBOARD_ORDER_WITH_ISSUES_GRAPH}
        cacheKey="SHOP_DASHBOARD_ORDER_WITH_ISSUES_GRAPH"
        generateData={(data = {}) =>
          generateGraphData(
            data?.data?.info || [],
            (item) => item.ordersIssue,
            // eslint-disable-next-line prettier/prettier
            (item) => moment(item?.date).format('MMMM DD'),
          )
        }
      />
    </Grid>
  );
}
