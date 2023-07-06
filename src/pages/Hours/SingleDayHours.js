import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import TimeRangePicker from './TimeRangePicker';

export default function SingleDayHours({ openingHours = [], onAnyChange, onAddHour, onHourRemove, disabled }) {
  const [, setRender] = useState(false);

  return (
    <Stack gap={3}>
      {openingHours?.map((hour, i) => (
        <Stack direction="row" alignItems="center" gap={5}>
          <TimeRangePicker
            disabled={Boolean(disabled)}
            startValue={hour?.open}
            endValue={hour?.close}
            onStartChange={(e) => {
              hour.open = e.target.value;
              setRender((prev) => !prev);
              onAnyChange();
            }}
            onEndChange={(e) => {
              hour.close = e.target.value;
              setRender((prev) => !prev);
              onAnyChange();
            }}
          />
          {i === 0 ? (
            <Button disableRipple sx={{ '&': { minWidth: '0' } }} onClick={onAddHour} disabled={disabled}>
              <Add />
            </Button>
          ) : (
            <Button
              disabled={disabled}
              color="error"
              disableRipple
              sx={{ '&': { minWidth: '0' } }}
              onClick={() => {
                onHourRemove(i);
              }}
            >
              <DeleteIcon />
            </Button>
          )}
        </Stack>
      ))}
    </Stack>
  );
}
