import { Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { TitleWithToolTip } from '../../components/Common/TitleWithToolTip';
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
        title={
          <TitleWithToolTip
            title="Total Orders"
            tooltip="Number of orders delivered by the assigned seller's shop within this time period"
          />
        }
        api={API_URL.SALES_MANAGER_DASHBOARD_ORDER_GRAPH}
        params={{
          salesId: admin?._id,
        }}
        sx={{ overflow: 'visible' }}
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
