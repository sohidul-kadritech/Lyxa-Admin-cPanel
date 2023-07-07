// third party
import { Box, Drawer } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';

// project import
import StyledTabs2 from '../../../../../components/Styled/StyledTab2';
import * as Api from '../../../../../network/Api';
import AXIOS from '../../../../../network/axios';
import AddCoupon from './AddCoupon';
import CouponTable from './CouponTable';
import PageLoader from './PageLoader';
import Searchbar from './Seachbar';
import { couponListTabOptions, filtersInit } from './helpers';

export default function CouponList() {
  const [currentTab, setCurrentTab] = useState('global');
  const [drawer, setDrawer] = useState(false);

  const [filters, setFilters] = useState({ ...filtersInit });
  const [editCoupon, setEditCoupon] = useState({});

  const query = useQuery([Api.GET_COUPON, filters], () =>
    AXIOS.get(Api.GET_COUPON, {
      params: filters,
    })
  );

  return (
    <Box pb={9}>
      <StyledTabs2
        value={currentTab}
        onChange={(value) => {
          setCurrentTab(value);
          setFilters((prev) => ({ ...prev, couponType: value }));
        }}
        options={couponListTabOptions}
      />
      <Box pt={7.5}>
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
            couponType={currentTab}
            onEdit={(coupon) => {
              setEditCoupon(coupon);
              setDrawer(true);
            }}
          />
        )}
      </Box>
      <Drawer open={Boolean(drawer)} anchor="right">
        <AddCoupon
          couponType={currentTab}
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
