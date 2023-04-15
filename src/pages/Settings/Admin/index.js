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
];

export default function AdminSettings() {
  return (
    <Box>
      <PageTop title="Settings" subtitle="Customize admin settings" />
      <PageList items={pagesList} />
    </Box>
  );
}
