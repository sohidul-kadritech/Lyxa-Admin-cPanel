import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import styled from "styled-components";
import SimpleBar from "simplebar-react";
import user2 from "../../../assets/images/users/user-2.jpg";
import user3 from "../../../assets/images/users/user-3.jpg";
import smimg1 from "../../../assets/images/small/img-1.jpg";
import smimg2 from "../../../assets/images/small/img-2.jpg";

const OrderDetails = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Details"}
              title="Order"
              // loading={loading}
              // callList={callShopList}
            />
            <Row>
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <CardTitle>Order Timeline</CardTitle>
                    <hr />
                    <Timeline position="alternate">
                      {[1, 2, 3, 4, 5].map((item, index) => (
                        <TimelineItem key={index}>
                          <TimelineSeparator
                            style={{
                              display:
                                index === [1, 2, 3, 4, 5].length - 1 && "none",
                            }}
                          >
                            <TimelineDot color="secondary" />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Item</TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <CardTitle>Conversation(User & Delivery Body)</CardTitle>
                    <hr />
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

                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default OrderDetails;
