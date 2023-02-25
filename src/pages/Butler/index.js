/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
// eslint-disable-next-line no-unused-vars

// third pary
import { Box, Stack, Unstable_Grid2 as Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// prodject import
import ButlerOrderTable from '../../components/ButlerOrderTable';
import AppPagination from '../../components/Common/AppPagination2';
import BreadCrumbs from '../../components/Common/BreadCrumb2';
import GlobalWrapper from '../../components/GlobalWrapper';
import { getAllOrder, updateButlerOrderPage } from '../../store/Butler/butlerActions';

// breadcrumb items
const breadcrumbItems = [
  {
    to: '/',
    label: 'Lyxa',
  },
  {
    to: '/butler/list',
    label: 'Butler Orders',
  },
];

export default function ButlerOrderList() {
  const dispatch = useDispatch();

  const { sortByKey, orders, loading, startDate, endDate, typeKey, orderType, orderSearchKey, status, page, paging } =
    useSelector((state) => state.butlerReducer);

  // eslint-disable-next-line no-unused-vars
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);

  // update page
  const updatePage = (newPage) => {
    if (newPage !== page) {
      dispatch(updateButlerOrderPage(newPage));
    }
  };

  // get order list
  const getOrderLIst = (refresh = false) => {
    dispatch(getAllOrder(refresh));
  };

  useEffect(() => {
    if (sortByKey || startDate || endDate || typeKey || orderType || orderSearchKey) {
      getOrderLIst(true);
    }
  }, [sortByKey, startDate, endDate, typeKey, orderType, orderSearchKey]);

  useEffect(() => {
    if (status) {
      getOrderLIst(true);
    }
  }, [status]);

  return (
    <GlobalWrapper padding>
      <Box className="page-content" sx={{ height: '100vh' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* left */}
          <Grid md={isRightBarOpen ? 8 : 12} sx={{ height: '100%', overflowY: 'scroll' }}>
            <BreadCrumbs items={breadcrumbItems} />
            {/* filters */}
            <Stack direction="row" spacing={3}></Stack>
            <Box sx={{ minHeight: 'calc(100% - 220px)' }}>
              <ButlerOrderTable orders={orders} loading={loading} />
            </Box>
            <Box
              sx={{
                pt: 7.5,
                pb: 7.5,
              }}
            >
              <AppPagination currentPage={page} lisener={updatePage} paging={paging} />
            </Box>
          </Grid>
          {/* right */}
          <Grid className={`${isRightBarOpen ? '' : 'd-none'}`} md={4}>
            This is rightBar
          </Grid>
        </Grid>
      </Box>
    </GlobalWrapper>
  );
}
