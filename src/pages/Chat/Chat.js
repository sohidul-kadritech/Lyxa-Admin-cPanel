import React, { useState } from "react";
import { Button, Card, CardBody, Col, Container, Input, Row } from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import GlobalWrapper from "../../components/GlobalWrapper";
import { Box, Tab, TabPanelUnstyled, Tabs, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";

import SimpleBar from "simplebar-react";
import user2 from "../../assets/images/users/user-2.jpg";
import user3 from "../../assets/images/users/user-3.jpg";
import smimg1 from "../../assets/images/small/img-1.jpg";
import smimg2 from "../../assets/images/small/img-2.jpg";

const Chat = () => {
  const [chatValue, setChatValue] = useState(0);
  const [chatValue2, setChatValue2] = useState(0);

  const handleChange = (event, newValue) => {
    setChatValue(newValue);
  };

  const changeValue = (event, newValue) => {
    setChatValue2(newValue);
  };

  // Chat TAB PANEL

  const ChatListTabPanel = (props) => {
    const { children, value, index, ...other } = props;
    console.log({ children, value, index, ...other });
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

  // CHAT RIGHT SIDE PANEL

  const ChatDetailsTabPanel = (props) => {
    const { children, value, index, ...other } = props;
    console.log({ children, value, index, ...other });
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Customer Support"
              isRefresh={false}
              //   loading={loading}
              //   callList={callColorList}
            />
            <Row>
              <Col xl={6}>
                <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
                  <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
                    <Tabs
                      value={chatValue}
                      onChange={handleChange}
                      indicatorColor="primary"
                      variant="fullWidth"
                      aria-label="full width tabs example"
                    >
                      <Tab
                        icon={<SendIcon />}
                        iconPosition="start"
                        label="New"
                      />

                      <Tab
                        icon={<ChatIcon />}
                        iconPosition="start"
                        label="On Going"
                      />
                      <Tab
                        icon={<MarkChatReadIcon />}
                        iconPosition="start"
                        label="Resolved"
                      />
                    </Tabs>
                  </Box>
                  <ChatListTabPanel value={chatValue} index={0}>
                    {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between mb-2 cursor-pointer"
                      >
                        <div>
                          <img
                            src={user3}
                            className="avatar-xs rounded-circle me-1"
                            alt="male"
                          />
                          <span>Jhon Doe</span>
                        </div>
                        <span>need support</span>
                        <span>05-06-2022</span>
                      </div>
                    ))}
                  </ChatListTabPanel>
                  <ChatListTabPanel value={chatValue} index={1}>
                  {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between mb-2 cursor-pointer"
                      >
                        <div>
                          <img
                            src={user3}
                            className="avatar-xs rounded-circle me-1"
                            alt="male"
                          />
                          <span>Jhon Doe</span>
                        </div>
                        <span>need support</span>
                        <span>05-06-2022</span>
                      </div>
                    ))}
                  </ChatListTabPanel>
                  <ChatListTabPanel value={chatValue} index={2}>
                  {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between mb-2 cursor-pointer"
                      >
                        <div>
                          <img
                            src={user3}
                            className="avatar-xs rounded-circle me-1"
                            alt="male"
                          />
                          <span>Jhon Doe</span>
                        </div>
                        <span>need support</span>
                        <span>05-06-2022</span>
                      </div>
                    ))}
                  </ChatListTabPanel>
                </Box>
              </Col>
              <Col xl={6} className="mt-3 mt-xl-0">
                <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
                  <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
                    <Tabs
                      value={chatValue2}
                      onChange={changeValue}
                      indicatorColor="primary"
                      variant="fullWidth"
                      aria-label="full width tabs example"
                    >
                      <Tab
                        // icon={<SendIcon />}
                        //  iconPosition="start"
                        label="Conversation"
                      />

                      <Tab
                        // icon={<ChatIcon />}
                        // iconPosition="start"
                        label="Profile"
                      />
                      <Tab
                        // icon={<MarkChatReadIcon />}
                        // iconPosition="start"
                        label="Last Order"
                      />
                      <Tab
                        // icon={<MarkChatReadIcon />}
                        // iconPosition="start"
                        label="Last 5 Order"
                      />
                    </Tabs>
                  </Box>
                  <ChatDetailsTabPanel value={chatValue2} index={0}>
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
                  </ChatDetailsTabPanel>
                  <ChatDetailsTabPanel value={chatValue2} index={1}>
                    <div className="d-flex">
                      <div>
                        <img
                          className="rounded-circle avatar-xl cursor-pointer"
                          alt="partner"
                          src={user2}
                        />
                      </div>
                      <div className="ps-4 ">
                        <div className="d-flex align-items-center">
                          <h5>Name:</h5>
                          <span>Shuvo</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <h5>Phone:</h5>
                          <span>01537457618</span>
                        </div>
                      </div>
                    </div>
                  </ChatDetailsTabPanel>
                  <ChatDetailsTabPanel value={chatValue2} index={2}>
                    Last Order
                  </ChatDetailsTabPanel>
                  <ChatDetailsTabPanel value={chatValue2} index={3}>
                    Last 5 Order
                  </ChatDetailsTabPanel>
                </Box>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default Chat;
