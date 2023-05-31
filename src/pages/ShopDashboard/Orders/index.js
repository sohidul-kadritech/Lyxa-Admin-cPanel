import { Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import CommonAreaChart from '../../../components/StyledCharts/CommonAreaChart';
import { useGlobalContext } from '../../../context';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import ItemRanking from './ItemRanking';
import OrderByHours from './OrderByHours';

export default function Orders() {
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;

  return (
    <Grid container spacing={6.5}>
      <CommonAreaChart
        title="Total Orders"
        api={Api.SHOP_DASHBOARD_ORDER_GRAPH}
        params={{
          shopId: shop?._id,
        }}
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
        params={{
          id: shop?._id,
          type: 'shop',
        }}
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
