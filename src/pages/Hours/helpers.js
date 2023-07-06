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

export const validateSettings = (setttings) => {
  const error = {
    status: false,
    message: '',
  };

  const holidayDateMap = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const holiday of setttings.holidayHours) {
    if (holidayDateMap[holiday.date]) {
      error.message = 'Can not have multiple holidays on same day.';
      return error;
    }
    holidayDateMap[holiday.date] = true;
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
