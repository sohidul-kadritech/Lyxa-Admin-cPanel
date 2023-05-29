// thrid party
import { Box } from '@mui/material';
import PageList from '../../../../components/Common/PageList';
import PageTop from '../../../../components/Common/PageTop';

const pagesList = [
  {
    label: 'Loyalty',
    to: '/settings/marketing/loyalty',
  },
  {
    label: 'Deals',
    to: '/settings/marketing/deals',
  },
  {
    label: 'Featured',
    to: '/settings/marketing/featured',
  },
  {
    label: 'Coupons',
    to: '/settings/marketing/coupons',
  },
];

export default function AdminMarketingSettings() {
  return (
    <Box>
      <PageTop
        title="Settings"
        subtitle="Customize admin settings"
        backButtonLabel="Back to Settings"
        backTo="/settings"
      />
      <PageList items={pagesList} />
    </Box>
  );
}
