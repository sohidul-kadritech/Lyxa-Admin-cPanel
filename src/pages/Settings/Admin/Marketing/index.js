// thrid party
import { Box } from '@mui/material';
import PageList from '../../../../components/Common/PageList';
import PageTop from '../../../../components/Common/PageTop';

const pagesList = [
  {
    label: 'Loyalty',
    to: '/admin/settings2/marketing/loyalty',
  },
  {
    label: 'Deals',
    to: '/admin/settings2/marketing/deals',
  },
];

export default function AdminMarketingSettings() {
  return (
    <Box>
      <PageTop
        title="Settings"
        subtitle="Customize admin settings"
        backButtonLabel="Back to Settings"
        backTo="/admin/settings2"
      />
      <PageList items={pagesList} />
    </Box>
  );
}
