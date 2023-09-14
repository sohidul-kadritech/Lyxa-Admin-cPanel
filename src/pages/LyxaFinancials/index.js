import { Box } from '@mui/material';
import PageList from '../../components/Common/PageList';
import PageTop from '../../components/Common/PageTop';

const pagesList = [
  {
    label: 'Summary',
    to: '/financials/lyxa/summary',
  },
  {
    label: 'Resturant',
    to: '/financials/lyxa/food',
  },
  {
    label: 'Grocery',
    to: '/financials/lyxa/grocery',
  },
  {
    label: 'Pharmacy',
    to: '/financials/lyxa/pharmacy',
  },
  {
    label: 'Butler',
    to: '/financials/lyxa/butler',
  },
  {
    label: 'Payouts',
    to: '/financials/lyxa/payouts',
  },
];

export default function LyxaFinancials() {
  return (
    <Box pb={10}>
      <PageTop title="Lyxa Financials" backButtonLabel="Back to Financials" backTo="/financials" />
      <PageList items={pagesList} />
    </Box>
  );
}
