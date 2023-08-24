/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable max-len */
// third party
import { Box, Unstable_Grid2 as Grid, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info.svg';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { getFirstMonday } from '../../Styled/StyledDateRangePicker/Presets';
import DateRange from '../../StyledCharts/DateRange';
import InfoCard from '../../StyledCharts/InfoCard';

function ListItem({ label, value }) {
  return (
    <Typography
      variant="inherit"
      fontSize={13}
      fontWeight={600}
      lineHeight="20px"
      display="flex"
      justifyContent="space-between"
    >
      <span>{label}</span>
      <span>{value}</span>
    </Typography>
  );
}

export function CardTitle({ title, tooltip }) {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <Typography variant="body1" fontWeight={600}>
        {title}
      </Typography>
      <Tooltip arrow title={tooltip}>
        <InfoIcon />
      </Tooltip>
    </Stack>
  );
}

const getQueryParamsInit = (type, id) => ({
  endDate: moment(),
  startDate: getFirstMonday('week'),
  type,
  id,
});

// project import
export default function Operations({ viewUserType = 'shop' }) {
  const { currentUser } = useGlobalContext();

  const theme = useTheme();
  const [queryParams, setQueryParams] = useState(getQueryParamsInit(viewUserType, currentUser[viewUserType]?._id));

  const query = useQuery([Api.GET_SHOP_DASHBOARD_OPERATIONS, queryParams], () =>
    AXIOS.get(Api.GET_SHOP_DASHBOARD_OPERATIONS, {
      params: queryParams,
    })
  );

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" marginTop="-70px" pb={10.5}>
        <DateRange range={queryParams} startKey="startDate" endKey="endDate" setRange={setQueryParams} />
      </Stack>
      <Grid container spacing={5}>
        <InfoCard
          title={
            <CardTitle
              title="Store rejected"
              tooltip="How many orders were declined by your store during business hours?"
            />
          }
          value={query?.data?.data?.totalRejectedOrder || 0}
          isDropdown
          sm={6}
          md={4}
          lg={3}
        >
          {query?.data?.data?.dateWiseRejectedOrder?.length > 0 && (
            <Stack gap={2.5}>
              {query?.data?.data?.dateWiseRejectedOrder.map((order, i) => (
                <ListItem key={i} label={moment(order?.date)?.format('ddd M/DD/YYYY')} value={order?.count} />
              ))}
            </Stack>
          )}
        </InfoCard>
        <InfoCard
          title={
            <CardTitle
              title="Store refunded"
              tooltip="How many orders were reported by customers as having missing or incorrect items, resulting in refund being issued?"
            />
          }
          value={query?.data?.data?.totalRefundedOrder || 0}
          sm={6}
          md={4}
          lg={3}
        />
        <InfoCard
          title={
            <CardTitle
              title="Store cancelled"
              tooltip="What is the number of orders that your store accepted but subsequently canceled?"
            />
          }
          value={query?.data?.data?.totalCanceledOrder || 0}
          sm={6}
          md={4}
          lg={3}
        />
        <InfoCard
          title={<CardTitle title="Downtime" tooltip="How much time was your store unavailable during menu hours?" />}
          value={`${Math.floor(query?.data?.data?.totalDownTime?.totalMinutes / 60) || 0}h ${
            Math.floor(query?.data?.data?.totalDownTime?.totalMinutes % 60) || 0
          }m`}
          isDropdown
          sm={6}
          md={4}
          lg={3}
          valueSx={{ color: `${theme.palette.error.main}!important` }}
        >
          {query?.data?.data?.totalDownTime?.totalMinutes !== 0 ? (
            <Stack gap={2.5}>
              {query?.data?.data?.dateWiseDowntime.map((downTime, i) => (
                <Box key={i}>
                  <ListItem label={moment(downTime?.Date).format('ddd M/DD/YYYY')} value={downTime?.summeryString} />
                </Box>
              ))}
            </Stack>
          ) : (
            <ListItem label="No downtime found" />
          )}
        </InfoCard>
        <InfoCard
          title={
            <CardTitle
              title="Missed Orders"
              tooltip="How many orders were reported by customers as having missing or incorrect items, resulting in refund being issued?"
            />
          }
          value={query?.data?.data?.totalMissedOrder || 0}
          sm={6}
          md={4}
          lg={3}
        />
      </Grid>
    </Box>
  );
}
