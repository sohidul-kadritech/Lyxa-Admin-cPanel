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
import { TextField } from "@mui/material";
import styled from "styled-components";
import userIcon from "../../assets/images/dashboard/user.png";
import bottleIcon from "../../assets/images/dashboard/bottle.png";

const SellerInfo = () => {
  const {
    admin: { profile_photo, name, company_name, status, sellerType, addressSeller: { state, city, country }, phone_number },
  } = useSelector((state) => state.Login);

  return (
    <SellerInfoWrapper>
      <Row>
        <Col md={2} className="px-0 d-flex align-items-center justify-content-center">
          <div className="img_wrapper">
            <img
              className="rounded-circle avatar-xl cursor-pointer"
              alt="Seller"
              src={userIcon}
            />
            <i className="fas fa-pen cursor-pointer"></i>
          </div>
        </Col>
        <Col md={10}>
          <div className="d-flex align-items-center pb-1">
            <h5>
              Welcome, <span className="text-danger">{company_name}</span>{" "}
            </h5>
            <h6 className="text-capitalize mx-3">{`Status - ${status}`}</h6>
            <div className="text-capitalize">
              <img src={bottleIcon} alt="" /> <span>{sellerType}</span>{" "}
            </div>
          </div>
          <div className="info_wrapper">
            <i className="fas fa-map-marker-alt"></i>
            <span>{`${state},${city}, ${country}`}</span>
          </div>
          <div className="info_wrapper">
            <i className="fas fa-user-alt"></i>
            <span>{`${name} (Manager)`}</span>
          </div>
          <div className="info_wrapper">
            <i className="fas fa-phone-alt"></i>
            <span>{phone_number}</span>
          </div>

        </Col>
      </Row>
    </SellerInfoWrapper>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    dashboardData: { summery = {}, top_activity },
    startDate,
    endDate,
    loading,
  } = useSelector((state) => state.dashboardReducer);
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
              <CardBody
                style={{
                  boxShadow: "0 4px 2px -2px lightgray",
                  padding: "10px 15px",
                }}
              >
                <Row className="align-items-center">
                  <Col md={6}>
                    {account_type === "admin" ? (
                      <>
                        <h6 className="page-title text-danger">Dashboard</h6>
                        <ol className="breadcrumb m-0">
                          <li className="breadcrumb-item active">
                            Welcome to Lyxa Dashboard
                          </li>
                        </ol>
                      </>
                    ) : account_type === "seller" ? (
                      <SellerInfo />
                    ) : (
                      ""
                    )}
                  </Col>
                  <Col md={6}>
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
                            dispatch(
                              updateDashboardCardStartDate(e.target.value)
                            )
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
                <AdminDashboard summery={summery} topActivity={top_activity} />
              ) : account_type === "seller" ? (
                <SellerDashboard summery={summery} />
              ) : (
                <ShopDashboard summery={summery} />
              )}
            </div>
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

  .date-label {
    width: 65px;
  }
`;

const SellerInfoWrapper = styled.div`
  .img_wrapper {
    width: 90%;
    padding: 5px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      background-color: lightgray;
      padding: 5px;
    }
    .fa-pen {
      position: absolute;
      bottom: -5px;
      left: 39%;
      background-color: white;
      padding: 2px;
      border-radius: 11px;
      box-shadow: 0px 0px 0px 3px #f1f1f1;
    }
  }

  
    .text-capitalize {
      background-color: #f3f3f3;
      padding: 5px 13px;
      border-radius: 15px;
    }

    .info_wrapper{
      display: flex;
      padding-bottom: 8px;
      i{
        font-size: 20px;
        color: #e95b5b;
        margin-right: 10px;
      }
      span{
        font-size: 15px;
        text-transform: capitalize;
      }
    }
  
`;

export default withTranslation()(Dashboard);
