import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, useTheme } from '@mui/material';
import moment from 'moment';

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

// export function DateRange({ range, setRange }) {
//   return (
//     <Stack direction="row" alignItems="center" gap={2}>
//       <FilterDate
//         value={range?.start}
//         tooltip="Start Date"
//         size="sm"
//         onChange={(e) => {
//           setRange((prev) => ({ ...prev, start: e._d }));
//         }}
//       />
//       <FilterDate
//         value={range?.end}
//         tooltip="End Date"
//         size="sm"
//         onChange={(e) => {
//           setRange((prev) => ({ ...prev, end: e._d }));
//         }}
//       />
//     </Stack>
//   );
// }

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

// export function InfoBox({ value, title, Tag, ...props }) {
//   return (
//     <Grid {...props}>
//       <StyledBox>
//         <InfoCard title={title} value={value} Tag={Tag} />
//       </StyledBox>
//     </Grid>
//   );
// }
