import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { StyledOrderDetailBox } from '../helpers';

function getTimeLeftUntil(targetTimeString) {
  const targetTime = new Date(targetTimeString);
  const currentTime = new Date();

  if (Number.isNaN(targetTime)) {
    return 'Invalid time format';
  }

  const timeDiff = targetTime - currentTime;

  if (timeDiff <= 0) {
    return 'Order has been placed';
  }

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  const formattedTime = `${hours?.toString()?.padStart(2, '0')}:${minutes?.toString()?.padStart(2, '0')}:${seconds
    ?.toString()
    ?.padStart(2, '0')}`;

  return formattedTime;
}

export default function OrderScheduleTimer({ order }) {
  const [, setRender] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRender((prev) => !prev);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <StyledOrderDetailBox title="Time Remaining">
      <Typography variant="body2" color="textPrimary" lineHeight="22px">
        {getTimeLeftUntil(order?.scheduleDate)}
      </Typography>
    </StyledOrderDetailBox>
  );
}
