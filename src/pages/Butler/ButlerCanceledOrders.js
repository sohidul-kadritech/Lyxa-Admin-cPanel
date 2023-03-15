// third pary
import { Box, Stack, Tooltip, Unstable_Grid2 as Grid } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

// prodject import
import ReplayIcon from '@mui/icons-material/Replay';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { orderModelOptions, orderStatusOptionsAll, orderTypeOptionsAll } from '../../assets/staticData';
import AppPagination from '../../components/Common/AppPagination2';
import BreadCrumbs from '../../components/Common/BreadCrumb2';
import FilterButton from '../../components/Filter/FilterButton';
import FilterDate from '../../components/Filter/FilterDate';
import FilterSearch from '../../components/Filter/FilterSearch';
import FilterSelect from '../../components/Filter/FilterSelect';
import GlobalWrapper from '../../components/GlobalWrapper';
import OrderTable from '../../components/OrderTable2';
import minInMiliSec from '../../helpers/minInMiliSec';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

// breadcrumb items
const breadcrumbItems = [
  {
    to: '/',
    label: 'Lyxa',
  },
  {
    to: '/orders/list',
    label: 'Orders',
  },
];

// throttle params
let delaying = false;
const delay = 200;

const sortByOptions = [
  {
    label: 'Desc',
    value: 'DESC',
  },
  {
    label: 'Asc',
    value: 'ASC',
  },
];

const getAllOrders = (page, sortBy, orderStatus, startDate, endDate, searchKey, orderType, service) =>
  AXIOS.get(Api.ORDER_LIST, {
    params: {
      page,
      pageSize: 50,
      sortBy,
      type: 'cancelled',
      startDate,
      endDate,
      searchKey,
      orderType,
      model: service,
    },
  });

const butlerTypeOptions = [
  { label: 'Delivery Only', value: 'delivery_only' },
  { label: 'Purchase Delivery', value: 'purchase_delivery' },
];

