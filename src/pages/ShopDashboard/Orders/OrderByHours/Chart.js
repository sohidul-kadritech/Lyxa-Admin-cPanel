// thrid party
import { Box, Stack, Typography } from '@mui/material';

const weekdays = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};

export default function OrderByHoursChart({ hourlyOrders }) {
  console.log(hourlyOrders);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          '& > *': {
            flex: 1,
          },
        }}
      >
        <span style={{ flexBasis: '28px', width: '28px', display: 'inline-block' }}></span>
        {Object.entries(weekdays).map((item) => (
          <Typography key={item[0]} variant="body4" fontSize="13px" lineHeight="24px">
            {item[1]}
          </Typography>
        ))}
      </Stack>
      <Stack direction="row" alignItems="center"></Stack>
    </Box>
  );
}
