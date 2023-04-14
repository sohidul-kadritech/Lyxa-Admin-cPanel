import { Stack } from '@mui/material';
import FilterDate from '../Filter/FilterDate';

export default function DateRange({ range, setRange }) {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <FilterDate
        value={range?.start}
        tooltip="Start Date"
        size="sm"
        onChange={(e) => {
          setRange((prev) => ({ ...prev, start: e._d }));
        }}
      />
      <FilterDate
        value={range?.end}
        tooltip="End Date"
        size="sm"
        onChange={(e) => {
          setRange((prev) => ({ ...prev, end: e._d }));
        }}
      />
    </Stack>
  );
}