export default function ButlerOrderList() {
  const history = useHistory();

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('DESC');
  const [orderStatus, setOrderStatus] = useState('all');
  const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'));
  const [searchKey, setSearchKey] = useState('');
  const [orderTypeMain, setOrderTypeMain] = useState('all');
  const [orderType, setOrderType] = useState('all');
  const [service, setService] = useState('');

  // get all data
  const allOrdersQuery = useQuery(
    ['all-orders', { currentPage, sortBy, orderStatus, startDate, endDate, searchKey, orderTypeMain, service }],
    () => getAllOrders(currentPage, sortBy, orderStatus, startDate, endDate, searchKey, orderTypeMain, service),
    {
      staleTime: minInMiliSec(3),
    }
  );

  const handleOrderTypeChange = (value) => {
    if (value !== 'butler') {
      setOrderTypeMain(value);
      setOrderType(value);
    } else {
      setOrderType(value);
    }
  };

  const clearFilter = () => {
    setSortBy('DESC');
    setOrderStatus('all');
    setStartDate(moment().startOf('month').format('YYYY-MM-DD'));
    setEndDate(moment().endOf('month').format('YYYY-MM-DD'));
    setSearchKey('');
    setOrderType('all');
    setService('');
    setIsFilterApplied(false);
    setOrderTypeMain('all');
  };

  return (
    <GlobalWrapper padding>
      <Box className="page-content" sx={{ height: '100vh' }}>
        <Grid container sx={{ height: '100%' }}>
          <Grid xs={12} sx={{ height: '100%', overflowY: 'scroll' }}>
            <BreadCrumbs items={breadcrumbItems} />
            {/* filters */}
            <Stack direction="row" spacing={3} pt={6.5} pb={4.5}>
              {/* service */}
              <Tooltip title="Service">
                <Box>
                  <FilterSelect
                    items={orderModelOptions}
                    value={service}
                    placeholder="Service"
                    onChange={(e) => {
                      setService(e.target.value);
                      setIsFilterApplied(true);
                    }}
                  />
                </Box>
              </Tooltip>
              {/* order type */}
              <Tooltip title="Order Type">
                <Box>
                  <FilterSelect
                    items={orderTypeOptionsAll}
                    value={orderType}
                    placeholder="Order Type"
                    filterName="Order Type:"
                    onChange={(e) => {
                      handleOrderTypeChange(e.target.value);
                      setIsFilterApplied(true);
                    }}
                  />
                </Box>
              </Tooltip>
              {/* butler order type */}
              {orderType === 'butler' && (
                <Tooltip title="Butler Type">
                  <Box>
                    <FilterSelect
                      items={butlerTypeOptions}
                      value={orderTypeMain}
                      placeholder="Butler Type"
                      onChange={(e) => {
                        setOrderTypeMain(e.target.value);
                        setIsFilterApplied(true);
                      }}
                    />
                  </Box>
                </Tooltip>
              )}
<<<<<<< HEAD

=======
>>>>>>> origin/dev-nazib
              {/* sort */}
              <Tooltip title="Sort By">
                <Box>
                  <FilterSelect
                    items={sortByOptions}
                    value={sortBy}
                    placeholder="Sort by"
                    onChange={(event) => {
                      setSortBy(event.target.value);
                      setIsFilterApplied(true);
                    }}
                  />
                </Box>
              </Tooltip>
              {/* order status */}
              <Tooltip title="Order Status">
                <Box>
                  <FilterSelect
                    items={orderStatusOptionsAll}
                    value={orderStatus}
                    placeholder="Order Status"
                    filterName="Order Status:"
                    onChange={(e) => {
                      setOrderStatus(e.target.value);
                      setIsFilterApplied(true);
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
                      setStartDate(e._d);
                      setIsFilterApplied(true);
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
                      setEndDate(e._d);
                      setIsFilterApplied(true);
                    }}
                  />
                </Box>
              </Tooltip>
              {/* order note / id */}
              <Tooltip title="Search Order">
                <Box>
                  <FilterSearch
                    value={searchKey}
                    onChange={(value) => {
                      if (delaying === false) {
                        delaying = true;
                        setSearchKey(value);
                        setIsFilterApplied(true);
                        setTimeout(() => {
                          delaying = false;
                        }, delay);
                      }
                    }}
                  />
                </Box>
              </Tooltip>
              {/* clear filter */}
              <Tooltip className={`${isFilterApplied ? '' : 'd-none'}`} title="Clear Filter">
                <Box>
                  <FilterButton
                    label="Clear"
                    sx={{
                      background: 'rgb(63,63,63)',
                      color: '#fff',
                      '&:hover': {
                        background: 'rgb(78,78,78)',
                      },
                    }}
                    onClick={() => {
                      clearFilter();
                    }}
                  />
                </Box>
              </Tooltip>
              {/* refresh */}
              <Tooltip title="Refresh">
                <Box>
                  <FilterButton
                    className={`${allOrdersQuery.isLoading || allOrdersQuery.isFetching ? 'refresh-animate' : ''}`}
                    label="Refresh"
                    endIcon={<ReplayIcon />}
                    onClick={() => {
                      allOrdersQuery.refetch();
                    }}
                    sx={{
                      gap: '8px',
                      '& .MuiButton-endIcon': {
                        marginLeft: '0px',
                      },
                    }}
                  />
                </Box>
              </Tooltip>
            </Stack>
            <Box sx={{ minHeight: 'calc(100% - 308px)' }}>
              <OrderTable
                orders={allOrdersQuery?.data?.data?.orders || []}
                loading={allOrdersQuery.isLoading || allOrdersQuery.isFetching}
                onRowClick={(params) => {
                  if (params?.row?.isButler) {
                    history.push(`/orders/details/butler/${params?.row?._id}`);
                  }
                  history.push(`/orders/details/regular/${params?.row?._id}`);
                }}
              />
            </Box>
            <Box
              sx={{
                pt: 7.5,
                pb: 7.5,
              }}
            >
              <AppPagination
                currentPage={currentPage}
                lisener={(newPage) => {
                  setCurrentPage(newPage);
                }}
                totalPage={allOrdersQuery?.data?.data?.metadata?.page?.totalPage || 1}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </GlobalWrapper>
  );
}
