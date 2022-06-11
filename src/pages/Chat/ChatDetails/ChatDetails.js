import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Input,
  Row,
  Spinner,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import user2 from "../../../assets/images/users/user-2.jpg";
import user3 from "../../../assets/images/users/user-3.jpg";
import user1 from "../../../assets/images/user1.jpg";

import SimpleBar from "simplebar-react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ChatDetails = () => {
  const { id } = useParams();

  const { requests } = useSelector((state) => state.chatReducer);

  const [request, setRequest] = useState(null);

  useEffect(() => {
    if (id) {
      const findReq = requests.find((item) => item._id == id);
      setRequest(findReq);
    }
  }, [id]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Details"
              title="Customer Support"
              isRefresh={false}
            />

            <Row>
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <div className='d-flex justify-content-between align-items-center'>
                    <CardTitle>Conversation</CardTitle>
                    <strong style={{color: request.status === 'pending' ? 'blue' :  request.status === 'accepted' ? 'green' : request?.status === 'resolved' ? '#42f5aa' : 'red', fontSize: '15px', textTransform: 'uppercase'}}>{request.status}</strong>
                    </div>
                    <hr />
                    <div className="chat-conversation">
                      <SimpleBar style={{ height: "330px" }}>
                        <ul
                          className="conversation-list"
                          data-simplebar
                          style={{
                            maxHeight: "300px",
                            width: "100%",
                          }}
                        >
                          {request?.chats?.map((chat, index, arr) => (
                            <div key={index}>
                              {chat?.type === "user" && (
                                <li className="clearfix">
                                  <div className="chat-avatar">
                                    <img
                                      src={user1}
                                      className="avatar-xs rounded-circle cursor-pointer"
                                      alt="Admin"
                                    />
                                  </div>
                                  <div className="conversation-text color-primary" >
                                    <div className="ctext-wrap">
                                      <span className="user-name">
                                        {request?.user?.name}
                                      </span>
                                      <strong>
                                         {chat?.message}.
                                      </strong>
                                    </div>
                                  </div>
                                </li>
                              )}

                              {chat?.type  === "admin" && (
                                <li className="clearfix odd">
                                  <div className="chat-avatar">
                                    <img
                                      src={user1}
                                      className="avatar-xs rounded-circle"
                                      alt="Admin"
                                    />
                                  </div>
                                  <div className="conversation-text">
                                    <div className="ctext-wrap">
                                      <span className="user-name">
                                        {request?.admin?.name}
                                      </span>
                                      <strong>
                                      {chat?.message}.
                                      </strong>
                                    </div>
                                  </div>
                                </li>
                              )}
                            </div>
                          ))}
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
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <Row>
                      <div className=" w-100 pb-1">
                        <h4>User Profile</h4>
                      </div>
                      <hr />
                    </Row>
                    <Row>
                      <Col
                      
                        className="d-flex justify-content-between  align-items-center mt-5 mt-md-0"
                      >
                        <div className="ps-4 w-100">
                          <Details>
                            <h5>Name:</h5>
                            <Value>{request?.user?.name}</Value>
                          </Details>
                          <Details>
                            <h5>Gmail:</h5>
                            <Value>{request?.user?.email}</Value>
                          </Details>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4">Last 5 Order</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Order Id</Th>
                      <Th>Delivery Address</Th>
                      <Th>Status</Th>
                      <Th>Payment Status</Th>
                      <Th>Total Amount</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {/* {orders.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th>{item?.orderId}</Th>

                          <Td style={{ maxWidth: "120px" }}>
                            {item?.orderDeliveryAddress?.address}
                          </Td>
                          <Td>{item?.orderStatus}</Td>
                          <Td>{item?.paymentStatus}</Td>
                          <Td>{item.summery?.total}</Td>
                          <Td>
                            <div>
                              <Tooltip title="Details">
                                <button
                                  className="btn btn-info button me-2"
                                  onClick={() => {
                                    history.push(`/orders/details/${item._id}`);
                                  }}
                                >
                                  <i className="fa fa-eye" />
                                </button>
                              </Tooltip>
                            </div>
                          </Td>
                        </Tr>
                      );
                    })} */}
                  </Tbody>
                </Table>
                {/* {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="success" />
                  </div>
                )}
                {!loading && orders.length < 1 && (
                  <div className="text-center">
                    <h4>No Order!</h4>
                  </div>
                )} */}
              </CardBody>
            </Card>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

const Details = styled.div`
  display: flex;
  /* justify-content: space-between; */
`;

const Value = styled.h5`
  color: lightcoral;
  font-style: italic;
  font-weight: 500;
  margin-left: 4px;
  /* padding-left: 5px; */
`;

export default ChatDetails;
