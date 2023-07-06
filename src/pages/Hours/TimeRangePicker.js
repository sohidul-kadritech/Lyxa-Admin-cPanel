import { Stack, Typography } from '@mui/material';
import StyledNativeTimePicker from '../../components/Styled/StyledNativeTimePicker';

export default function TimeRangePicker({ startValue, onStartChange, endValue, onEndChange, disabled }) {
  return (
    <Stack direction="row" alignItems="center" gap={7.5}>
      {/* <StyledTimePicker size="sm" value={startValue} onChange={onStartChange} disabled={disabled} />
      <Typography variant="body1" fontWeight={500}>
        to
      </Typography>
      <StyledTimePicker size="sm" value={endValue} onChange={onEndChange} disabled={disabled} /> */}

      <StyledNativeTimePicker value={startValue} onChange={onStartChange} disabled={disabled} />
      <Typography variant="body1" fontWeight={500}>
        to
      </Typography>
      <StyledNativeTimePicker value={endValue} onChange={onEndChange} disabled={disabled} />
    </Stack>
  );
}
