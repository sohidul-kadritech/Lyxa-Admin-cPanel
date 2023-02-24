/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import GlobalWrapper from '../../components/GlobalWrapper';
import OrderTable from '../../components/OrderTable';
import StyledTable from '../../components/StyledTable';
import ThreeDotsMenu from '../../components/ThreeDotsMenu';
import { getAllOrder } from '../../store/Butler/butlerActions';

const getOrderStatus = (statusName) => {
  let status = '';
  if (statusName === 'accepted_delivery_boy') {
    status = 'Accept by rider';
  } else if (statusName === 'preparing') {
    status = 'Accept by shop';
  } else if (statusName === 'ready_to_pickup') {
    status = 'Ready to pickup';
  } else if (statusName === 'order_on_the_way') {
    status = 'On the way';
  } else if (statusName === 'delivered') {
    status = 'Delivered';
  } else if (statusName === 'cancelled') {
    status = 'Cancelled';
  } else if (statusName === 'refused') {
    status = 'Refused';
  } else {
    status = 'Placed';
  }
  return status;
};

export default function ButlerOrderList() {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const { sortByKey, orders, loading, startDate, endDate, typeKey, orderType, orderSearchKey, status } = useSelector(
    (state) => state.butlerReducer
  );
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();

  const { account_type, _id: Id } = useSelector((store) => store.Login.admin);
  const callOrderList = (refresh = false) => {
    dispatch(
      getAllOrder(
        refresh,
        searchParams.get('shopId') ? searchParams.get('shopId') : account_type === 'shop' ? Id : null,
        account_type === 'seller' ? Id : null
      )
    );
  };
  useEffect(() => {
    if (sortByKey || startDate || endDate || typeKey || orderType || orderSearchKey || searchParams.get('shopId')) {
      callOrderList(true);
    }
  }, [sortByKey, startDate, endDate, typeKey, orderType, orderSearchKey, searchParams.get('shopId')]);

  useEffect(() => {
    if (status) {
      callOrderList(true);
    }
  }, [status]);

  const getThreedotMenuOptions = (orderStatus) => {
    const options = [];
    const hideUpdateAndCanelOption = ['cancelled', 'delivered', 'refused'];

    if (hideUpdateAndCanelOption.indexOf(orderStatus) < 0) {
      options.push('Update Status');
      options.push('Cancel Order');
    }

    if (account_type === 'admin') {
      options.push('Flag');
    }

    return options;
  };

  // columns
  const columns = [
    {
      id: 1,
      headerName: 'Customer',
      field: 'user',
      minWidth: 300,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={3} alignItems="center">
          <Box>
            {params?.row?.user?.profile_photo ? (
              <Avatar alt="Remy Sharp" src={params?.row?.user?.profile_photo} sx={{ width: 60, height: 60 }} />
            ) : (
              <Avatar sx={{ width: 60, height: 60 }}>C</Avatar>
            )}
          </Box>
          <Box>
            <span className="text-capitalize">{params?.row?.user?.name}</span>
            <Typography variant="body2">{params?.row?.orderId}</Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: 'Order Date',
      field: 'createdAt',
      sortable: false,
      minWidth: 300,
      renderCell: (params) => (
        <Stack width="100%" spacing={2}>
          <span>{new Date(params?.row?.createdAt).toLocaleDateString()}</span>
          <span>{new Date(params?.row?.createdAt).toLocaleTimeString()}</span>
        </Stack>
      ),
    },
    {
      id: 3,
      headerName: `Amount (${currency})`,
      sortable: false,
      field: 'summary',
      minWidth: 300,
      renderCell: (params) => <span>{params?.row?.summary?.totalAmount + params?.row?.summary?.vat}</span>,
    },
    {
      id: 4,
      headerName: 'Payment method',
      sortable: false,
      field: 'paymentMethod',
      minWidth: 300,
      renderCell: (params) => (
        <span className="text-capitalize">{`${params?.row?.paymentMethod} ${
          params?.row?.selectPos !== 'no' ? '(Pos)' : ''
        }`}</span>
      ),
    },
    {
      id: 5,
      headerName: 'Order Status',
      sortable: false,
      field: 'orderStatus',
      minWidth: 300,
      renderCell: (params) => {
        const status = getOrderStatus(params?.row?.orderStatus);
        return <Chip label={status} color={status === 'Cancelled' ? 'primary' : 'succes'} variant="contained" />;
      },
    },
    {
      id: 6,
      headerName: 'Action',
      sortable: false,
      field: 'action',
      minWidth: 300,
      renderCell: (params) => (
        <ThreeDotsMenu handleMenuClick={() => {}} menuItems={getThreedotMenuOptions(params?.row?.orderStatus)} />
      ),
    },
  ];

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem="List"
            title="Orders"
            loading={loading}
            callList={callOrderList}
          />
          {/* FITLERS */}
          {/* <Card>
            <CardBody>
              <Row>
                <Col lg={3}>
                  <div className="mb-4">
                    <label className="control-label">Sort By</label>
                    <Select
                      palceholder="Select Status"
                      options={sortByOptions}
                      classNamePrefix="select2-selection"
                      value={sortByKey}
                      onChange={(e) => dispatch(updateOrderSortByKey(e))}
                    />
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="d-flex my-3 my-md-0 ">
                    <div className=" w-100">
                      <label>Start Date</label>
                      <div className="form-group mb-0 w-100">
                        <Flatpickr
                          className="form-control d-block"
                          id="startDate"
                          placeholder="Start Date"
                          value={startDate}
                          onChange={(selectedDates, dateStr) => dispatch(updateOrderStartDate(dateStr))}
                          options={{
                            altInput: true,
                            altFormat: 'F j, Y',
                            dateFormat: 'Y-m-d',
                          }}
                        />
                      </div>
                    </div>
                    <div className="ms-2 w-100">
                      <label>End Date</label>
                      <div className="form-group mb-0">
                        <Flatpickr
                          className="form-control w-100"
                          id="endDate"
                          placeholder="Select End Date"
                          value={endDate}
                          onChange={(selectedDates, dateStr) => dispatch(updateOrderEndDate(dateStr))}
                          options={{
                            altInput: true,
                            altFormat: 'F j, Y',
                            dateFormat: 'Y-m-d',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-4">
                    <label className="control-label">Order Status</label>
                    <Select
                      palceholder="Select Status"
                      options={orderTypesOptions}
                      classNamePrefix="select2-selection"
                      value={typeKey}
                      onChange={(e) => dispatch(updateOrderType(e))}
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg={4}>
                  <div className="mb-4">
                    <label className="control-label">Order By Shop Type</label>
                    <Select
                      palceholder="Select Status"
                      options={shopTypeOptions}
                      classNamePrefix="select2-selection"
                      value={orderType}
                      onChange={(e) => dispatch(updateOrderByShopType(e))}
                    />
                  </div>
                </Col>
                <Col lg={8}>
                  <Search placeholder="Search by Order Id" dispatchFunc={updateOrderSearchKey} />
                </Col>
              </Row>
            </CardBody>
          </Card> */}

          <div>
            <StyledTable
              columns={columns}
              rows={orders || []}
              getRowId={(row) => row?._id}
              components={{
                NoRowsOverlay: () => (
                  <Stack height="100%" alignItems="center" justifyContent="center">
                    {loading ? '' : 'No Q&A found'}
                  </Stack>
                ),
              }}
            />
            <OrderTable orders={orders} status loading={loading} />
          </div>
          {/* <Row>
            <Col xl={12}>
              <div className="d-flex justify-content-center">
                <AppPagination
                  paging={paging}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  currentPage={currentPage}
                  lisener={(page) =>
                    dispatch(
                      getAllOrder(
                        true,
                        searchParams.get('shopId') ? searchParams.get('shopId') : account_type === 'shop' ? Id : null,
                        account_type === 'seller' ? Id : null,
                        page
                      )
                    )
                  }
                />
              </div>
            </Col>
          </Row> */}
        </Container>
      </div>
    </GlobalWrapper>
  );
}
