/* eslint-disable no-unsafe-optional-chaining */
// third party
import { Box, Unstable_Grid2 as Grid, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { useGlobalContext } from '../../../../context';
import StyledBox from '../../../StyledCharts/StyledBox';
import StyledDoughnutChart from '../../../StyledCharts/StyledPieChart';

export function calculateDateDifference(date1, date2, unit) {
  const momentDate1 = moment(date1);
  const momentDate2 = moment(date2);
  const difference = momentDate2.diff(momentDate1, unit);
  return difference;
}

const customerTypeProps = {
  total: {
    graphTooltip: 'Total Customers',
    customers: 'totalCustomers',
    sales: 'totalCustomersSales',
    orders: 'totalCustomersOrders',
    percent: 'totalCustomersPercentOfSales',
    average: 'totalCustomersAvgOrders',
  },
  new: {
    graphTooltip: 'New Customers',
    customers: 'newCustomers',
    sales: 'newCustomersSales',
    orders: 'newCustomersOrders',
    percent: 'newCustomersPercentOfSales',
    average: 'newCustomersAvgOrders',
  },
  repeated: {
    graphTooltip: 'Repeated Customers',
    customers: 'repeatedCustomers',
    sales: 'repeatedCustomersSales',
    orders: 'repeatedCustomersOrders',
    percent: 'repeatedCustomersPercentOfSales',
    average: 'repeatedCustomersAvgOrders',
  },
  lapsed: {
    graphTooltip: 'Lapsed Customers',
    customers: 'lapsedCustomers',
    sales: 'lapsedCustomersSales',
    orders: 'lapsedCustomersOrders',
    percent: 'lapsedCustomersPercentOfSales',
    average: 'lapsedCustomersAvgOrders',
  },
};

function AmountItem({ amount, title }) {
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

export default function CustomerBreakdown({ title, customerType, range, details = {} }) {
  const theme = useTheme();
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const sales = customerTypeProps[customerType]?.sales || '';
  const orders = customerTypeProps[customerType]?.orders || '';
  const percent = customerTypeProps[customerType]?.percent || '';
  const average = customerTypeProps[customerType]?.average || '';
  const amount = customerTypeProps[customerType]?.customers || '';

  const data = {
    labels:
      customerType === 'total'
        ? ['Total Customers']
        : ['Total Customers', customerTypeProps[customerType].graphTooltip],
    datasets: [
      {
        label: '% of Customers',
        data:
          customerType === 'total'
            ? [details?.totalCustomers || 0]
            : [details?.totalCustomers - details[amount] || 0, details[amount] || 0],
        backgroundColor: ['rgba(80, 205, 137, 1)', 'rgba(255, 140, 81, 0.2)', 'rgba(137, 80, 252, 0.2)'],
        borderWidth: 0,
      },
    ],
  };

  console.log('order', details);

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
        Customers who ordered: Last {calculateDateDifference(range.startDate, range.endDate, 'day')} days
      </Typography>
      <Grid container mt={15}>
        <Grid xs={12} lg={6}>
          <Stack direction="row" height="100%" alignItems="center" justifyContent="center">
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
                  {(details[amount] / details?.totalCustomers) * 100 || 0}%
                </Typography>
                <Typography variant="body1" fontWeight={600} color={theme.palette.text.secondary2}>
                  of customer base
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Grid>
        <Grid xs={12} lg={6}>
          <Stack direction="row" height="100%" alignItems="center" gap={16.5}>
            <Stack gap={15}>
              <AmountItem amount={`${currency} ${details[sales] || 0}`} title="Sales" />
              <AmountItem amount={details[percent] || 0} title="Percent of sales" />
            </Stack>
            <Stack gap={15}>
              <AmountItem amount={details[orders] || 0} title="Orders" />
              <AmountItem amount={details[average] || 0} title="Avg. orders value" />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </StyledBox>
  );
}
