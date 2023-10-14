/* eslint-disable prettier/prettier */
import { Box, Unstable_Grid2 as Grid, Stack } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useGlobalContext } from '../../../context';
import { generateGraphData } from '../../../helpers/generateGraphData';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { getFirstMonday } from '../../Styled/StyledDateRangePicker/Presets';
import CommonAreaChart from '../../StyledCharts/CommonAreaChart';
import DateRange from '../../StyledCharts/DateRange';
import CustomerBreakdown from './CustomerBreakdown';
import CustomerInfoCard from './Infocard';

const tabValueToPropsMap = {
  total: {
    title: 'Total Shop customers',
    graphValueProp: 'totalCustomersSales',
  },

  new: {
    title: 'New Customers',
    graphValueProp: 'newCustomersSales',
  },

  repeated: {
    title: 'Repeated Customers',
    graphValueProp: 'repeatedCustomersSales',
  },

  lapsed: {
    title: 'Lapsed customers',
    graphValueProp: 'lapsedCustomersSales',
  },
};

const getQueryParamsInit = (type, id) => ({
  endDate: moment(),
  startDate: getFirstMonday('week'),
  type,
  id,
});

export default function Customers({ viewUserType }) {
  const [currentTab, setCurrentTab] = useState('total');
  const { currentUser, general } = useGlobalContext();

  const { currency } = general;
  const [queryParams, setQueryParams] = useState(getQueryParamsInit(viewUserType, currentUser[viewUserType]?._id));

  const handleTabChange = (index) => {
    setCurrentTab(index);
  };

  const query = useQuery([Api.SHOP_DASHBOARD_CUSTOMER_INFO, queryParams], () =>
    AXIOS.get(Api.SHOP_DASHBOARD_CUSTOMER_INFO, {
      params: queryParams,
    }),
  );

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" marginTop="-70px" pb={10.5}>
        <DateRange range={queryParams} startKey="startDate" endKey="endDate" setRange={setQueryParams} />
      </Stack>
      <Grid container spacing={7.5}>
        <Grid xs={12} lg={3}>
          <Stack gap={6}>
            <CustomerInfoCard
              title="Total Shop customers"
              dotColor="#3CACDD"
              amount={query?.data?.data?.totalCustomers || 0}
              isActive={currentTab === 'total'}
              index="total"
              onClick={handleTabChange}
              percentage={query?.data?.data?.totalCustomersPercentOfSales || 0}
              // eslint-disable-next-line max-len
              tooltip="Total number of customers is regardless of time range. But other details are for specified time range"
            />
            <CustomerInfoCard
              title="New customers"
              dotColor="#50CD89"
              amount={query?.data?.data?.newCustomers || 0}
              isActive={currentTab === 'new'}
              index="new"
              onClick={handleTabChange}
              percentage={query?.data?.data?.newCustomersPercentOfSales || 0}
              tooltip="Number of new customers in specified time range and their details"
            />
            <CustomerInfoCard
              title="Repeated customers"
              dotColor="#FF8C51"
              amount={query?.data?.data?.repeatedCustomers || 0}
              isActive={currentTab === 'repeated'}
              index="repeated"
              onClick={handleTabChange}
              percentage={query?.data?.data?.repeatedCustomersPercentOfSales || 0}
              tooltip="Number of old customers that have ordered in specified time range and their details"
            />
            <CustomerInfoCard
              title="Lapsed customers"
              dotColor="#8950FC"
              amount={query?.data?.data?.lapsedCustomers || 0}
              index="lapsed"
              isActive={currentTab === 'lapsed'}
              onClick={handleTabChange}
              hidePercentage
              tooltip="Number of old customers that did not order in specified time range"
            />
          </Stack>
        </Grid>
        <Grid xs={12} lg={9}>
          <CustomerBreakdown
            title={tabValueToPropsMap[currentTab].title}
            details={query?.data?.data}
            customerType={currentTab}
            range={queryParams}
          />
        </Grid>
        {currentTab !== 'lapsed' && (
          <CommonAreaChart
            valueLabel={`Sales (${currency?.symbol})`}
            api={Api.SHOP_DASHBOARD_CUSTOMER_SALES_GRAPH}
            title={`${tabValueToPropsMap[currentTab].title} sales`}
            params={{
              type: viewUserType,
              id: currentUser[viewUserType]?._id,
            }}
            generateData={(data = {}) =>
              generateGraphData(
                data?.data?.info || [],
                (item) => item[tabValueToPropsMap[currentTab].graphValueProp],
                (item) => moment(item?.date).format('MMMM DD'),
              )
            }
          />
        )}
      </Grid>
    </Box>
  );
}
