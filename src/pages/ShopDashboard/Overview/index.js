/* eslint-disable prettier/prettier */
import { Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import { TitleWithToolTip } from '../../../components/Common/TitleWithToolTip';
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
      <OrderAmountChart
        viewUserType="shop"
        title={
          <TitleWithToolTip
            title="Total Order Amount"
            tooltip="This graph shows how much money this store made from selling products to customers"
            sx={{ fontSize: '16px!important' }}
          />
        }
      />
      <OrderByHours />
      <ProfitChart viewUserType="shop" />
      <MarketingSpentChart viewUserType="shop" />
      <ItemRanking xs={12} sm={12} md={12} lg={6} />
      <CommonAreaChart
        title={
          <TitleWithToolTip
            title="Orders with Issues"
            tooltip="This chart helps us to see how many times orders have problems or flags when they're delivered. 
            It gives us a quick look at any issues that might come up during the delivery process."
            sx={{ fontSize: '16px!important' }}
          />
        }
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
