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
          setRange((prev) => ({ ...prev, [startKey]: startDate, [endKey]: endDate }));
        }}
      />
    </Stack>
  );
}
