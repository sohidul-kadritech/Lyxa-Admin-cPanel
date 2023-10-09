// third party
import { Box, Drawer } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';

// project import
import StyledTabs2 from '../../../components/Styled/StyledTab2';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import AddCoupon from '../AddCoupon';
import { couponListTabOptions } from '../helpers';
import CouponTable from './CouponTable';
import Searchbar from './Seachbar';

export default function CouponList({ queryParams, setQueryParams }) {
  const [currentTab, setCurrentTab] = useState('global');
  const [drawer, setDrawer] = useState(false);

  // const [filters, setFilters] = useState({ ...filtersInit });
  const [editCoupon, setEditCoupon] = useState({});

  const query = useQuery([Api.GET_COUPON, queryParams], () =>
    AXIOS.get(Api.GET_COUPON, {
      params: queryParams,
    })
  );

  return (
    <Box pb={10} pt={7.5}>
      <StyledTabs2
        value={currentTab}
        onChange={(value) => {
          setCurrentTab(value);
          setQueryParams((prev) => ({ ...prev, couponType: value }));
        }}
        options={couponListTabOptions}
      />
      <Box pt={7.5}>
        <Searchbar
          searchPlaceHolder={`Search ${
            query?.data?.data?.coupons?.length ? `${query?.data?.data?.coupons?.length} ` : ''
          }items `}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          onAdd={() => {
            setDrawer(true);
          }}
        />
        <CouponTable
          loading={query.isLoading}
          rows={query?.data?.data?.coupons}
          couponType={currentTab}
          onEdit={(coupon) => {
            setEditCoupon(coupon);
            setDrawer(true);
          }}
        />
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
