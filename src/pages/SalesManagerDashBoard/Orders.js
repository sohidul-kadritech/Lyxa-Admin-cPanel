import { Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import React from 'react';
import CommonAreaChart from '../../components/StyledCharts/CommonAreaChart';
import { useGlobalContext } from '../../context';
import { generateGraphData } from '../../helpers/generateGraphData';
import * as API_URL from '../../network/Api';

function Orders() {
  const { currentUser } = useGlobalContext();
  const { admin } = currentUser;
  return (
    <Grid container spacing={6.5}>
      <CommonAreaChart
        title="Total Orders"
        api={API_URL.SHOP_DASHBOARD_ORDER_GRAPH}
        params={{
          shopId: admin?._id,
        }}
        generateData={(data = {}) =>
          generateGraphData(
            data?.data?.info || [],
            (item) => item.order,
            // eslint-disable-next-line prettier/prettier
            (item) => moment(item?.date).format('MMMM DD'),
          )
        }
      />
    </Grid>
  );
}

export default Orders;
