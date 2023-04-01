import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Unstable_Grid2 as Grid, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import LoadingOverlay from '../../../components/Common/LoadingOverlay';
import FilterDate from '../../../components/Filter/FilterDate';
import InfoCard from './InfoCard';

// third party

export const breadCrumbItems = [
  {
    label: 'Marketing',
    to: '/marketing',
  },
  {
    label: ' Loyalty Points',
    to: '/unknown',
  },
];

export const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

export const gData = (items, getData, getLabel) => {
  const labels = [];
  const data = [];

  items.forEach((item) => {
    // labels.push();
    labels.push(getLabel(item));
    data.push(getData(item));
  });

  return { labels, data };
};

export function StyledBox({ children, loading, padding }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: '#fff',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
        position: 'relative',
        overflow: 'hidden',
        padding: padding ? '18px 18px 23px 20px' : '0px',
      }}
    >
      {loading && <LoadingOverlay />}
      {children}
    </Box>
  );
}

export function DateRange({ range, setRange }) {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <FilterDate
        value={range?.start}
        tooltip="Start Date"
        size="sm"
        onChange={(e) => {
          setRange((prev) => ({ ...prev, start: e._d }));
        }}
      />
      <FilterDate
        value={range?.end}
        tooltip="End Date"
        size="sm"
        onChange={(e) => {
          setRange((prev) => ({ ...prev, end: e._d }));
        }}
      />
    </Stack>
  );
}

export function ChartBox({ dateRange, setDateRange, title, chartHeight, children, loading, ...props }) {
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

// project import
export function IncreaseDecreaseTag({ status, amount }) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        color: status === 'increase' ? theme.palette.success.main : theme.palette.primary.main,
        marginBottom: '-5px',
        paddingLeft: 1,
      }}
    >
      {status === 'increase' ? (
        <ArrowDropUpIcon
          sx={{
            fontSize: '35px',
          }}
        />
      ) : (
        <ArrowDropDownIcon
          sx={{
            fontSize: '35px',
          }}
        />
      )}
      <Typography
        variant="body1"
        sx={{
          fontSize: '12px',
          lineHeight: '24px',
          fontWeight: '600',
        }}
      >
        {amount} last 30 days
      </Typography>
    </Stack>
  );
}

export function ViewMoreTag() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: '1',
        textAlign: 'right',
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        startIcon={<VisibilityIcon />}
        sx={{
          fontWeight: '500',
          fontSize: '12px',
          lineHeight: '1',
          background: theme.palette.background.secondary,
          color: theme.palette.secondary.main,
          padding: '8px 17.5px',

          '&:hover': {
            color: theme.palette.secondary.main,
            background: theme.palette.background.secondaryHover,
          },
        }}
      >
        View details
      </Button>
    </Box>
  );
}

export function InfoBox({ value, title, Tag, ...props }) {
  return (
    <Grid {...props}>
      <StyledBox>
        <InfoCard title={title} value={value} Tag={Tag} />
      </StyledBox>
    </Grid>
  );
}
