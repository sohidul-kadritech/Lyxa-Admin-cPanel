import { Stack, Typography } from '@mui/material';
import moment from 'moment';
import { getDateRange } from '../Settings/helpers';

export const getMarketingStatusWithDate = (status, row) => {
  const marketingPausedAt = row?.marketingPausedAt;
  const marketingDeleteAt = row?.deletedAt;
  const expiredDate = row?.duration;
  const duration = getDateRange(row);

  console.log(expiredDate, duration);

  if (status === 'paused')
    return (
      <Stack alignItems="center" gap={0}>
        <Typography variant="body" sx={{ fontSize: '12px' }}>
          {status}
        </Typography>
        <Typography variant="body" sx={{ fontSize: '10px !important', color: '#525252' }}>
          {moment(marketingPausedAt).format('MMMM DD, YYYY')}
        </Typography>
      </Stack>
    );
  if (status === 'deleted')
    return (
      <Stack alignItems="center" gap={0}>
        <Typography variant="body" sx={{ fontSize: '12px' }}>
          {status}
        </Typography>
        <Typography variant="body" sx={{ fontSize: '10px !important', color: '#525252' }}>
          {moment(marketingDeleteAt).format('MMMM DD, YYYY')}
        </Typography>
      </Stack>
    );

  if (status === 'expired')
    return (
      <Stack alignItems="center" gap={0}>
        <Typography variant="body" sx={{ fontSize: '12px' }}>
          {status}
        </Typography>
        <Typography variant="body" sx={{ fontSize: '10px !important', color: '#525252' }}>
          {moment(expiredDate?.end).format('MMMM DD, YYYY')}
        </Typography>
      </Stack>
    );

  if (status === 'ongoing')
    return (
      <Stack alignItems="center" gap={0}>
        <Typography variant="body" sx={{ fontSize: '12px' }}>
          {status}
        </Typography>
        <Typography variant="body" sx={{ fontSize: '10px !important', color: '#525252' }}>
          {duration} days left
        </Typography>
      </Stack>
    );

  return status;
};
