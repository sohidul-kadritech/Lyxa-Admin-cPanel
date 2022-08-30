import React, { useEffect, useMemo } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import {
  orderTypesOptions,
  shopTypeOptions,
  sortByOptions,
} from "../../../assets/staticData";

import {
  getAllOrder,
  updateOrderByShopType,
  updateOrderEndDate,
  updateOrderSearchKey,
  updateOrderSortByKey,
  updateOrderStartDate,
  updateOrderType,
} from "../../../store/order/orderAction";
import { useDispatch, useSelector } from "react-redux";
import AppPagination from "./../../../components/AppPagination";
import { useHistory, useLocation } from "react-router-dom";
import Search from "./../../../components/Search";
import OrderTable from "../../../components/OrderTable";

const OrdersList = () => {
  const dispatch = useDispatch();

  const { search } = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const {
    sortByKey,
    orders,
    loading,
    startDate,
    endDate,
    typeKey,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    orderType,
    orderSearchKey,
    status,
  } = useSelector((state) => state.orderReducer);

  const { account_type, _id: Id } = JSON.parse(localStorage.getItem("admin"));

  const callOrderList = (refresh = false) => {
    dispatch(
      getAllOrder(
        refresh,
        searchParams.get("shopId")
          ? searchParams.get("shopId")
          : account_type === "shop"
          ? Id
          : null,
        account_type === "seller" ? Id : null
      )
    );
  };

  useEffect(() => {
    if (
      sortByKey ||
      startDate ||
      endDate ||
      typeKey ||
      orderType ||
      orderSearchKey ||
      searchParams.get("shopId")
    ) {
      callOrderList(true);
    }
    return;
  }, [
    sortByKey,
    startDate,
    endDate,
    typeKey,
    orderType,
    orderSearchKey,
    searchParams.get("shopId"),
  ]);

  useEffect(() => {
    if (status) {
      callOrderList(true);
    }
  }, [status]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"List"}
              title="Orders"
              loading={loading}
              callList={callOrderList}
            />

            {/* FITLERS */}
            <Card>
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
                            onChange={(selectedDates, dateStr, instance) =>
                              dispatch(updateOrderStartDate(dateStr))
                            }
                            options={{
                              altInput: true,
                              altFormat: "F j, Y",
                              dateFormat: "Y-m-d",
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
                            onChange={(selectedDates, dateStr, instance) =>
                              dispatch(updateOrderEndDate(dateStr))
                            }
                            options={{
                              altInput: true,
                              altFormat: "F j, Y",
                              dateFormat: "Y-m-d",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="mb-4">
                      <label className="control-label">Type</label>
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
                      <label className="control-label">
                        Order By Shop Type
                      </label>
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
                    <Search
                      placeholder="Search by Order Id"
                      dispatchFunc={updateOrderSearchKey}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <div>
              <OrderTable orders={orders} status={status} loading={loading} />
            </div>
            <Row>
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
                          searchParams.get("shopId")
                            ? searchParams.get("shopId")
                            : account_type === "shop"
                            ? Id
                            : null,
                          account_type === "seller" ? Id : null,
                          page
                        )
                      )
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

export default OrdersList;
