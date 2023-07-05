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
  closedStart: moment().startOf('day').add(10, 'h'),
  closedEnd: moment().startOf('day').add(14, 'h'),
};

export const getNormalHourInit = () => ({
  open: moment(),
  close: moment().add(1, 'hour'),
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
