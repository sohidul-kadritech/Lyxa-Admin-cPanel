import React from 'react';

import { Api } from '@mui/icons-material';
import { Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import CommonAreaChart from '../../components/StyledCharts/CommonAreaChart';
import { useGlobalContext } from '../../context';
import { generateGraphData } from '../../helpers/generateGraphData';

function Orders() {
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
            // eslint-disable-next-line prettier/prettier
            (item) => moment(item?.date).format('MMMM DD'),
          )
        }
      />
    </Grid>
  );
}

export default Orders;
