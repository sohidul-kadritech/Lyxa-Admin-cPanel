import { Stack } from '@mui/material';
import StyledDateRangePicker from '../Styled/StyledDateRangePicker';

// eslint-disable-next-line no-unused-vars
export default function DateRange({ range, setRange, startKey = 'start', endKey = 'end', size = 'sm' }) {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <StyledDateRangePicker
        startDate={range?.[startKey]}
        endDate={range?.[endKey]}
        onChange={({ startDate, endDate }) => {
          setRange((prev) => ({ ...prev, [startKey]: startDate._d, [endKey]: endDate._d }));
        }}
      />
      {/* <FilterDate
        value={range?.[startKey]}
        maxDate={moment(range?.[endKey]).subtract(1, 'day')}
        minDate={moment(range?.[endKey]).subtract(6, 'month')}
        tooltip="Start Date"
        size={size}
        onChange={(e) => {
          setRange((prev) => ({ ...prev, [startKey]: e._d }));
        }}
      />
      <FilterDate
        value={range?.[endKey]}
        minDate={moment(range?.[startKey]).add(1, 'day')}
        maxDate={moment(range?.[startKey]).add(6, 'month')}
        tooltip="End Date"
        size={size}
        onChange={(e) => {
          setRange((prev) => ({ ...prev, [endKey]: e._d }));
        }}
      /> */}
    </Stack>
  );
}
