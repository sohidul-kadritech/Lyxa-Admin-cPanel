import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import AppPagination from '../../../components/AppPagination';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import OrderTable from '../../../components/OrderTable';
import { getAllOrder } from '../../../store/order/orderAction';

function RefusedOrders() {
  const dispatch = useDispatch();
  const { orders, loading, paging, hasNextPage, hasPreviousPage, currentPage } = useSelector(
    (state) => state.orderReducer
  );

  const [cancelledOrders, setCancelledOrders] = useState(null);

  const allOrderList = (refresh = false) => {
    dispatch(getAllOrder(refresh));
  };

  useEffect(() => {
    allOrderList(true);
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      setCancelledOrders(orders.filter((order) => order.orderStatus === 'cancelled'));
    }
  }, [orders]);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem="List"
            title="Cancelled Orders"
            loading={loading}
            callList={allOrderList}
          />

          <OrderTable orders={cancelledOrders} loading={loading} refused />
          <Row>
            <Col xl={12}>
              <div className="d-flex justify-content-center">
                <AppPagination
                  paging={paging}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  currentPage={currentPage}
                  lisener={(page) => dispatch(getAllOrder(true, null, null, page))}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default RefusedOrders;
