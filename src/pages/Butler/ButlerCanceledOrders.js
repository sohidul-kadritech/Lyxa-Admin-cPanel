/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
// third party
import { Box, Stack, Tooltip, Unstable_Grid2 as Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

// prodject import
import ReplayIcon from '@mui/icons-material/Replay';
import ButlerOrderTable from '../../components/ButlerOrderTable';
import AppPagination from '../../components/Common/AppPagination2';
import BreadCrumbs from '../../components/Common/BreadCrumb2';
import FilterButton from '../../components/Filter/FilterButton';
import GlobalWrapper from '../../components/GlobalWrapper';
import { getAllOrder, updateButlerOrderPage } from '../../store/Butler/butlerActions';

// breadcrumb items
const breadcrumbItems = [
  {
    to: '/',
    label: 'Lyxa',
  },
  {
    to: '/butler/list/canceled',
    label: 'Canceled Orders',
  },
];

export default function ButlerCancelOrders() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { orders, loading, page, paging } = useSelector((state) => state.butlerReducer);

  // eslint-disable-next-line no-unused-vars
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);

  // get order list
  const getOrderLIst = (refresh = false) => {
    dispatch(getAllOrder(refresh));
  };

  // update page
  const updatePage = (newPage) => {
    if (newPage !== page) {
      dispatch(updateButlerOrderPage(newPage));
      getOrderLIst(true);
    }
  };

  // update orderlist
  const updateOrderList = (type) => {
    switch (type) {
      case 'refresh':
        getOrderLIst(true);
        break;

      default:
    }
  };

  useEffect(() => {
    if (orders?.length === 0) {
      getOrderLIst();
    }
  }, []);

  return (
    <GlobalWrapper padding>
      <Box className="page-content" sx={{ height: '100vh' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* left */}
          <Grid md={isRightBarOpen ? 8 : 12} sx={{ height: '100%', overflowY: 'scroll' }}>
            <BreadCrumbs items={breadcrumbItems} />
            {/* filters */}
            <Stack direction="row" spacing={3} pt={6.5} pb={4.5}>
              {/* refresh */}
              <Tooltip title="Refresh">
                <Box>
                  <FilterButton
                    label="Refresh"
                    endIcon={<ReplayIcon />}
                    onClick={() => {
                      updateOrderList('refresh');
                    }}
                  />
                </Box>
              </Tooltip>
            </Stack>
            <Box sx={{ minHeight: 'calc(100% - 308px)' }}>
              <ButlerOrderTable
                orders={orders.filter((item) => item?.orderStatus === 'cancelled')}
                loading={loading}
                onRowClick={(params) => {
                  history.push(`order-details/${params?.row?._id}`);
                }}
              />
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
