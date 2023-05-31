import { Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import CommonAreaChart from '../../../components/StyledCharts/CommonAreaChart';
import { useGlobalContext } from '../../../context';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import ShopList from './ShopList';

export default function Orders() {
  const { currentUser } = useGlobalContext();
  const { seller } = currentUser;

  return (
    <Grid container spacing={6.5}>
      <CommonAreaChart
        title="Total Orders"
        api={Api.SELLER_DASHBOARD_ORDER_GRAPH}
        params={{
          sellerId: seller?._id,
        }}
        generateData={(data = {}) =>
          generateGraphData(
            data?.data?.info || [],
            (item) => item.order,
            (item) => moment(item?.date).format('MMMM DD')
          )
        }
      />
      <ShopList />
    </Grid>
  );
}
