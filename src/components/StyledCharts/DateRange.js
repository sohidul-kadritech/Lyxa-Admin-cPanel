import { Stack } from '@mui/material';
import moment from 'moment';
import FilterDate from '../Filter/FilterDate';

export default function DateRange({ range, setRange }) {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <FilterDate
        value={range?.start}
        maxDate={moment(range.end).subtract(1, 'day')}
        tooltip="Start Date"
        size="sm"
        onChange={(e) => {
          setRange((prev) => ({ ...prev, start: e._d }));
        }}
      />
      <FilterDate
        value={range?.end}
        minDate={moment(range.start).add(1, 'day')}
        tooltip="End Date"
        size="sm"
        onChange={(e) => {
          setRange((prev) => ({ ...prev, end: e._d }));
        }}
      />
    </Stack>
  );
}
