import { Unstable_Grid2 as Grid, Stack } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { dateRangeInit } from '../../../helpers/dateRangeInit';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import CommonAreaChart from '../CommonAreaChart';
import CustomerBreakdown from './CustomerBreakdown';
import CustomerInfoCard from './Infocard';

const tabValueToPropsMap = {
  0: {
    title: 'Total customers',
    graphValueProp: 'totalCustomersSales',
  },

  1: {
    title: 'New Customers',
    graphValueProp: 'newCustomersSales',
  },

  2: {
    title: 'Return Customers',
    graphValueProp: 'repeatedCustomersSales',
  },

  3: {
    title: 'Lapsed customers',
    graphValueProp: 'lapsedCustomersSales',
  },
};

export default function Customers() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (index) => {
    setCurrentTab(index);
  };

  const [range] = useState({ ...dateRangeInit });

  useQuery(
    [
      'SHOP_DASHBOARD_CUSTOMER_INFO',
      {
        endDate: range.end,
        startDate: range.start,
        year: undefined,
        type: 'normal',
      },
    ],
    () =>
      AXIOS.get(Api.SHOP_DASHBOARD_CUSTOMER_INFO, {
        params: {
          endDate: range.end,
          startDate: range.start,
        },
      }),
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  return (
    <Grid container spacing={7.5}>
      <Grid xs={12} lg={3}>
        <Stack gap={6}>
          <CustomerInfoCard
            title="Total customers"
            dotColor="#3CACDD"
            amount={2551}
            isActive={currentTab === 0}
            index={0}
            onClick={handleTabChange}
          />
          <CustomerInfoCard
            title="New customers"
            dotColor="#50CD89"
            amount={2551}
            isActive={currentTab === 1}
            index={1}
            onClick={handleTabChange}
          />
          <CustomerInfoCard
            title="Repeated customers"
            dotColor="#FF8C51"
            amount={2551}
            isActive={currentTab === 2}
            index={2}
            onClick={handleTabChange}
          />
          <CustomerInfoCard
            title="Lapsed customers"
            dotColor="#8950FC"
            amount={2551}
            index={3}
            isActive={currentTab === 3}
            onClick={handleTabChange}
          />
        </Stack>
      </Grid>
      <Grid xs={12} lg={9}>
        <CustomerBreakdown title="Total customers" />
      </Grid>
      <CommonAreaChart
        api={Api.SHOP_DASHBOARD_CUSTOMER_SALES_GRAPH}
        cacheKey="SHOP_DASHBOARD_CUSTOMER_SALES_GRAPH"
        title={tabValueToPropsMap[currentTab].title}
        generateData={(data = {}) =>
          generateGraphData(
            data?.data?.info || [],
            (item) => item[tabValueToPropsMap[currentTab].graphValueProp],
            (item) => moment(item?.date).format('MMMM DD')
          )
        }
      />
    </Grid>
  );
}
