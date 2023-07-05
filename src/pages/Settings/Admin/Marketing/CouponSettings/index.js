// third party
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';

// project import
import PageTop from '../../../../../components/Common/PageTop';
import * as Api from '../../../../../network/Api';
import AXIOS from '../../../../../network/axios';
import AddCoupon from './AddCoupon';
import CouponTable from './CouponTable';
import PageLoader from './PageLoader';
import Searchbar from './Seachbar';
import { breadcrumbItems, filtersInit, tabValueToCouponTypeMap } from './helpers';

export default function CoponSettings() {
  const [currentTab, setCurrentTab] = useState(0);
  const [drawer, setDrawer] = useState(false);

  const [filters, setFilters] = useState({ ...filtersInit });
  const [editCoupon, setEditCoupon] = useState({});

  const query = useQuery([Api.GET_COUPON, filters], () =>
    AXIOS.get(Api.GET_COUPON, {
      params: filters,
    })
  );

  console.log('data', query?.data?.data?.coupons);

  return (
    <Box>
      <PageTop backButtonLabel="Back to Marketing" backTo="/settings/marketing" breadcrumbItems={breadcrumbItems} />
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => {
          setCurrentTab(newValue);
          setFilters((prev) => ({ ...prev, couponType: tabValueToCouponTypeMap[newValue] }));
        }}
        sx={{
          '& .MuiTab-root': {
            padding: '8px 12px',
            textTransform: 'none',
          },
        }}
      >
        <Tab label="Global" />
        <Tab label="Store/Category" />
        <Tab label="Individual User" />
        <Tab label="Custom Coupon" />
      </Tabs>
      <Box pt={10}>
        <Searchbar
          searchPlaceHolder={`Search ${
            query?.data?.data?.coupons?.length ? `${query?.data?.data?.coupons?.length} ` : ''
          }items `}
          filters={filters}
          setFilters={setFilters}
          onAdd={() => {
            setDrawer(true);
          }}
        />
        {query.isLoading ? (
          <PageLoader />
        ) : (
          <CouponTable
            rows={query?.data?.data?.coupons}
            couponType={tabValueToCouponTypeMap[currentTab]}
            onEdit={(coupon) => {
              setEditCoupon(coupon);
              setDrawer(true);
            }}
          />
        )}
      </Box>
      <Drawer open={Boolean(drawer)} anchor="right">
        <AddCoupon
          couponType={tabValueToCouponTypeMap[currentTab]}
          editCoupon={editCoupon}
          onClose={() => {
            setDrawer(false);
            setEditCoupon({});
          }}
        />
      </Drawer>
    </Box>
  );
}
