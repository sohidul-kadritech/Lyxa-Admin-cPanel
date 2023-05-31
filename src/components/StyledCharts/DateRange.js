import { Stack } from '@mui/material';
import moment from 'moment';
import FilterDate from '../Filter/FilterDate';

export default function DateRange({ range, setRange, startKey = 'start', endKey = 'end', size = 'sm' }) {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <FilterDate
        value={range?.[startKey]}
        maxDate={moment(range?.[endKey]).subtract(1, 'day')}
        tooltip="Start Date"
        size={size}
        onChange={(e) => {
          setRange((prev) => ({ ...prev, [startKey]: e._d }));
        }}
      />
      <FilterDate
        value={range?.[endKey]}
        minDate={moment(range?.[startKey]).add(1, 'day')}
        tooltip="End Date"
        size={size}
        onChange={(e) => {
          setRange((prev) => ({ ...prev, [endKey]: e._d }));
        }}
      />
    </Stack>
  );
}
