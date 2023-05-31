import { Box, Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material';
import DateRange from './DateRange';
import StyledBox from './StyledBox';

export default function ChartBox({ dateRange, setDateRange, title, chartHeight, children, loading, ...props }) {
  // console.log({ dateRange });

  return (
    <Grid {...props}>
      <StyledBox padding loading={loading}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
          <Typography variant="body1" fontWeight={600}>
            {title}
          </Typography>
          <DateRange range={dateRange} setRange={setDateRange} />
        </Stack>
        <Box
          sx={{
            height: `${chartHeight}px`,
          }}
        >
          {children}
        </Box>
      </StyledBox>
    </Grid>
  );
}
