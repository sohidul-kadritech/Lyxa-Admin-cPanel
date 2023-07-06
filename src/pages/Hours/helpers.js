/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { Box, styled } from '@mui/material';
import moment from 'moment';

export const StyledBox = styled(Box)(() => ({
  background: '#fff',
  borderRadius: '8px',
  padding: '25px 30px',
}));

export const holidayHourInit = {
  date: moment().add(1, 'd'),
  isFullDayOff: false,
  closedStart: '12:00',
  closedEnd: '23:00',
};

export const getNormalHourInit = () => ({
  open: '01:00',
  close: '01:01',
});

export const createMomentTimeFormat = (time = '') => moment(time, 'HH:mm');
export const createStringTimeFormat = (timeObj) => timeObj.format('HH:mm');

const parseTimeInMinutes = (t = '') => {
  const [h, m] = t.split(':');
  return parseInt(h, 10) * 60 + parseInt(m, 10);
};

export const validateSettings = (data) => {
  const error = {
    status: false,
    message: '',
  };

  const holidayDateMap = {};

  for (const holiday of data.holidayHours) {
    if (holidayDateMap[holiday.date]) {
      error.message = 'Can not have multiple holidays on same day.';
      return error;
    }
    holidayDateMap[holiday.date] = true;
  }

  for (const normalDay of data.normalHours) {
    for (const normalDay1 of normalDay.openingHours) {
      const o1 = parseTimeInMinutes(normalDay1?.open);
      const c1 = parseTimeInMinutes(normalDay1?.close);

      if (c1 <= o1) {
        error.message = 'Normal hours open can not be after or equal to close';
        return error;
      }

      for (const normalDay2 of normalDay.openingHours) {
        if (normalDay1 === normalDay2) continue;

        const o2 = parseTimeInMinutes(normalDay2?.open);
        const c2 = parseTimeInMinutes(normalDay2?.close);

        if (o2 >= o1 && c2 <= c1) {
          error.message = 'Normal hours can not overlap.';
          return error;
        }
      }
    }
  }

  return {
    status: true,
  };
};

export const defaultShopNormalHours = [
  {
    day: 'Monday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: false,
  },
  {
    day: 'Tuesday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: false,
  },
  {
    day: 'Wednesday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: false,
  },
  {
    day: 'Thursday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: false,
  },
  {
    day: 'Friday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: false,
  },
  {
    day: 'Saturday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: false,
  },
  {
    day: 'Sunday',
    openingHours: [
      {
        open: '12:00',
        close: '23:00',
      },
    ],
    isFullDayOpen: false,
    isActive: false,
  },
];

// export const defaultShopNormalHours = [
//   {
//     day: 'Monday',
//     openingHours: [
//       {
//         open: '11:00',
//         close: '23:00',
//       },
//     ],
//     isFullDayOpen: false,
//     isActive: true,
//   },
//   {
//     day: 'Tuesday',
//     openingHours: [
//       {
//         open: '11:00',
//         close: '23:00',
//       },
//     ],
//     isFullDayOpen: false,
//     isActive: true,
//   },
//   {
//     day: 'Wednesday',
//     openingHours: [
//       {
//         open: '11:00',
//         close: '23:00',
//       },
//     ],
//     isFullDayOpen: false,
//     isActive: true,
//   },
//   {
//     day: 'Thursday',
//     openingHours: [
//       {
//         open: '11:00',
//         close: '23:00',
//       },
//     ],
//     isFullDayOpen: false,
//     isActive: true,
//   },
//   {
//     day: 'Friday',
//     openingHours: [
//       {
//         open: '11:00',
//         close: '23:00',
//       },
//     ],
//     isFullDayOpen: false,
//     isActive: true,
//   },
//   {
//     day: 'Saturday',
//     openingHours: [
//       {
//         open: '11:00',
//         close: '23:00',
//       },
//     ],
//     isFullDayOpen: false,
//     isActive: true,
//   },
//   {
//     day: 'Sunday',
//     openingHours: [
//       {
//         open: '11:00',
//         close: '23:00',
//       },
//     ],
//     isFullDayOpen: false,
//     isActive: true,
//   },
// ];
