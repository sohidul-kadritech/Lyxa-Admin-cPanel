import { Box, Button, FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';
import { useState } from 'react';
import FilterDate from '../../components/Filter/FilterDate';
import TimeRangePicker from './TimeRangePicker';

export default function Holiday({ holiday, onDelete, isEndOfList, onAnyChange }) {
  const [render, setRender] = useState(false);

  return (
    <Box pt={6} pb={5} borderBottom={isEndOfList ? undefined : '1px solid #EEEEEE'}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" pb={4}>
        <FilterDate
          value={holiday?.date}
          onChange={(e) => {
            holiday.date = e._d;
            setRender(!render);
            onAnyChange();
          }}
        />
        {!holiday?.isFullDayOff && (
          <TimeRangePicker
            startValue={holiday?.closedStart}
            endValue={holiday?.closedEnd}
            onStartChange={(e) => {
              holiday.closedStart = e.target.value;
              setRender(!render);
              onAnyChange();
            }}
            onEndChange={(e) => {
              holiday.closedEnd = e.target.value;
              setRender(!render);
              onAnyChange();
            }}
          />
        )}
      </Stack>
      <RadioGroup
        row
        value={holiday?.isFullDayOff ? 'day' : 'hours'}
        onChange={(e) => {
          holiday.isFullDayOff = e.target.value === 'day';
          setRender(!render);
          onAnyChange();
        }}
        sx={{
          gap: '28px',
          pb: 1,
        }}
      >
        <FormControlLabel value="day" control={<Radio />} label="All day" />
        <FormControlLabel value="hours" control={<Radio />} label="Edit Hours" />
      </RadioGroup>
      <Button disableRipple variant="text" color="error" onClick={onDelete}>
        Remove
      </Button>
    </Box>
  );
}
