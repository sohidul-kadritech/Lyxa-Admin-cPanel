/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import StyledBox from './StyledBox';

const getDurationObject = (duration) => {
  const now = moment();
  const startTime = moment(duration?.start);
  const endTime = moment(duration?.end);
  endTime.add(1, 'day');

  // console.log(endTime, startTime, now);

  // If start and end dates are the same, set the end time to 24 hours from now
  // if (endTime.isSame(startTime)) {
  //   endTime.add(1, 'day');
  // }

  const timeDifference = endTime.diff(now);

  if (timeDifference <= 0) {
    // Timer has expired
    return {
      days: '00',
      hours: '00',
      min: '00',
      seconds: '00',
    };
  }

  const durationObject = moment.duration(timeDifference);

  return {
    days: durationObject.days().toString().padStart(2, '0'),
    hours: durationObject.hours().toString().padStart(2, '0'),
    min: durationObject.minutes().toString().padStart(2, '0'),
    seconds: durationObject.seconds().toString().padStart(2, '0'),
  };
};

// const getDurationObject = (duration) => {
//   const now = new Date();
//   const startTime = new Date(duration?.start);
//   let endTime = new Date(duration?.end);

//   console.log(endTime, startTime, now);

//   endTime = endTime?.setDate(endTime.getDate() + 1);

//   // If start and end dates are the same, set the end time to 24 hours from now
//   // if (endTime.getTime() === startTime.getTime()) {
//   //   endTime.setDate(startTime.getDate() + 1);
//   // }

//   const timeDifference = endTime - now;

//   if (timeDifference <= 0) {
//     // Timer has expired
//     return {
//       days: '00',
//       hours: '00',
//       min: '00',
//       seconds: '00',
//     };
//   }

//   const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//   const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
//   const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

//   return {
//     days: days.toString().padStart(2, '0'),
//     hours: hours.toString().padStart(2, '0'),
//     min: minutes.toString().padStart(2, '0'),
//     seconds: seconds.toString().padStart(2, '0'),
//   };
// };

function TimeBox({ time, label, theme }) {
  return (
    <Stack direction="row" alignItems="center" gap={2.5}>
      <Stack
        sx={{
          background: '#fff',
          borderRadius: '7px',
          border: `1px solid ${theme.palette.custom.border}`,
          padding: '16px',
          maxWidth: '70px',
          maxHeight: '70px',
          minWidth: '70px',
          minHeight: '70px',
          cursor: 'pointer',
        }}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h3">{time}</Typography>
      </Stack>

      <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
        {label}
      </Typography>
    </Stack>
  );
}

function MarketingDuration({ duration = { start: new Date(), end: new Date() } }) {
  const theme = useTheme();

  const [remainingTime, setRemainingTime] = useState(getDurationObject(duration));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(getDurationObject(duration));
    }, 1000);

    if (
      Number(remainingTime?.days) === 0 &&
      Number(remainingTime?.hours) === 0 &&
      Number(remainingTime?.min) === 0 &&
      Number(remainingTime?.seconds) === 0
    ) {
      console.log('stop counting');
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [duration]);

  return (
    <StyledBox sx={{}} padding>
      <Stack gap={2.5}>
        <Typography variant="h4">Marketing Duration</Typography>
        <Stack direction="row" gap={4}>
          <TimeBox time={remainingTime?.days} label="days" theme={theme} />
          <TimeBox time={remainingTime?.hours} label="hours" theme={theme} />
          <TimeBox time={remainingTime?.min} label="minutes" theme={theme} />
          <TimeBox time={remainingTime?.seconds} label="seconds" theme={theme} />
        </Stack>
      </Stack>
    </StyledBox>
  );
}

export default MarketingDuration;
