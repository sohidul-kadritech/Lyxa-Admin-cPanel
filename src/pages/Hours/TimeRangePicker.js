import { Stack, Typography } from '@mui/material';
import StyledTimePicker from '../../components/Styled/StyledTimePicker';

export default function TimeRangePicker({ startValue, onStartChange, endValue, onEndChange, disabled }) {
  return (
    <Stack direction="row" alignItems="center" gap={7.5}>
      <StyledTimePicker size="sm" value={startValue} onChange={onStartChange} disabled={disabled} />
      <Typography variant="body1" fontWeight={500}>
        to
      </Typography>
      <StyledTimePicker size="sm" value={endValue} onChange={onEndChange} disabled={disabled} />
    </Stack>
  );
}
