/* eslint-disable prettier/prettier */
import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../../components/Common/CommonSearchbar';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

import { CardTitle } from '../../../components/Shared/Operations';
import { createCouponOverviewRows } from '../helpers';
import CouponOverviewTable from './Table';

const queryParamsInit = {
  startDate: moment().startOf('month'),
  endDate: moment(),
};

export default function CouponOverview() {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });
  const [overView, setOverview] = useState({});
  const [rows, setRows] = useState([]);

  const query = useQuery(
    [Api.GET_COUPON_OVERVIEW, queryParams],
    () =>
      AXIOS.get(Api.GET_COUPON_OVERVIEW, {
        params: queryParams,
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setOverview(data?.data?.couponsOverview);
          setRows(createCouponOverviewRows(data?.data));
        }
      },
    },
  );

  useEffect(() => {
    setOverview(query?.data?.data?.couponsOverview);
    setRows(createCouponOverviewRows(query?.data?.data));
  }, []);

  console.log('coupon data', query?.data);

  return (
    <Box pt={7.5} pb={13}>
      <Box pb={7.5}>
        <SearchBar
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          showFilters={{
            date: true,
          }}
        />
      </Box>
      <Grid container spacing={5} pb={7.5}>
        <InfoCard
          title={<CardTitle title="Amount Spent" tooltip="How much was spent using coupons?" />}
          value={`${currency}${overView?.totalCouponsAmountSpent || 0}`}
          sm={6}
          md={2.4}
        />
        <InfoCard
          title={<CardTitle title="Ongoing" tooltip="How many active coupons are there?" />}
          value={`${overView?.totalValidCoupons || 0}/${overView?.totalCoupons || 0}`}
          sm={6}
          md={2.4}
        />
        <InfoCard
          title={<CardTitle title="Total Orders" tooltip="How many orders were made using the ongoing coupon?" />}
          value={`${overView?.totalCouponsUsageOrders || 0}/${overView?.totalCouponsOrders || 0}`}
          sm={6}
          md={2.4}
        />
        <InfoCard
          title={<CardTitle title="Order Increase" tooltip="How many orders are increased on coupon?" />}
          value={`${overView?.orderIncreasePercentage || 0}%`}
          sm={6}
          md={2.4}
        />
        <InfoCard
          title={<CardTitle title="Usage" tooltip="Percentage of total orders on total order limits" />}
          value={`${overView?.totalCouponsUsagePercentage || 0}%`}
          sm={6}
          md={2.4}
        />
      </Grid>
      <CouponOverviewTable rows={rows} loading={query?.isLoading} />
    </Box>
  );
}
