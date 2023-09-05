import { Box } from '@mui/material';
import PageList from '../../components/Common/PageList';
import PageTop from '../../components/Common/PageTop';

const pagesList = [
  {
    label: 'For Lyxa',
    to: '/financials/lyxa',
  },
  {
    label: 'For Sellers',
    to: '/app-wallet/seller-transactions',
  },
  {
    label: 'For Account (Lyxa Pay)',
    to: '/lyxa-pay',
  },
  {
    label: 'For Riders',
    to: '/app-wallet/delivery-transactions',
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
