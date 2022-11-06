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

.date-label{
  width: 65px;
}

`;



export default withTranslation()(Dashboard);
