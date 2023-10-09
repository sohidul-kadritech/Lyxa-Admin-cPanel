import { Box, Tab, Tabs } from '@mui/material';
import PageTop from '../../components/Common/PageTop';
import TabPanel from '../../components/Common/TabPanel';
import useQueryParams from '../../helpers/useQueryParams';
import CouponList from './List';
import CouponOverview from './Overview';
import { breadcrumbItems, queryParamsInit } from './helpers';

export default function CouponSettings() {
  const [queryParams, setQueryParams] = useQueryParams(queryParamsInit());
  console.log({ queryParams });

  return (
    <Box>
      <PageTop backButtonLabel="Back to Marketing" backTo="/settings/marketing" breadcrumbItems={breadcrumbItems} />
      <Tabs
        value={Number(queryParams?.tab1)}
        onChange={(event, newValue) => {
          setQueryParams((prev) => ({ ...prev, tab1: newValue }));
        }}
        sx={{
          '& .MuiTab-root': {
            padding: '8px 12px',
            textTransform: 'none',
          },
        }}
      >
        <Tab label="Overview" />
        <Tab label="Coupons" />
      </Tabs>
      <Box>
        <TabPanel value={Number(queryParams?.tab1)} index={0} noPadding>
          <CouponOverview queryParams={queryParams} setQueryParams={setQueryParams} />
        </TabPanel>
        <TabPanel value={Number(queryParams?.tab1)} index={1} noPadding>
          <CouponList queryParams={queryParams} setQueryParams={setQueryParams} />
        </TabPanel>
      </Box>
    </Box>
  );
}
