/* eslint-disable no-unused-vars */
import { Box, Unstable_Grid2 as Grid, Stack } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TablePagination from '../../../components/Common/TablePagination';
import DateRange from '../../../components/StyledCharts/DateRange';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import ActivityTable from './Table';
import { CardTitle, calcActiveTime, queryParamsInit } from './helper';

export default function RiderTimeStamp({ riderId }) {
  const [queryParams, setQueryParams] = useState({ id: riderId, ...queryParamsInit });
  const [totalPage, setTotalPage] = useState(0);

  const query = useQuery(
    [Api.TRACK_DELIVERY_MAN, queryParams],
    () =>
      AXIOS.get(Api.TRACK_DELIVERY_MAN, {
        params: queryParams,
      }),
    {
      onSuccess: (data) => {
        setTotalPage(data?.data?.data?.paginate?.metadata?.page?.totalPage || 1);
      },
    }
  );

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" pb={7.5}>
        <DateRange startKey="startDate" endKey="endDate" range={queryParams} setRange={setQueryParams} />
      </Stack>
      <Grid container spacing={5} pb={7.5}>
        <InfoCard
          title={<CardTitle title="Active Time" tooltip="How much time was the rider active during business hours?" />}
          value={calcActiveTime(query?.data?.data?.deliveryBoySummery?.totalMinutes || 0)}
          sm={6}
          md={3}
        />
        <InfoCard
          title={
            <CardTitle title="Rider Canceled" tooltip="How many orders were rejected by rider during working hours?" />
          }
          value={query?.data?.data?.totalRiderCanceledOrder || 0}
          sm={6}
          md={3}
        />
        <InfoCard
          title={
            <CardTitle title="Rider Rejecterd" tooltip="How many orders were rejected by rider during working hours?" />
          }
          value={query?.data?.data?.totalRiderMissedOrder || 0}
          sm={6}
          md={3}
        />
        <InfoCard
          title={
            <CardTitle title="Missed Orders" tooltip="How many orders were missed by rider during working hours?" />
          }
          value={query?.data?.data?.totalRiderRejectedOrder || 0}
          sm={6}
          md={3}
        />
      </Grid>
      <ActivityTable rows={query?.data?.data?.activities} />
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={totalPage}
      />
    </Box>
  );
}
