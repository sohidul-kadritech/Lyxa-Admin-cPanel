import { Stack, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info.svg';

export const calcActiveTime = (min) => {
  const str = [];
  const day = Math.floor(min / 60 / 24);
  const hour = Math.floor((min / 60) % 24);
  const mins = Math.floor(min % 60);

  if (day >= 1) str.push(`${day} d`);
  if (hour >= 1) str.push(`${hour} h`);
  if (mins >= 1 || (hour < 1 && day < 1)) str.push(`${mins} m`);
  return str.join(' ');
};

export function CardTitle({ title, tooltip }) {
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

export const queryParamsInit = {
  page: 1,
  pageSize: 10,
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
  sortBy: 'desc',
  status: '',
};
