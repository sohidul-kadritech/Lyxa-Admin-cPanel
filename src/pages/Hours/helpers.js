import { Box, Stack, Typography, styled } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import StyledSwitch from '../../components/Styled/StyledSwitch';
import StyledTimePicker from '../../components/Styled/StyledTimePicker';

export function DaySettings({ day }) {
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
          }}
        />
        <Box></Box>
        <StyledTimePicker
          size="sm"
          value={day?.open}
          onChange={(v) => {
            day.open = v;
            setRender(!render);
          }}
        />
        <Typography variant="body1" fontWeight={500}>
          to
        </Typography>
        <StyledTimePicker
          size="sm"
          value={day?.closed}
          onChange={(v) => {
            day.open = v;
            setRender(!render);
          }}
        />
      </Stack>
    </Stack>
  );
}

export const StyledBox = styled(Box)(() => ({
  background: '#fff',
  borderRadius: '8px',
  padding: '25px 30px',
}));

export const holidayHourInit = {
  date: moment(),
  isFullDayOff: false,
  closedStart: moment().startOf('day'),
  closedEnd: moment().endOf('day'),
};
