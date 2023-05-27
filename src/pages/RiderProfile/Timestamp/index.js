/* eslint-disable no-unused-vars */
import { Box, Unstable_Grid2 as Grid, Stack, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info.svg';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import ActivityTable from './Table';

const queryParamsInit = {
  page: 1,
  pageSize: 15,
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
  sortBy: 'desc',
  status: '',
};

function CardTitle({ title, tooltip }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
      <Typography variant="body1" fontWeight={600}>
        {title}
      </Typography>
      <Tooltip arrow title={tooltip}>
        <InfoIcon />
      </Tooltip>
    </Stack>
  );
}

export default function RiderTimeStamp({ riderId }) {
  const [queryParams, setQueryParams] = useState({ id: riderId, ...queryParamsInit });

  const query = useQuery([Api.TRACK_DELIVERY_MAN, queryParams], () =>
    AXIOS.get(Api.TRACK_DELIVERY_MAN, {
      params: queryParams,
    })
  );

  console.log(query?.data);

  return (
    <Box>
      <Grid container spacing={5} pb={7.5}>
        <InfoCard
          title={<CardTitle title="Active Time" tooltip="How much time was the rider active during business hours?" />}
          value="25 min"
          sm={6}
          md={4}
          lg={3}
        />
        <InfoCard
          title={<CardTitle title="Downtime" tooltip="How much time was your rider unavailable during menu hours?" />}
          value="25 min"
          sm={6}
          md={4}
          lg={3}
        />
        <InfoCard
          title={
            <CardTitle title="Rider Rejecterd" tooltip="How many orders were rejected by rider during working hours?" />
          }
          value="2551"
          sm={6}
          md={4}
          lg={3}
        />
        <InfoCard
          title={
            <CardTitle title="Missed Orders" tooltip="How many orders were missed by rider during working hours?" />
          }
          value="2551"
          sm={6}
          md={4}
          lg={3}
        />
      </Grid>
      {/* <TransactionsTable rows={getMockTrx(5)} /> */}
      <ActivityTable />
    </Box>
  );
}
