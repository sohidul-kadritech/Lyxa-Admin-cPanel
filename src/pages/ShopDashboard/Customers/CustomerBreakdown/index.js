// third party
import { Box, Unstable_Grid2 as Grid, Stack, Typography, useTheme } from '@mui/material';
import StyledBox from '../../../../components/StyledCharts/StyledBox';

// project import
import { ReactComponent as StarIcon } from '../../../../assets/icons/star.svg';
import StyledDoughnutChart from '../../../../components/StyledCharts/StyledPieChart';
import { data } from './mock';

function Item({ amount, title }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
      }}
    >
      <Typography variant="inherit" fontSize={30} fontWeight={600} lineHeight={1} pb={1}>
        {amount}
      </Typography>
      <Typography variant="body1" color={theme.palette.text.secondary2} fontWeight={600}>
        {title}
      </Typography>
    </Box>
  );
}

export default function CustomerBreakdown({ title }) {
  const theme = useTheme();

  return (
    <StyledBox
      padding
      sx={{
        height: '100%',
      }}
    >
      <Typography variant="body1" fontWeight={600} pb={1}>
        {title}
      </Typography>
      <Typography variant="body4" pb={4} color={theme.palette.text.secondary2}>
        Customers who ordered: Last 90 days
      </Typography>
      <Typography variant="body1" lineHeight="19px" fontWeight={600} color={theme.palette.success.main}>
        <StarIcon /> 4.7
      </Typography>
      <Grid container mt={15}>
        <Grid xs={12} lg={6}>
          <Box sx={{ width: 260, height: 260, position: 'relative' }}>
            <StyledDoughnutChart data={data} />
            {/* middle */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                minWidth: '150px',
              }}
            >
              <Typography variant="inherit" fontSize={30} fontWeight={600} lineHeight={1} pb={2}>
                46%
              </Typography>
              <Typography variant="body1" fontWeight={600} color={theme.palette.text.secondary2}>
                of customer base
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid xs={12} lg={6}>
          <Stack direction="row" height="100%" alignItems="center" gap={16.5}>
            <Stack gap={15}>
              <Item amount="$255" title="Sales" />
              <Item amount="6%" title="Percent of sales" />
            </Stack>
            <Stack gap={15}>
              <Item amount="25" title="Orders" />
              <Item amount="$10" title="Avg. orders" />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </StyledBox>
  );
}
