// thrid pary
import { Box } from '@mui/material';
import PageList from '../../../components/Common/PageList';
import PageTop from '../../../components/Common/PageTop';

const pagesList = [
  {
    label: 'Marketing',
    to: 'settings/marketing',
  },
  {
    label: 'Zones',
    to: '/settings/zone',
  },
  {
    label: 'Products',
    to: '/settings/products/list',
  },
  {
    label: 'Categories List',
    to: '#',
  },
  {
    label: 'Chat',
    to: '#',
  },
  {
    label: 'Rating',
    to: '/settings/ratings',
  },
  {
    label: 'Support Reasons',
    to: '/settings/support-reasons',
  },
  {
    label: 'Cancel Order Reasons',
    to: '/settings/cancel-reason',
  },
  // {
  //   label: 'Invoices',
  //   to: '#',
  // },
  // {
  //   label: 'Units',
  //   to: '/products/unit-types',
  // },
  {
    label: 'Products *',
    to: '/products/list',
  },
  {
    label: 'Notifications',
    to: '/settings/notifications',
  },
  {
    label: 'Invoice Configuration',
    to: '#',
  },
  {
    label: 'Percentages',
    to: '/percentage-setting',
  },
  {
    label: 'App Settings',
    to: '/settings/app-settings',
  },
  {
    label: 'Admin Log',
    to: '/add-wallet/admin-log-history',
  },
  {
    label: 'Database Collection',
    to: '/admin/database/collections',
  },
  {
    label: 'Privacy',
    to: '#',
  },
  {
    label: 'Terms & Conditions',
    to: '/terms-and-conditions2',
  },
];

export default function AdminSettings() {
  return (
    <Box pb={10}>
      <PageTop title="Settings" subtitle="Customize admin settings" />
      <PageList items={pagesList} />
    </Box>
  );
}
