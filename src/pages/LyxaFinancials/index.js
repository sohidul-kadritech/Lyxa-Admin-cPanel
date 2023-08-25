import { Box } from '@mui/material';
import PageList from '../../components/Common/PageList';
import PageTop from '../../components/Common/PageTop';

const pagesList = [
  {
    label: 'For Resturant',
    to: '/financials/lyxa/food',
  },
  {
    label: 'For Grocery',
    to: '/financials/lyxa/grocery',
  },
  {
    label: 'For Pharmacy',
    to: '/financials/lyxa/pharmacy',
  },
  {
    label: 'For Butler',
    to: '/financials/lyxa/butler',
  },
];

export default function LyxaFinancials() {
  return (
    <Box pb={10}>
      <PageTop title="Financials" />
      <PageList items={pagesList} />
    </Box>
  );
}
