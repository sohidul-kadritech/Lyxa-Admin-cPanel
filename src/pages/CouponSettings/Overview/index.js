import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import SearchBar from '../../../components/Common/CommonSearchbar';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
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
    }
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
        <InfoCard title="Amount Spent" value={`${currency}${overView?.totalCouponsAmountSpent || 0}`} sm={6} md={2.4} />
        <InfoCard
          title="Ongoing"
          value={`${overView?.totalValidCoupons || 0}/${overView?.totalCoupons || 0}`}
          sm={6}
          md={2.4}
        />
        <InfoCard
          title="Total Orders"
          value={`${overView?.totalCouponsUsageOrders || 0}/${overView?.totalCouponsOrders || 0}`}
          sm={6}
          md={2.4}
        />
        <InfoCard title="Order Increase" value={`${overView?.orderIncreasePercentage || 0}%`} sm={6} md={2.4} />
        <InfoCard title="Usage" value={`${overView?.totalCouponsUsagePercentage || 0}%`} sm={6} md={2.4} />
      </Grid>
      <CouponOverviewTable rows={rows} loading={query?.isLoading} />
    </Box>
  );
}
