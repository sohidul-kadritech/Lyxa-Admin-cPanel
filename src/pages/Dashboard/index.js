import PropTypes from "prop-types";
import React, { lazy, Suspense, useState } from "react";
import MetaTags from "react-meta-tags";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
  CardTitle,
} from "reactstrap";

import GlobalWrapper from "../../components/GlobalWrapper";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

import "chartist/dist/scss/chartist.scss";

//i18n
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getDashboardSummary,
  updateDashboardCardEndDate,
  updateDashboardCardStartDate,
} from "../../store/Dashboard/dashboardAction";
import AdminDashboard from "../../components/AdminDashboard";
import SellerDashboard from "../../components/SellerDashboard";
import ShopDashboard from "../../components/ShopDashboard";
import Flatpickr from "react-flatpickr";
// import OrdersGraph from "../../components/OrdersGraph";
// import EarningsGraph from "../../components/EarningsGraph";
// import UsersGraph from "../../components/UsersGraph";
import { TextField } from "@mui/material";
import styled from "styled-components";
import riderIcon from "../../assets/images/dashboard/rider.png";
import availableRiderIcon from "../../assets/images/dashboard/available-rider.png";
import activeRiderIcon from "../../assets/images/dashboard/active-rider.png";
import timerIcon from "../../assets/images/dashboard/timer.png";
import amountIcon from "../../assets/images/dashboard/amount.png";
import cashInHandIcon from "../../assets/images/dashboard/cash-in-hand.png";
import DashboardCard from "../../components/DashboardCard";

const OrdersGraph = lazy(() => import("../../components/OrdersGraph"));
const EarningsGraph = lazy(() => import("../../components/EarningsGraph"));
const UsersGraph = lazy(() => import("../../components/UsersGraph"));

