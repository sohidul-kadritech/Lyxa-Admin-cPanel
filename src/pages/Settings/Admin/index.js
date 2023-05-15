// thrid pary
import { Box } from '@mui/material';
import PageList from '../../../components/Common/PageList';
import PageTop from '../../../components/Common/PageTop';

const pagesList = [
  {
    label: 'Marketing',
    to: '/admin/settings2/marketing',
  },
  {
    label: 'Users',
    to: '/admin/settings2/users',
  },
  {
    label: 'Invoices',
    to: '#',
  },
  {
    label: 'Coupons',
    to: '/admin/settings2/marketing/coupons',
  },
  {
    label: 'Zones',
    to: '#',
  },
  {
    label: 'Units',
    to: '/products/unit-types',
  },
  {
    label: 'Products *',
    to: '/products/list',
  },
  {
    label: 'Notifications',
    to: '/admin/notifications/list',
  },
  {
    label: 'Support',
    to: '/settings/support-reasons',
  },
  {
    label: 'App Configuration',
    to: '/app/settings',
  },
  {
    label: 'Percentages',
    to: '/percentage-setting',
  },
  {
    label: 'Cancellation Reasons',
    to: '/settings/support-reasons',
  },
  {
    label: 'Rating',
    to: '/settings/ratings',
  },
  {
    label: 'Database Collection',
    to: '/admin/database/collections',
  },
  {
    label: 'Admin Log',
    to: '/add-wallet/admin-log-history',
  },
  {
    label: 'Privacy',
    to: '#',
  },
  {
    label: 'FAQ',
    to: '/settings/support-reasons',
  },
  {
    label: 'Terms & Conditions',
    to: '/terms-and-conditions/user-app',
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
