// third party
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Button, Stack, Unstable_Grid2 as Grid } from '@mui/material';
// project import
import BreadCrumbs from '../../../../components/Common/BreadCrumb2';
import PageButton from '../../../../components/Common/PageButton';
import Wrapper from '../../../../components/Wrapper';
import InfoCard from './InfoCard';
import { ProductsInfoListData } from './mock';
import ProductsInfoList from './ProductsInfoList';
import { IncreaseDecreaseTag, ViewMoreTag } from './Tags';

const breadCrumbItems = [
  {
    label: 'Marketing',
    to: '/marketing',
  },
  {
    label: ' Loyalty Points',
    to: '/unknown',
  },
];

export default function LoyaltyProgramDashboard() {
  return (
    <Wrapper
      sx={{
        paddingTop: '70px',
        background: '#FBFBFB !important',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" pt={8}>
        <PageButton label="Back to Marketing" to="/marketing" startIcon={<KeyboardBackspaceIcon />} />
        <Button variant="contained" color="secondary">
          Manage Promotions
        </Button>
      </Stack>
      <BreadCrumbs items={breadCrumbItems} />
      <Grid container spacing={6.5}>
        <Grid xs={6} md={4}>
          <InfoCard title="Ongoing Promotions on Items" value={14} Tag={<ViewMoreTag />} />
        </Grid>
        <Grid xs={6} md={4}>
          <InfoCard title="Ongoing Promotions on Items" value={14} Tag={<IncreaseDecreaseTag status="increase" />} />
        </Grid>
        <Grid xs={6} md={4}>
          <InfoCard title="Ongoing Promotions on Items" value={14} Tag={<IncreaseDecreaseTag />} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid xs={12} md={6}>
          <ProductsInfoList items={ProductsInfoListData} />
        </Grid>
      </Grid>
    </Wrapper>
  );
}
