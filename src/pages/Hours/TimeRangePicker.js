import { Stack, Typography } from '@mui/material';
import moment from 'moment';
import StyledTimePicker from '../../components/Styled/StyledTimePicker';

export default function TimeRangePicker({ startValue, onStartChange, endValue, onEndChange, disabled, minutesStep }) {
  return (
    <Stack direction="row" alignItems="center" gap={7.5}>
      <StyledTimePicker
        size="sm"
        value={moment(startValue, 'HH:mm')}
        onChange={onStartChange}
        disabled={disabled}
        minutesStep={minutesStep}
      />
      <Typography variant="body1" fontWeight={500}>
        to
      </Typography>
      <StyledTimePicker
        size="sm"
        value={moment(endValue, 'HH:mm')}
        onChange={onEndChange}
        disabled={disabled}
        minutesStep={minutesStep}
      />

      {/* <StyledNativeTimePicker value={startValue} onChange={onStartChange} disabled={disabled} />
      <Typography variant="body1" fontWeight={500}>
        to
      </Typography>
      <StyledNativeTimePicker value={endValue} onChange={onEndChange} disabled={disabled} /> */}
    </Stack>
  );
}
