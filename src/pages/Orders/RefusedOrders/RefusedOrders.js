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

  const [refusedOrders, setRefusedOrders] = useState(null);

  useEffect(() => {
    allOrderList(true);
  }, []);

  const allOrderList = (refresh = false) => {
    dispatch(getAllOrder());
  };

  useEffect(() => {
    setRefusedOrders(orders.filter((order) => order.status === "refused"));
  }, [orders]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"List"}
              title="Refused Orders"
              loading={loading}
              callList={allOrderList}
            />

            <OrderTable
              orders={refusedOrders}
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
