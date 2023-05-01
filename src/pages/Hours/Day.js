import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import StyledSwitch from '../../components/Styled/StyledSwitch';
import TimeRangePicker from './TimeRangePicker';

export default function Day({ day, onAnyChange }) {
  const [render, setRender] = useState(false);

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="body1" fontWeight={500}>
        {day?.day}
      </Typography>
      <Stack direction="row" alignItems="center" gap={7.5}>
        <StyledSwitch
          color="primary"
          checked={day?.isActive}
          onChange={() => {
            day.isActive = !day.isActive;
            setRender(!render);
            onAnyChange();
          }}
        />
        <Box></Box>
        <TimeRangePicker
          startValue={day?.open}
          endValue={day?.closed}
          onStartChange={(v) => {
            day.open = v;
            setRender(!render);
            onAnyChange();
          }}
          onEndChange={(v) => {
            day.closed = v;
            setRender(!render);
            onAnyChange();
          }}
        />
      </Stack>
    </Stack>
  );
}
