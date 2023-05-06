// third party
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
// project import
import { useQuery } from 'react-query';
import PageTop from '../../../../../components/Common/PageTop';
import * as Api from '../../../../../network/Api';
import AXIOS from '../../../../../network/axios';
import AddCoupon from './AddCoupon';
import CouponTable from './CouponTable';
import Searchbar from './Seachbar';
import { breadcrumbItems, filtersInit, tabValueToCouponTypeMap } from './helpers';

export default function CoponSettings() {
  const [currentTab, setCurrentTab] = useState(0);
  const [filters, setFilters] = useState({ ...filtersInit });
  const [drawer, setDrawer] = useState(false);

  const query = useQuery(['GET_COUPON', filters], () =>
    AXIOS.get(Api.GET_COUPON, {
      params: filters,
    })
  );

  console.log(query?.data?.data?.coupons);

  return (
    <Box>
      <PageTop
        backButtonLabel="Back to Marketing"
        backTo="/admin/settings2/marketing"
        breadcrumbItems={breadcrumbItems}
      />
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
        }}
        sx={{
          '& .MuiTab-root': {
            padding: '8px 12px',
            textTransform: 'none',
          },
        }}
      >
        <Tab label="Global" />
        <Tab label="Individual Store" />
        <Tab label="Individual User" />
        <Tab label="Custom Coupon" />
      </Tabs>
      <Box pt={10}>
        <Searchbar
          searchPlaceHolder="Search 24 items"
          filters={filters}
          setFilters={setFilters}
          onAdd={() => {
            setDrawer(true);
          }}
        />
        <CouponTable rows={query?.data?.data?.coupons} />
      </Box>
      <Drawer open={Boolean(drawer)} anchor="right">
        <AddCoupon
          couponType={tabValueToCouponTypeMap[currentTab]}
          onClose={() => {
            setDrawer(false);
          }}
        />
      </Drawer>
    </Box>
  );
}