const TopLists = ({ list, type }) => {
  return (
    <Card>
      <CardBody>
        <div className="d-flex mb-2">
          <i className="fa fa-user" style={{ fontSize: '18px', padding: "5px" }}></i>
          <h5 className="ms-2 text-dark">Top {`${type === 'user' ? "Users" : type === 'deliveryBoy' ? 'Delivery Boys' : 'Shops'}`}</h5>
        </div>

        <Table
          id="tech-companies-1"
          className="table table__wrapper table-hover cursor-pointer"
        >
          <Thead>
            <Tr style={{ border: "transparent" }}>
              <Th></Th>
              <Th></Th>
              <Th className='p-0 text-muted'>Orders</Th>
            </Tr>
          </Thead>
          <Tbody style={{ position: "relative", borderTop: 'none' }}>
            {list?.length > 0 &&
              list?.map((item, index) => {
                return (
                  <Tr
                    key={index}
                    className="align-middle"
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      border: "transparent"
                    }}
                  >
                    <Th style={{ color: `#${Math.floor(Math.random() * 16777215).toString(16)}` }}>#{index + 1}</Th>

                    <Td>{type === 'shop' ? item?.shopName : item?.name}</Td>
                    <Td className="text-end">{type === 'user' ? item?.orderCompleted : item?.totalOrder}</Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>

      </CardBody>
    </Card>

  )
}

const Dashboard = () => {
  const dispatch = useDispatch();

  const { dashboardData: { summery = {}, top_activity }, startDate, endDate, loading } = useSelector(
    (state) => state.dashboardReducer
  );
  const {
    account_type,
    adminType,
    _id: Id,
  } = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    if (startDate || endDate) {
      dispatch(
        getDashboardSummary(
          account_type === "admin" && adminType !== "customerService"
            ? "admin"
            : account_type === "seller"
              ? "seller"
              : "shop"
        )
      );
    }
    return;
  }, [startDate, endDate]);

  return (
    <React.Fragment>
      <div className="page-content">
        <GlobalWrapper>
          <MetaTags>
            <title>Lyxa</title>
          </MetaTags>

          <Container fluid>

            <Card className="page-title-box p-0">
              <CardBody style={{ boxShadow: "0 4px 2px -2px lightgray", padding: "10px 15px" }}>
                <Row className="align-items-center">
                  <Col md={5}>
                    <h6 className="page-title text-danger">Dashboard</h6>
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item active">
                        Welcome to Lyxa Dashboard
                      </li>
                    </ol>
                  </Col>
                  <Col md={7}>
                    <div className="d-flex">
                      <DateFilter className=" me-2 ">
                        <div className="date-label">
                          <small>Start</small>
                          <h5>Date</h5>
                        </div>
                        <TextField
                          type="date"
                          className="form-control"
                          id="example-time-input"
                          variant="standard"
                          format={"YYYY-MM-DD"}
                          value={startDate}
                          onChange={(e) =>
                            dispatch(updateDashboardCardStartDate(e.target.value))
                          }
                        />
                      </DateFilter>
                      <DateFilter className="ps-3">
                        <div className="date-label">
                          <small>End</small>
                          <h5>Date</h5>
                        </div>
                        <TextField
                          type="date"
                          className="form-control"
                          id="example-time-input"
                          variant="standard"
                          format={"YYYY-MM-DD"}
                          value={endDate}
                          onChange={(e) =>
                            dispatch(updateDashboardCardEndDate(e.target.value))
                          }

                        />
                      </DateFilter>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {loading && (
              <div className="text-center">
                <Spinner animation="border" variant="info" />
              </div>
            )}

            <div>
              {account_type === "admin" ? (
                <AdminDashboard summery={summery} />
              ) : account_type === "seller" ? (
                <SellerDashboard summery={summery} />
              ) : (
                <ShopDashboard summery={summery} />
              )}
            </div>


            {account_type === "admin" && (
              <Row>
                <Col md={9}>
                  <Suspense fallback={<div>Loading...</div>}>
                    <UsersGraph />
                  </Suspense>
                </Col>
                <Col md={3}>

                  <TopLists list={top_activity?.topUser} type="user" />
                </Col>
              </Row>
            )}

            {account_type === 'admin' && <Row>
              <Col md={3}>
                <TopLists list={top_activity?.topDeliveryBoy} type='deliveryBoy' />
              </Col>
              <Col md={9}>
                <Row>
                  <Col xl={4} >
                    <DashboardCard title="Delivery Boy's" value={summery?.totalDeliveryBoy} icon={riderIcon} border={"#f05179"} />
                  </Col>
                  <Col xl={4} >
                    <DashboardCard title='Active Riders' value={summery?.totalActiveDeliveryBoy} icon={availableRiderIcon} border={"#f05179"} />
                  </Col>

                  <Col xl={4} >
                    <DashboardCard title='Available Riders' value={summery?.totalAvailableDeliveryBoy} icon={activeRiderIcon} border={"#22a6ac"} />
                  </Col>

                </Row>
                <Row>
                  <Col xl={4}>
                    <DashboardCard title='Riders Unsettled Amount' value={`${summery?.deliveryBoyUnsettleAmount ?? 0} NGN`} icon={amountIcon} border={"#8c54ff"} />
                  </Col>
                  <Col xl={4}>
                    <DashboardCard title='Riders cash in hands' value={`${summery?.chashInHandDeliveryBoy ?? 0} NGN`} icon={cashInHandIcon} border={'yellow'} />
                  </Col>
                  <Col xl={4}>
                    <DashboardCard title='Avarage delivery time' value={`${summery?.totalAveratgeDeliveredTime?.toFixed(2)} Min`} icon={timerIcon} border={'#f15179'} />
                  </Col>
                </Row>
              </Col>
            </Row>}

            <Row>
              <Col md={9}>

                <Suspense fallback={<div>Loading...</div>}>
                  <OrdersGraph />
                </Suspense>
              </Col>

              <Col md={3}>
                <TopLists list={top_activity?.topShop} type='shop' />
              </Col>

            </Row>

            <Row>
              <Col>
                <Suspense fallback={<div>Loading...</div>}>
                  <EarningsGraph />
                </Suspense>
              </Col>
            </Row>
          </Container>
        </GlobalWrapper>
      </div>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
};

const DateFilter = styled.div`

flex: 1;
display: flex;
align-items: center;

.date-label{
  width: 65px;
}

`;



export default withTranslation()(Dashboard);
