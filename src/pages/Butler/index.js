/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
// third pary
import { Box, Stack, Tooltip, Unstable_Grid2 as Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// prodject import
import { orderStatusOptionsAll, sortByOptions } from '../../assets/staticData';
import ButlerOrderTable from '../../components/ButlerOrderTable';
import AppPagination from '../../components/Common/AppPagination2';
import BreadCrumbs from '../../components/Common/BreadCrumb2';
import FilterButton from '../../components/Filter/FilterButton';
import FilterDate from '../../components/Filter/FilterDate';
import FilterSearch from '../../components/Filter/FilterSearch';
import FilterSelect from '../../components/Filter/FilterSelect';
import GlobalWrapper from '../../components/GlobalWrapper';
import {
  clearButlerSearchFilter,
  getAllOrder,
  updateBulterOrderDeliveryBoy,
  updateButlerOrderEndDate,
  updateButlerOrderPage,
  updateButlerOrderSearchKey,
  updateButlerOrderSortByKey,
  updateButlerOrderStartDate,
  updateButlerOrderType,
} from '../../store/Butler/butlerActions';

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

// throttle params
let delaying = false;
const delay = 200;

export default function ButlerOrderList() {
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const { sortByKey, orders, loading, startDate, endDate, typeKey, orderSearchKey, page, paging, deliveryBoy } =
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

  // update orderlist
  const updateOrderList = (type, payload) => {
    switch (type) {
      case 'sortByKey':
        dispatch(updateButlerOrderSortByKey(payload));
        getOrderLIst(true);
        break;

      case 'typeKey':
        dispatch(updateButlerOrderType(payload));
        getOrderLIst(true);
        break;

      case 'startDate':
        dispatch(updateButlerOrderStartDate(payload));
        getOrderLIst(true);
        break;

      case 'endDate':
        dispatch(updateButlerOrderEndDate(payload));
        getOrderLIst(true);
        break;

      case 'orderSearchKey':
        dispatch(updateButlerOrderSearchKey(payload));
        getOrderLIst(true);
        break;

      case 'deliveryBoy':
        dispatch(updateBulterOrderDeliveryBoy(payload));
        getOrderLIst(true);
        break;

      case 'clearFilter':
        dispatch(clearButlerSearchFilter());
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
              {/* sort */}
              <Tooltip title="Sort By">
                <Box>
                  <FilterSelect
                    items={sortByOptions}
                    value={sortByKey.value}
                    placeholder="Sort by"
                    onChange={(e, v) => {
                      updateOrderList('sortByKey', { value: v.props.value, label: v.props.children });
                    }}
                  />
                </Box>
              </Tooltip>
              {/* order type options */}
              <Tooltip title="Order Status">
                <Box>
                  <FilterSelect
                    items={orderStatusOptionsAll}
                    value={typeKey.value}
                    placeholder="Order Status"
                    onChange={(e, v) => {
                      updateOrderList('typeKey', { value: v.props.value, label: v.props.children });
                    }}
                  />
                </Box>
              </Tooltip>
              {/* order start date */}
              <Tooltip title="Start Date">
                <Box>
                  <FilterDate
                    value={startDate}
                    onChange={(e) => {
                      updateOrderList('startDate', e._d);
                    }}
                  />
                </Box>
              </Tooltip>
              {/* order end date */}
              <Tooltip title="End Date">
                <Box>
                  <FilterDate
                    value={endDate}
                    onChange={(e) => {
                      updateOrderList('endDate', e._d);
                    }}
                  />
                </Box>
              </Tooltip>
              {/* order note / id */}
              <Tooltip title="Search Order">
                <Box>
                  <FilterSearch
                    value={orderSearchKey}
                    onChange={(value) => {
                      if (delaying === false) {
                        delaying = true;
                        updateOrderList('orderSearchKey', value);
                        setTimeout(() => {
                          delaying = false;
                        }, delay);
                      }
                    }}
                    onSearch={(value) => {
                      updateOrderList('orderSearchKey', value);
                    }}
                  />
                </Box>
              </Tooltip>
              {/* order deliveryboy */}
              <Tooltip title="Search Delivery Boy">
                <Box>
                  <FilterSearch
                    value={deliveryBoy}
                    onChange={(value) => {
                      if (delaying === false) {
                        delaying = true;
                        updateOrderList('deliveryBoy', value);
                        setTimeout(() => {
                          delaying = false;
                        }, delay);
                      }
                    }}
                    onSearch={(value) => {
                      updateOrderList('deliveryBoy', value);
                    }}
                  />
                </Box>
              </Tooltip>
              {/* clear filter */}
              <Tooltip title="Clear Filter">
                <FilterButton
                  label="Clear"
                  onClick={() => {
                    updateOrderList('clearFilter');
                  }}
                />
              </Tooltip>
            </Stack>
            <Box sx={{ minHeight: 'calc(100% - 308px)' }}>
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
