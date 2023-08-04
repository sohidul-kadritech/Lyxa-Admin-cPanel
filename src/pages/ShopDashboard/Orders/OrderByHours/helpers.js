// thrid party
import { Box, Tooltip, Typography } from '@mui/material';

export const weekdays = {
  1: 'sunday',
  2: 'monday',
  3: 'tuesday',
  4: 'wednesday',
  5: 'thursday',
  6: 'friday',
  7: 'saturday',
};

export const frequencyMap = {
  1: {
    color: '#FEE5D6',
    start: 1,
    end: 8,
  },

  2: {
    color: '#E6B8A2',
    start: 9,
    end: 11,
  },

  3: {
    color: '#CA7F8E',
    start: 12,
    end: 23,
  },

  4: {
    color: '#944A60',
    start: 24,
    end: Infinity,
  },
};

export const createCharData = (data = []) => {
  const hourInit = () => ({ monday: '0', tuesday: '0', wednesday: '0', thursday: '0', friday: '0', sunday: '0' });
  const rows = new Array(24).fill(0).map(() => hourInit());

  data?.forEach((day) => {
    day?.hourlyOrderCounts?.forEach((hour) => {
      if (hour?.hourOfDay !== undefined && day?.dayOfWeek !== undefined) {
        rows[hour.hourOfDay][weekdays[day.dayOfWeek]] = hour?.avgOrderCount || 0;
      }
    });
  });

  return rows;
};

export const getIndicatorStyle = (row, weekDayNum) => {
  let color = '#EEEEEE';
  const orderCount = row[weekdays[weekDayNum]];

  if (orderCount >= frequencyMap[1].start && orderCount <= frequencyMap[1].end) color = frequencyMap[1].color;
  if (orderCount >= frequencyMap[2].start && orderCount <= frequencyMap[2].end) color = frequencyMap[2].color;
  if (orderCount >= frequencyMap[3].start && orderCount <= frequencyMap[3].end) color = frequencyMap[3].color;
  if (orderCount >= frequencyMap[4].start && orderCount <= frequencyMap[4].end) color = frequencyMap[4].color;

  return {
    height: '12px',
    background: color,
    transition: '100ms ease',

    '&:hover': {
      boxShadow: '-1px 6px 8px 0px rgba(0,0,0,0.05)',
      WebkitBoxShadow: '-1px 6px 8px 0px rgba(0,0,0,0.05)',
      MozBoxShadow: '-1px 6px 8px 0px rgba(0,0,0,0.05)',
    },
  };
};

export function CustomTooltip({ weekdayNum, hour, orders }) {
  return (
    <Box sx={{ width: '150px' }}>
      <Typography variant="body4" fontSize={12} lineHeight="20px" textTransform="capitalize">
        {weekdays[weekdayNum]} {hour % 12} {hour < 12 ? 'am' : 'pm'} - {(hour % 12) + 1} {hour < 12 ? 'am' : 'pm'}
      </Typography>
      <Typography
        variant="body4"
        fontSize={12}
        lineHeight="20px"
        fontWeight={400}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <span>Orders</span>
        <span>{orders}</span>
      </Typography>
    </Box>
  );
}

export function HourItem({ row, weekdayNum, hour }) {
  return (
    <Tooltip arrow title={<CustomTooltip orders={row[weekdays[weekdayNum]]} weekdayNum={weekdayNum} hour={hour} />}>
      <Box sx={getIndicatorStyle(row, weekdayNum)}></Box>
    </Tooltip>
  );
}
