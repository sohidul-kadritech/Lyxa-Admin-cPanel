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
    to: '/settings/products',
  },
  {
    label: 'Categories List',
    to: '/settings/categories/list',
  },
  {
    label: 'Chat',
    to: '/customer-support',
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
    to: '/privacy',
  },
  {
    label: 'Terms & Conditions',
    to: '/terms-and-conditions',
  },
  {
    label: 'Refer A Friend',
    to: '/settings/refer-friend',
  },
  {
    label: 'Request New Area',
    to: '/admin/requested-area',
  },
  {
    label: 'Transaction',
    to: '/admin/transactions',
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
