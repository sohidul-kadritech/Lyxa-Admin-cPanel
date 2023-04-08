// thrid pary
import { Box } from '@mui/material';
import PageList from '../../../components/Common/PageList';
import PageTop from '../../../components/Common/PageTop';
import Wrapper from '../../../components/Wrapper';

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
    <Wrapper
      sx={{
        paddingTop: 0,
        height: 'auto',
      }}
    >
      <Box className="page-content2">
        <PageTop title="Settings" subtitle="Customize admin settings" />
        <PageList items={pagesList} />
      </Box>
    </Wrapper>
  );
}
