// thrid pary
import { Box, Typography, useTheme } from '@mui/material';
import PageList from '../../components/Common/PageList';
import Wrapper from '../../components/Wrapper';

const pagesList = [
  {
    label: 'Ads Banner',
    to: '#',
  },
  {
    label: 'Tags & Cuisines banner',
    to: '',
  },
  {
    label: 'List Container',
    to: '/display/list-containers',
  },
  {
    label: 'Filter Container',
    to: '/display/tags-cusines',
  },
];

export default function DisplaySettings() {
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
            color={theme.palette.text.primary}
            sx={{
              pt: 9,
              pb: 2,
            }}
          >
            Display
          </Typography>
          <Typography variant="body3">Customize admin settings</Typography>
        </Box>
        <PageList items={pagesList} />
      </Box>
    </Wrapper>
  );
}
