import PropTypes from "prop-types";
import React, { useState } from "react";
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
import OrdersGraph from "../../components/OrdersGraph";
import EarningsGraph from "../../components/EarningsGraph";
import UsersGraph from "../../components/UsersGraph";
import { TextField } from "@mui/material";
import styled from "styled-components";
import riderIcon from "../../assets/images/dashboard/rider.png";
import availableRiderIcon from "../../assets/images/dashboard/available-rider.png";
import activeRiderIcon from "../../assets/images/dashboard/active-rider.png";
import timerIcon from "../../assets/images/dashboard/timer.png";
import amountIcon from "../../assets/images/dashboard/amount.png";
import cashInHandIcon from "../../assets/images/dashboard/cash-in-hand.png";
import DashboardCard from "../../components/DashboardCard";

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

            {/* {account_type === "admin" && (
              <Row>
                <Col md={4}>
                  
                </Col>
                <Col md={4}>
                  <Card>
                    <CardBody>
                      <CardTitle>Top Shops</CardTitle>
                      <hr />
                      <CardBody>
                        <TopLists list={top_activity?.topShop} type='shop' />
                      </CardBody>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <CardBody>
                      <CardTitle>Top Delivery Boys</CardTitle>
                      <hr />
                      <CardBody>
                        <TopLists list={top_activity?.topDeliveryBoy} type='deliveryBoy' />
                      </CardBody>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )} */}
            {account_type === "admin" && (
              <Row>
                <Col md={9}>
                  <UsersGraph />
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
                    <DashboardCard title="Delivery Boy's" value={summery?.totalDeliveryBoy} icon={riderIcon} />
                  </Col>
                  <Col xl={4} >
                    <DashboardCard title='Active Riders' value={summery?.totalActiveDeliveryBoy} icon={availableRiderIcon} />
                  </Col>

                  <Col xl={4} >
                    <DashboardCard title='Available Riders' value={summery?.totalAvailableDeliveryBoy} icon={activeRiderIcon} />
                  </Col>

                </Row>
                <Row>
                  <Col xl={4}>
                    <DashboardCard title='Riders Unsettled Amount' value={`${summery?.deliveryBoyUnsettleAmount ?? 0} NGN`} icon={amountIcon} />
                  </Col>
                  <Col xl={4}>
                    <DashboardCard title='Riders cash in hands' value={`${summery?.chashInHandDeliveryBoy ?? 0} NGN`} icon={cashInHandIcon} />
                  </Col>
                  <Col xl={4}>
                    <DashboardCard title='Avarage delivery time' value={`${summery?.totalAveratgeDeliveredTime?.toFixed(2)} Min`} icon={timerIcon} />
                  </Col>
                </Row>
              </Col>
            </Row>}

            <Row>
              <Col md={9}>
                <OrdersGraph />
              </Col>

              <Col md={3}>
                <TopLists list={top_activity?.topShop} type='shop' />
              </Col>

            </Row>

            <Row>
              <Col>
                <EarningsGraph />
              </Col>
            </Row>
            {/* <Row>
              <Col xl={3}>
                <Card>
                  <CardBody>
                    <h4 className="card-title mb-4">Sales Report</h4>
                    <div className="cleafix">
                      <p className="float-start">
                        <i className="mdi mdi-calendar me-1 text-primary"></i> Jan
                        01 - Jan 31
                      </p>
                      <h5 className="font-18 text-end">$4230</h5>
                    </div>
                    <div id="ct-donut" className="ct-chart wid pt-4">
                      <Salesdonut />
                    </div>
                    <div className="mt-4">
                      <table className="table mb-0">
                        <tbody>
                          <tr>
                            <td>
                              <span className="badge bg-primary">Desk</span>
                            </td>
                            <td>Desktop</td>
                            <td className="text-end">54.5%</td>
                          </tr>
                          <tr>
                            <td>
                              <span className="badge bg-success">Mob</span>
                            </td>
                            <td>Mobile</td>
                            <td className="text-end">28.0%</td>
                          </tr>
                          <tr>
                            <td>
                              <span className="badge bg-warning">Tab</span>
                            </td>
                            <td>Tablets</td>
                            <td className="text-end">17.5%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xl={4}>
                <Card>
                  <CardBody>
                    <h4 className="card-title mb-4">Activity</h4>
                    <ol className="activity-feed">
                      <li className="feed-item">
                        <div className="feed-item-list">
                          <span className="date">Jan 22</span>
                          <span className="activity-text">
                            Responded to need “Volunteer Activities”
                          </span>
                        </div>
                      </li>
                      <li className="feed-item">
                        <div className="feed-item-list">
                          <span className="date">Jan 20</span>
                          <span className="activity-text">
                            At vero eos et accusamus et iusto odio dignissimos
                            ducimus qui deleniti atque...
                            <Link to="#" className="text-success">
                              Read more
                            </Link>
                          </span>
                        </div>
                      </li>
                      <li className="feed-item">
                        <div className="feed-item-list">
                          <span className="date">Jan 19</span>
                          <span className="activity-text">
                            Joined the group “Boardsmanship Forum”
                          </span>
                        </div>
                      </li>
                      <li className="feed-item">
                        <div className="feed-item-list">
                          <span className="date">Jan 17</span>
                          <span className="activity-text">
                            Responded to need “In-Kind Opportunity”
                          </span>
                        </div>
                      </li>
                      <li className="feed-item">
                        <div className="feed-item-list">
                          <span className="date">Jan 16</span>
                          <span className="activity-text">
                            Sed ut perspiciatis unde omnis iste natus error sit
                            rem.
                          </span>
                        </div>
                      </li>
                    </ol>
                    <div className="text-center">
                      <Link to="#" className="btn btn-primary">
                        Load More
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={5}>
                <Row>
                  <Col md={6}>
                    <Card className="text-center">
                      <CardBody>
                        <div className="py-4">
                          <i className="ion ion-ios-checkmark-circle-outline display-4 text-success"></i>

                          <h5 className="text-primary mt-4">Order Successful</h5>
                          <p className="text-muted">
                            Thanks you so much for your order.
                          </p>
                          <div className="mt-4">
                            <Link to="" className="btn btn-primary btn-sm">
                              Chack Status
                            </Link>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="bg-primary">
                      <CardBody>
                        <div className="text-center text-white py-4">
                          <h5 className="mt-0 mb-4 text-white-50 font-size-16">
                            Top Product Sale
                          </h5>
                          <h1>1452</h1>
                          <p className="font-size-14 pt-1">Computer</p>
                          <p className="text-white-50 mb-0">
                            At solmen va esser necessi far uniform myth...{" "}
                            <Link to="#" className="text-white">
                              View more
                            </Link>
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Card>
                      <CardBody>
                        <h4 className="card-title mb-4">Client Reviews</h4>
                        <p className="text-muted mb-3 pb-4">
                          " Everyone realizes why a new common language would be
                          desirable one could refuse to pay expensive translators
                          it would be necessary. "
                        </p>
                        <div className="float-end mt-2">
                          <Link to="#" className="text-primary">
                            <i className="mdi mdi-arrow-right h5"></i>
                          </Link>
                        </div>
                        <h6 className="mb-0">
                          {" "}
                          <img
                            src={user3}
                            alt=""
                            className="avatar-sm rounded-circle me-2"
                          />{" "}
                          James Athey
                        </h6>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row> */}

            {/* <Row>
              <Col xl={8}>
                <Card>
                  <CardBody>
                    <h4 className="card-title mb-4">Latest Transaction</h4>
                    <div className="table-responsive">
                      <table className="table table-hover table-centered table-nowrap mb-0">
                        <thead>
                          <tr>
                            <th scope="col">(#) Id</th>
                            <th scope="col">Name</th>
                            <th scope="col">Date</th>
                            <th scope="col">Amount</th>
                            <th scope="col" colSpan="2">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">#14256</th>
                            <td>
                              <div>
                                <img
                                  src={user2}
                                  alt=""
                                  className="avatar-xs rounded-circle me-2"
                                />{" "}
                                Philip Smead
                              </div>
                            </td>
                            <td>15/1/2018</td>
                            <td>$94</td>
                            <td>
                              <span className="badge bg-success">
                                Delivered
                              </span>
                            </td>
                            <td>
                              <div>
                                <Link to="#" className="btn btn-primary btn-sm">
                                  Edit
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">#14257</th>
                            <td>
                              <div>
                                <img
                                  src={user3}
                                  alt=""
                                  className="avatar-xs rounded-circle me-2"
                                />{" "}
                                Brent Shipley
                              </div>
                            </td>
                            <td>16/1/2019</td>
                            <td>$112</td>
                            <td>
                              <span className="badge bg-warning">Pending</span>
                            </td>
                            <td>
                              <div>
                                <Link to="#" className="btn btn-primary btn-sm">
                                  Edit
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">#14258</th>
                            <td>
                              <div>
                                <img
                                  src={user4}
                                  alt=""
                                  className="avatar-xs rounded-circle me-2"
                                />{" "}
                                Robert Sitton
                              </div>
                            </td>
                            <td>17/1/2019</td>
                            <td>$116</td>
                            <td>
                              <span className="badge bg-success">
                                Delivered
                              </span>
                            </td>
                            <td>
                              <div>
                                <Link to="#" className="btn btn-primary btn-sm">
                                  Edit
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">#14259</th>
                            <td>
                              <div>
                                <img
                                  src={user5}
                                  alt=""
                                  className="avatar-xs rounded-circle me-2"
                                />{" "}
                                Alberto Jackson
                              </div>
                            </td>
                            <td>18/1/2019</td>
                            <td>$109</td>
                            <td>
                              <span className="badge bg-danger">Cancel</span>
                            </td>
                            <td>
                              <div>
                                <Link to="#" className="btn btn-primary btn-sm">
                                  Edit
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">#14260</th>
                            <td>
                              <div>
                                <img
                                  src={user6}
                                  alt=""
                                  className="avatar-xs rounded-circle me-2"
                                />{" "}
                                David Sanchez
                              </div>
                            </td>
                            <td>19/1/2019</td>
                            <td>$120</td>
                            <td>
                              <span className="badge bg-success">
                                Delivered
                              </span>
                            </td>
                            <td>
                              <div>
                                <Link to="#" className="btn btn-primary btn-sm">
                                  Edit
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">#14261</th>
                            <td>
                              <div>
                                <img
                                  src={user2}
                                  alt=""
                                  className="avatar-xs rounded-circle me-2"
                                />{" "}
                                Philip Smead
                              </div>
                            </td>
                            <td>15/1/2018</td>
                            <td>$94</td>
                            <td>
                              <span className="badge bg-warning">Pending</span>
                            </td>
                            <td>
                              <div>
                                <Link to="#" className="btn btn-primary btn-sm">
                                  Edit
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xl={4}>
                <Card>
                  <CardBody>
                    <h4 className="card-title mb-4">Chat</h4>
                    <div className="chat-conversation">
                      <SimpleBar style={{ height: "365px" }}>
                        <ul
                          className="conversation-list"
                          data-simplebar
                          style={{ maxHeight: "367px" }}
                        >
                          <li className="clearfix">
                            <div className="chat-avatar">
                              <img
                                src={user2}
                                className="avatar-xs rounded-circle"
                                alt="male"
                              />
                              <span className="time">10:00</span>
                            </div>
                            <div className="conversation-text">
                              <div className="ctext-wrap">
                                <span className="user-name">John Deo</span>
                                <p>Hello!</p>
                              </div>
                            </div>
                          </li>
                          <li className="clearfix odd">
                            <div className="chat-avatar">
                              <img
                                src={user3}
                                className="avatar-xs rounded-circle"
                                alt="Female"
                              />
                              <span className="time">10:01</span>
                            </div>
                            <div className="conversation-text">
                              <div className="ctext-wrap">
                                <span className="user-name">Smith</span>
                                <p>
                                  Hi, How are you? What about our next meeting?
                                </p>
                              </div>
                            </div>
                          </li>
                          <li className="clearfix">
                            <div className="chat-avatar">
                              <img
                                src={user2}
                                className="avatar-xs rounded-circle"
                                alt="male"
                              />
                              <span className="time">10:04</span>
                            </div>
                            <div className="conversation-text">
                              <div className="ctext-wrap">
                                <span className="user-name">John Deo</span>
                                <p>Yeah everything is fine</p>
                              </div>
                            </div>
                          </li>
                          <li className="clearfix odd">
                            <div className="chat-avatar">
                              <img
                                src={user3}
                                className="avatar-xs rounded-circle"
                                alt="male"
                              />
                              <span className="time">10:05</span>
                            </div>
                            <div className="conversation-text">
                              <div className="ctext-wrap">
                                <span className="user-name">Smith</span>
                                <p>Wow that's great</p>
                              </div>
                            </div>
                          </li>
                          <li className="clearfix odd">
                            <div className="chat-avatar">
                              <img
                                src={user3}
                                className="avatar-xs rounded-circle"
                                alt="male"
                              />
                              <span className="time">10:08</span>
                            </div>
                            <div className="conversation-text">
                              <div className="ctext-wrap">
                                <span className="user-name mb-2">Smith</span>

                                <img
                                  src={smimg1}
                                  alt=""
                                  height="48"
                                  className="rounded me-2"
                                />
                                <img
                                  src={smimg2}
                                  alt=""
                                  height="48"
                                  className="rounded"
                                />
                              </div>
                            </div>
                          </li>
                        </ul>
                      </SimpleBar>

                      <Row className="mt-3 pt-1">
                        <Col md="9" className="chat-inputbar col-8">
                          <Input
                            type="text"
                            className="chat-input"
                            placeholder="Enter your text"
                          />
                        </Col>
                        <Col md="3" className="chat-send col-4">
                          <div className="d-grid">
                            <Button
                              type="submit"
                              color="success"
                              className="btn-block"
                            >
                              Send
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row> */}
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
