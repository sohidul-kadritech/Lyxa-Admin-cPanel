import { Button, Stack } from '@mui/material';
import moment from 'moment';

export const getFirstMonday = (period) => {
  const currentDate = moment();

  if (period === 'week') {
    currentDate.startOf('isoWeek');
  } else if (period === 'month') {
    const startOfMonth = moment(currentDate).startOf('month');
    const dayOfWeek = startOfMonth.isoWeekday();

    if (dayOfWeek >= 6) {
      // If it's Saturday (6) or Sunday (7)
      startOfMonth.day(8); // Set to the next Monday
    }

    return startOfMonth;
  } else {
    return moment();
  }

  return currentDate;
};

const presets = [
  {
    text: 'Today',
    start: moment(),
    end: moment(),
  },
  {
    text: 'This Week',
    start: getFirstMonday('week'),
    end: moment(),
  },
  {
    text: 'This Month',
    start: getFirstMonday('month'),
    end: moment(),
  },
];

function DatePresets({ startDate, endDate, onChange }) {
  return (
    <Stack direction="row" alignItems="center" gap={3} pl={5} pb={5}>
      {presets.map(({ text, start, end }) => {
        const isChosen =
          moment(start)?.format('YYYY/MM/DD') === moment(startDate)?.format('YYYY/MM/DD') &&
          moment(end)?.format('YYYY/MM/DD') === moment(endDate)?.format('YYYY/MM/DD');

        return (
          <Button
            key={text}
            className={` ${isChosen ? 'active' : ''}`}
            onClick={() => {
              getFirstMonday('month');
              onChange({ startDate: start, endDate: end });
            }}
            variant={isChosen ? 'contained' : 'outlined'}
            size="small"
            sx={{
              fontSize: '12px',
              lineHeight: '1',
              borderRadius: '4px',
              padding: '8px 12px',
            }}
          >
            {text}
          </Button>
        );
      })}
    </Stack>
  );
}
export default DatePresets;
