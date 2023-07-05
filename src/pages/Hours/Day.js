import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import StyledCheckbox from '../../components/Styled/StyledCheckbox';
import SingleDayHours from './SingleDayHours';
import { getNormalHourInit } from './helpers';

export default function Day({ day, onAnyChange }) {
  const [render, setRender] = useState(false);

  const onAddHour = () => {
    day?.openingHours?.push(getNormalHourInit());
    setRender(!render);
  };

  const onHourRemove = (index) => {
    day?.openingHours?.splice(index, 1);
    setRender(!render);
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
              day.isFullDayOpen = !day.isActive ? false : day.isFullDayOpen;
              setRender(!render);
              onAnyChange();
            }}
          />
        </Stack>
        <Stack direction="row" alignItems="center" pl="100px">
          <Typography variant="body4" color="initial">
            24h
          </Typography>
          <StyledCheckbox
            checked={day?.isFullDayOpen}
            onChange={() => {
              day.isFullDayOpen = !day.isFullDayOpen;
              day.isActive = day.isFullDayOpen ? true : day.isActive;
              setRender(!render);
              onAnyChange();
            }}
          />
        </Stack>
      </Stack>
      <SingleDayHours
        disabled={!day?.isActive}
        onAddHour={onAddHour}
        onAnyChange={onAnyChange}
        openingHours={day?.openingHours}
        onHourRemove={onHourRemove}
      />
    </Stack>
  );
}
