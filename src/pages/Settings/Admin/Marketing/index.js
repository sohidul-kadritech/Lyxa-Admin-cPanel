// thrid pary
import { West } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import PageButton from '../../../../components/Common/PageButton';
import PageList from '../../../../components/Common/PageList';
import Wrapper from '../../../../components/Wrapper';

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
  const theme = useTheme();

  return (
    <Wrapper
      sx={{
        paddingTop: 9,
      }}
    >
      <Box className="page-content2" sx={{ height: '100vh', overflowY: 'scroll' }}>
        <Box pb={7.5}>
          <PageButton label="Back to Settings" to="/admin/settings2" startIcon={<West />} />
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
