// thrid pary
import { Box } from '@mui/material';
import PageList from '../../components/Common/PageList';
import PageTop from '../../components/Common/PageTop';

const pagesList = [
  // {
  //   label: 'For Sellers',
  //   to: '/add-wallet/seller-transactions',
  // },
  {
    label: 'For Sellers',
    to: '/add-wallet/seller-transactions2',
  },
  // {
  //   label: 'For Account (Lyxa Pay)',
  //   to: '/lyxa-pay',
  // },
  {
    label: 'For Account (Lyxa Pay)',
    to: '/lyxa-pay2',
  },
  // {
  //   label: 'For Riders',
  //   to: '/add-wallet/delivery-transactions',
  // },
  {
    label: 'For Riders',
    to: '/add-wallet/delivery-transactions2',
  },
  {
    label: 'For VAT',
    to: '/vat',
  },
];

export default function AdminFinancials() {
  return (
    <Box pb={10}>
      <PageTop title="Financials" />
      <PageList items={pagesList} />
    </Box>
  );
}
