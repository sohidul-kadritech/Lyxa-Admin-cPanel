// thrid party
import { Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { HourItem, createCharData, frequencyMap, weekdays } from './helpers';

export default function OrderByHoursChart({ hourlyOrders }) {
  const rows = useMemo(() => createCharData(hourlyOrders), [hourlyOrders]);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        pb={4}
        gap="50px"
        sx={{
          '& > *:not(:first-child)': {
            flex: 1,
          },

          '& > *:first-child': {
            width: '20px',
          },
        }}
      >
        <span></span>
        {Object.entries(weekdays).map((item) => (
          <Box textAlign="center">
            <Typography key={item[0]} variant="body4" fontSize="13px" lineHeight="24px" textTransform="capitalize">
              {item[1]}
            </Typography>
          </Box>
        ))}
      </Stack>
      <Stack gap="12px">
        {rows.map((row, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            gap="50px"
            sx={{
              '& > *:not(:first-child)': {
                flex: 1,
              },

              '& > *:first-child': {
                width: '20px',
              },
            }}
          >
            <Box
              sx={{
                fontSize: '13px',
                lineHeight: 1,
                fontWeight: '600',
              }}
            >
              {index + 1}
            </Box>
            <HourItem row={row} weekdayNum={1} hour={index} />
            <HourItem row={row} weekdayNum={2} hour={index} />
            <HourItem row={row} weekdayNum={3} hour={index} />
            <HourItem row={row} weekdayNum={4} hour={index} />
            <HourItem row={row} weekdayNum={5} hour={index} />
            <HourItem row={row} weekdayNum={6} hour={index} />
            <HourItem row={row} weekdayNum={7} hour={index} />
          </Stack>
        ))}
      </Stack>
      <Stack direction="row" alignItems="center" gap={2.5} pt={10}>
        {Object.values(frequencyMap).map((range, index) => (
          <Box key={index}>
            <Box sx={{ width: '75px', height: '12px', background: range.color }}></Box>
            <Typography variant="body4" fontSize={13} lineHeight="24px" fontWeight={600}>
              {range.start}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
