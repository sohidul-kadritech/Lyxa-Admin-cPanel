import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import StyledCheckbox from '../../components/Styled/StyledCheckbox';
import SingleDayHours from './SingleDayHours';
import { getNormalHourInit, parseTimeInMinutes } from './helpers';

export default function Day({ day, onAnyChange }) {
  const [render, setRender] = useState(false);

  const onAddHour = () => {
    day?.openingHours?.push(getNormalHourInit());
    setRender(!render);
    onAnyChange();
  };

  const onHourRemove = (index) => {
    day?.openingHours?.splice(index, 1);
    setRender(!render);
    onAnyChange();
  };

  const sortHours = () => {
    day?.openingHours?.sort((a, b) => parseTimeInMinutes(a.open) - parseTimeInMinutes(b.open));
  };

  const onFullDaySelect = () => {
    day.isFullDayOpen = !day.isFullDayOpen;
    day.isActive = day.isFullDayOpen ? true : day.isActive;

    if (day.isFullDayOpen) {
      const h = day?.openingHours?.[0] || {};
      h.open = '00:00';
      h.close = '23:59';
      day?.openingHours?.splice(1);
    }
    sortHours();
    setRender(!render);
    onAnyChange();
  };

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      sx={{
        borderBottom: '1px solid #eee',
        py: 4,
      }}
    >
      <Stack direction="row">
        <Typography variant="body1" fontWeight={500} paddingTop="10px" width="170px">
          {day?.day}
        </Typography>
        <Stack direction="row" alignItems="center">
          <Typography variant="body4" color="initial">
            Closed
          </Typography>
          <StyledCheckbox
            checked={!day?.isActive}
            onChange={() => {
              day.isActive = !day.isActive;
              day.isFullDayOpen = day.isActive ? day.isFullDayOpen : false;
              setRender(!render);
              onAnyChange();
            }}
          />
        </Stack>
        <Stack direction="row" alignItems="center" pl="100px">
          <Typography variant="body4" color="initial">
            24h
          </Typography>
          <StyledCheckbox checked={day?.isFullDayOpen} onChange={onFullDaySelect} />
        </Stack>
      </Stack>
      <SingleDayHours
        disabled={!day?.isActive || day?.isFullDayOpen}
        onAddHour={onAddHour}
        onAnyChange={onAnyChange}
        openingHours={day?.openingHours}
        onHourRemove={onHourRemove}
        sortHours={sortHours}
      />
    </Stack>
  );
}
