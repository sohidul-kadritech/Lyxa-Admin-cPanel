// thrid pary
import { Box, Typography, useTheme } from '@mui/material';
import PageList from '../../../components/Common/PageList';
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
  const theme = useTheme();

  return (
    <Wrapper
      sx={{
        paddingTop: 0,
      }}
    >
      <Box className="page-content2" sx={{ height: '100vh', overflowY: 'scroll' }}>
        <Box pb={7.5}>
          <Typography
            variant="h4"
            color={theme.palette.text.heading}
            sx={{
              pt: 9,
              pb: 2,
            }}
          >
            Settings
          </Typography>
          <Typography variant="body3">Customize admin settings</Typography>
        </Box>
        <PageList items={pagesList} />
      </Box>
    </Wrapper>
  );
}
