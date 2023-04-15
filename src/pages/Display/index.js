// thrid pary
import { Box } from '@mui/material';
import PageList from '../../components/Common/PageList';
import PageTop from '../../components/Common/PageTop';

const pagesList = [
  {
    label: 'Ads Banner',
    to: '/display/banner/',
  },
  {
    label: 'Tags & Cuisines',
    to: '/display/tags-cusines',
  },
  {
    label: 'List Container',
    to: '/display/list-containers',
  },
  {
    label: 'Filter Container',
    to: '/display/filter-containers',
  },
];

export default function DisplaySettings() {
  return (
    // <Wrapper
    //   sx={{
    //     paddingTop: 0,
    //     height: 'auto',
    //   }}
    // >

    // </Wrapper>
    <Box>
      <PageTop title="Display" subtitle="Customize admin settings" />
      <PageList items={pagesList} />
    </Box>
  );
}
