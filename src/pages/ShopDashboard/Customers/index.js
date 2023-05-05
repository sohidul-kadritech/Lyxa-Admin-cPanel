import { Box, Unstable_Grid2 as Grid, Stack } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import DateRange from '../../../components/StyledCharts/DateRange';
import { dateRangeInit } from '../../../helpers/dateRangeInit';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import CommonAreaChart from '../CommonAreaChart';
import CustomerBreakdown from './CustomerBreakdown';
import CustomerInfoCard from './Infocard';

const tabValueToPropsMap = {
  total: {
    title: 'Total customers',
    graphValueProp: 'totalCustomersSales',
  },

  new: {
    title: 'New Customers',
    graphValueProp: 'newCustomersSales',
  },

  repeated: {
    title: 'Return Customers',
    graphValueProp: 'repeatedCustomersSales',
  },

  lapsed: {
    title: 'Lapsed customers',
    graphValueProp: 'lapsedCustomersSales',
  },
};

export default function Customers() {
  const [currentTab, setCurrentTab] = useState('total');
  const [range, setRange] = useState({ ...dateRangeInit });

  const handleTabChange = (index) => {
    setCurrentTab(index);
  };

  const query = useQuery(
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
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" marginTop="-70px" pb={10.5}>
        <DateRange range={range} setRange={setRange} />
      </Stack>
      <Grid container spacing={7.5}>
        <Grid xs={12} lg={3}>
          <Stack gap={6}>
            <CustomerInfoCard
              title="Total customers"
              dotColor="#3CACDD"
              amount={query?.data?.data?.totalCustomers}
              isActive={currentTab === 'total'}
              index="total"
              onClick={handleTabChange}
            />
            <CustomerInfoCard
              title="New customers"
              dotColor="#50CD89"
              amount={query?.data?.data?.newCustomers}
              isActive={currentTab === 'new'}
              index="new"
              onClick={handleTabChange}
            />
            <CustomerInfoCard
              title="Repeated customers"
              dotColor="#FF8C51"
              amount={query?.data?.data?.repeatedCustomers}
              isActive={currentTab === 'repeated'}
              index="repeated"
              onClick={handleTabChange}
            />
            <CustomerInfoCard
              title="Lapsed customers"
              dotColor="#8950FC"
              amount={query?.data?.data?.lapsedCustomers}
              index="lapsed"
              isActive={currentTab === 'lapsed'}
              onClick={handleTabChange}
            />
          </Stack>
        </Grid>
        <Grid xs={12} lg={9}>
          <CustomerBreakdown
            title={tabValueToPropsMap[currentTab].title}
            details={query?.data?.data}
            customerType={currentTab}
          />
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
    </Box>
  );
}
