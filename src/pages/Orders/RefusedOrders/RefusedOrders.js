import React, { useState } from "react";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { Container, Row, Col } from "reactstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder } from "../../../store/order/orderAction";
import OrderTable from "../../../components/OrderTable";
import AppPagination from "../../../components/AppPagination";
import Breadcrumb from "./../../../components/Common/Breadcrumb";

const RefusedOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, paging, hasNextPage, hasPreviousPage, currentPage } =
    useSelector((state) => state.orderReducer);

  const [cancelledOrders, setCancelledOrders] = useState(null);

  useEffect(() => {
    allOrderList(true);
  }, []);

  const allOrderList = (refresh = false) => {
    dispatch(getAllOrder(refresh));
  };

  useEffect(() => {
    if (orders.length > 0) {
      setCancelledOrders(
        orders.filter((order) => order.orderStatus === "cancelled")
      );
    }
  }, [orders]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"List"}
              title="Cancelled Orders"
              loading={loading}
              callList={allOrderList}
            />

            <OrderTable
              orders={cancelledOrders}
              loading={loading}
              refused={true}
            />
            <Row>
              <Col xl={12}>
                <div className="d-flex justify-content-center">
                  <AppPagination
                    paging={paging}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    currentPage={currentPage}
                    lisener={(page) =>
                      dispatch(getAllOrder(true, null, null, page))
                    }
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default RefusedOrders;
