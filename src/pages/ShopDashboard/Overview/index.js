/* eslint-disable prettier/prettier */
import { Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import MarketingSpentChart from '../../../components/Shared/FinancialsOverview/MarketingSpentChart';
import OrderAmountChart from '../../../components/Shared/FinancialsOverview/OrderAmontChat';
import ProfitChart from '../../../components/Shared/FinancialsOverview/ProfitChart';
import CommonAreaChart from '../../../components/StyledCharts/CommonAreaChart';
import { useGlobalContext } from '../../../context';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import ItemRanking from './ItemRanking';
import OrderByHours from './OrderByHours';

export default function Overview() {
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;

  return (
    <Grid container spacing={6.5}>
      <CommonAreaChart
        gridProps={{
          sm: 12,
          lg: 6,
        }}
        title="Total Orders"
        api={Api.SHOP_DASHBOARD_ORDER_GRAPH}
        params={{
          shopId: shop?._id,
        }}
        generateData={(data = {}) =>
          generateGraphData(
            data?.data?.info || [],
            (item) => item.order,
            (item) => moment(item?.date).format('MMMM DD'),
          )
        }
      />
      <OrderAmountChart viewUserType="shop" />
      <OrderByHours />
      <ProfitChart viewUserType="shop" />
      <MarketingSpentChart viewUserType="shop" />
      <ItemRanking xs={12} sm={12} md={12} lg={6} />
      <CommonAreaChart
        title="Orders with Issues"
        api={Api.SHOP_DASHBOARD_ORDER_WITH_ISSUES_GRAPH}
        params={{
          id: shop?._id,
          type: 'shop',
        }}
        generateData={(data = {}) =>
          generateGraphData(
            data?.data?.info || [],
            (item) => item.ordersIssue,
            (item) => moment(item?.date).format('MMMM DD'),
          )
        }
        gridProps={{ xs: 12, lg: 6 }}
      />
    </Grid>
  );
}
