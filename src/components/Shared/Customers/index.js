import { Box, Unstable_Grid2 as Grid, Stack } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useGlobalContext } from '../../../context';
import { dateRangeInit } from '../../../helpers/dateRangeInit';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import CommonAreaChart from '../../StyledCharts/CommonAreaChart';
import DateRange from '../../StyledCharts/DateRange';
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

export default function Customers({ viewUserType }) {
  const [currentTab, setCurrentTab] = useState('total');
  const [range, setRange] = useState({ ...dateRangeInit });
  const { currentUser } = useGlobalContext();

  const handleTabChange = (index) => {
    setCurrentTab(index);
  };

  const query = useQuery(
    [
      Api.SHOP_DASHBOARD_CUSTOMER_INFO,
      {
        endDate: moment(range.end).format('YYYY-MM-DD'),
        startDate: moment(range.start).format('YYYY-MM-DD'),
        type: viewUserType,
        id: currentUser[viewUserType]?._id,
      },
    ],
    () =>
      AXIOS.get(Api.SHOP_DASHBOARD_CUSTOMER_INFO, {
        params: {
          endDate: moment(range.end).format('YYYY-MM-DD'),
          startDate: moment(range.start).format('YYYY-MM-DD'),
          type: viewUserType,
          id: currentUser[viewUserType]?._id,
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
              amount={query?.data?.data?.totalCustomers || 0}
              isActive={currentTab === 'total'}
              index="total"
              onClick={handleTabChange}
              percentage={query?.data?.data?.totalCustomersPercentOfSales || 0}
            />
            <CustomerInfoCard
              title="New customers"
              dotColor="#50CD89"
              amount={query?.data?.data?.newCustomers || 0}
              isActive={currentTab === 'new'}
              index="new"
              onClick={handleTabChange}
              percentage={query?.data?.data?.newCustomersPercentOfSales || 0}
            />
            <CustomerInfoCard
              title="Repeated customers"
              dotColor="#FF8C51"
              amount={query?.data?.data?.repeatedCustomers || 0}
              isActive={currentTab === 'repeated'}
              index="repeated"
              onClick={handleTabChange}
              percentage={query?.data?.data?.repeatedCustomersPercentOfSales || 0}
            />
            <CustomerInfoCard
              title="Lapsed customers"
              dotColor="#8950FC"
              amount={query?.data?.data?.lapsedCustomers || 0}
              index="lapsed"
              isActive={currentTab === 'lapsed'}
              onClick={handleTabChange}
              percentage={query?.data?.data?.lapsedCustomersPercentOfSales || 0}
            />
          </Stack>
        </Grid>
        <Grid xs={12} lg={9}>
          <CustomerBreakdown
            title={tabValueToPropsMap[currentTab].title}
            details={query?.data?.data}
            customerType={currentTab}
            range={range}
          />
        </Grid>
        <CommonAreaChart
          api={Api.SHOP_DASHBOARD_CUSTOMER_SALES_GRAPH}
          title={tabValueToPropsMap[currentTab].title}
          params={{
            type: viewUserType,
            id: currentUser[viewUserType]?._id,
          }}
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
