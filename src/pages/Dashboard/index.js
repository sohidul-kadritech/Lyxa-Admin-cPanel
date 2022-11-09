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
import gmailIcon from "../../assets/images/dashboard/@.png";

import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import MopedOutlinedIcon from '@mui/icons-material/MopedOutlined';
import SettingsInputSvideoIcon from '@mui/icons-material/SettingsInputSvideo';
import PaymentIcon from '@mui/icons-material/Payment';

const Info = ({ value, Icon }) => {
  return (
    <div className="info_wrapper">
      <Icon className="text-danger" />
      <span className="value">{value}</span>
    </div>
  );
};

const SellerInfo = () => {
  const {
    admin: {
      profile_photo,
      name,
      company_name,
      status,
      sellerType,
      addressSeller: { state, city, country },
      phone_number,
      gmail,
    },
  } = useSelector((state) => state.Login);

  return (
    <InfoWrapper>
      <Row>
        <Col
          md={2}
          className="px-0 d-flex align-items-center justify-content-center"
        >
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
              Welcome, <span className="text-danger">{company_name}</span>
            </h5>
            <h6 className="text-capitalize mx-3">{`Status - ${status}`}</h6>
            <h6 className="text-capitalize mx-3">{sellerType}</h6>
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
          <Info value={gmail} icon={gmailIcon} />
        </Col>
      </Row>
    </InfoWrapper>
  );
};

const ShopInfo = () => {
  const {
    admin: {
      shopLogo,
      shopStatus,
      shopType,
      isFeatured,
      cuisineType,
      shopName,
      phone_number,
      shopStartTimeText,
      shopEndTimeText,
      email,
      rating,
      minOrderAmount,
      expensive,
      haveOwnDeliveryBoy,
      deliveryFee,
      deals,
    },
  } = useSelector((state) => state.Login);

  return (
    <InfoWrapper>
      <Row>
        <Col md={1} className="px-0">
          <div className="img_wrapper p-0 w-100">
            <img
              className="rounded-circle avatar-xl cursor-pointer"
              alt="Seller"
              src={shopLogo}
            />
          </div>
        </Col>
        <Col md={11}>
          <div className="d-flex align-items-center pb-1">
            <h5>
              Welcome, <span className="text-danger me-2">{shopName}</span>
            </h5>
            <h6 className="text-capitalize me-1">{`Status - ${shopStatus}`}</h6>
            <h6 className="text-capitalize me-1">{shopType}</h6>
            <h6 className="text-capitalize me-1">{`Featured - ${isFeatured ? "Yes" : "No"
              }`}</h6>
            <h6 className="text-capitalize me-1">{`Cuisines - ${cuisineType.length > 0 ? cuisineType[0] : "N/A"
              }`}</h6>
          </div>

          <Row className="pt-2">
            <Col lg={6}>
              <Info value={"location"} Icon={RoomOutlinedIcon} />
              <Info
                value={`Mon to Fri - ${shopStartTimeText} ${shopStartTimeText.split(":")[0] < 12 ? "AM" : "PM"
                  } - ${shopEndTimeText} ${shopEndTimeText.split(":")[0] < 12 ? "AM" : "PM"
                  }`}
                Icon={AccessTimeOutlinedIcon}
              />
              <Info value={phone_number} Icon={LocalPhoneOutlinedIcon} />
              <Info value={email} Icon={AlternateEmailOutlinedIcon} />
            </Col>


            <Col lg={3}>

              <Info
                value={`${minOrderAmount} NGN`}
                Icon={StorefrontOutlinedIcon}
              />
              <Info
                value={`${rating === 4
                  ? "Excellent"
                  : rating === 3
                    ? "Very good"
                    : rating === 2
                      ? "Good"
                      : rating === 1
                        ? "Bad"
                        : ""
                  } (Rating)`}
                Icon={SentimentSatisfiedOutlinedIcon}
              />
              <Info
                value={`${minOrderAmount} NGN`}
                Icon={WorkHistoryOutlinedIcon}
              />
              <Info
                value={`${expensive === 1
                  ? "$"
                  : expensive === 2
                    ? "$$"
                    : expensive === "3"
                      ? "$$$"
                      : "$$$$"
                  } (Price Range)`}
                Icon={WorkHistoryOutlinedIcon}
              />
            </Col>

            <Col lg={3}>
              {/* <Info value={`${}`} Icon={ViewInArOutlinedIcon} /> */}
              <Info value={`${haveOwnDeliveryBoy ? 'Self' : 'Drop'} (Delivery Type)`} Icon={PaymentIcon} />
              <Info
                value={`${deliveryFee} (Delivery Fee)`}
                Icon={MopedOutlinedIcon}
              />
              <Info
                value={`${deals.length > 0 ? deals[0] : 0} (Deals)`}
                Icon={SettingsInputSvideoIcon}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </InfoWrapper>
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
                  <Col md={account_type === "shop" ? 9 : 6}>
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
                      <ShopInfo />
                    )}
                  </Col>
                  <Col md={account_type === "shop" ? 3 : 6}>
                    <div
                      className={`d-flex ${account_type === "shop" && "flex-column"
                        }`}
                    >
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
                      <DateFilter
                        className={`${account_type !== "shop" && "ps-3"}`}
                      >
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

const InfoWrapper = styled.div`
  .img_wrapper {
    width: 90%;
    padding: 5px;
    height: 70px;
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
    margin-bottom: 0 !important;
  }

  .info_wrapper {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    .img {
      font-size: 20px;
      color: #e95b5b;
      margin-right: 10px;
    }
    .value {
      font-size: 14px;
      text-transform: capitalize;
      font-weight: 400;
    }
  }
`;

export default withTranslation()(Dashboard);
