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

import user1 from "../../../assets/images/user1.jpg";

import SimpleBar from "simplebar-react";
import styled from "styled-components";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { acceptChatReq, rejectChatReq, sendMsgToUser } from "../../../store/chat/chatAction";
import { TextField, Tooltip } from "@mui/material";
import { SINGLE_CHAT } from "../../../network/Api";
import requestApi from "../../../network/httpRequest";
import ChatMessageTable from "../../../components/ChatMessageTable";

const ChatDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const history = useHistory();

  const { chatRequests, status, msgSendSuccess, loading, selectedMsg } = useSelector((state) => state.chatReducer);
  const { socket } = useSelector((state) => state.socketReducer);
  const { token } = JSON.parse(localStorage.getItem("admin"));

  const [request, setRequest] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      // const findReq = chatRequests.find((item) => item._id == id);

      // if (findReq) {
      //   setRequest(findReq);
      // } else {


      // }

      callApi(id);

    }
  }, [id]);

  const callApi = async (chatId) => {
    const { data } = await requestApi().request(SINGLE_CHAT, {
      params: {
        id: chatId,
      },
    });

    if (data.status) {
      const { chatRequest } = data.data;
      if (chatRequest) {

        setRequest(chatRequest);
      } else {
        history.push("/customer-support", { replace: true });
      }
    }
  };

  useEffect(() => {

    if (socket && request) {
      socket.on('user_and_admin_chat_send_admin', (data) => {
        console.log(data)
      });
    }
  }, [socket])


  useEffect(() => {

    if (socket && request) {
      socket.on('user_and_admin_chat_send_admin', (data) => {
        console.log(data)
      });
    }
  }, [socket])


  const sendMsg = () => {
    dispatch(sendMsgToUser({
      id,
      message
    }))
  }

  // ACCEPT REQUEST

  const handleAccept = () => {
    // console.log(bannerId)
    dispatch(acceptChatReq(id));
  };

  useEffect(() => {
    if (request?.status === 'accepted' && socket) {
      socket.emit('join_user_and_admin_chat', { room: id, data: { token } });
    }
    return;
  }, [request?.status])

  useEffect(() => {
    if (selectedMsg) {
      setMessage(selectedMsg);
    }

    return;
  }, [selectedMsg])

  useEffect(() => {
    if (status) {

      callApi(id);
      setMessage("")
    }
  }, [status]);

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
                      <CardTitle>{`Conversion with ${request?.user?.name}`}</CardTitle>
                      <strong style={{ color: request?.status === 'pending' ? 'blue' : request?.status === 'accepted' ? 'green' : request?.status === 'resolved' ? '#42f5aa' : 'red', fontSize: '15px', textTransform: 'uppercase' }}>{request?.status}</strong>
                    </div>
                    <hr />
                    <div className="chat-conversation">
                      <SimpleBar style={{ height: "235px", overflow: 'hidden scroll' }}>
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
                                    <Tooltip title='See user details'>
                                      <img
                                        src={user1}
                                        className="avatar-xs rounded-circle cursor-pointer"
                                        alt="Admin"
                                        onClick={() => history.push(`/users/details/${request?.user?._id}`)}
                                      />
                                    </Tooltip>
                                  </div>
                                  <div className="conversation-text color-primary" >
                                    <div className="ctext-wrap">

                                      <strong>
                                        {chat?.message}.
                                      </strong>
                                    </div>
                                  </div>
                                </li>
                              )}

                              {chat?.type === "admin" && (
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
                      {request?.status === 'pending' && (
                        <div className="text-center py-3">
                          <h5>Confirm Request or Reject!</h5>
                          <Button color='primary' outline={true} onClick={handleAccept}>Accept</Button>
                          <Button color='danger' onClick={() => dispatch(rejectChatReq(id))} outline={true} className='ms-3'>Reject</Button>
                        </div>
                      )}

                      {request?.status === 'accepted' && <Row className="mt-3 pt-1">
                        <Col md={9} className="chat-inputbar">
                          <TextField
                            id="standard-multiline-flexible"
                            label="Message"
                            multiline
                            variant="standard"
                            className="chat-input w-100"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </Col>
                        <Col md={3} className="chat-send">
                          <div className="d-grid">
                            <Button
                              onClick={sendMsg}
                              type="submit"
                              color="success"
                              className="btn-block"
                              disabled={loading}
                            >
                              {loading ? 'Sending' : 'Send'}
                            </Button>
                          </div>
                        </Col>
                      </Row>}
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={6}>
                <Card className="card-height">
                  <CardBody>

                    <div className=" w-100 pb-1">
                      <h4>Default chat</h4>
                    </div>
                    <hr />

                    <Row>
                      <Col

                        className="d-flex justify-content-between  align-items-center mt-5 mt-md-0"
                      >
                        <div className="ps-4 w-100">
                          <ChatMessageTable isFromChat={true} />
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
                    {request?.orders?.map((item, index) => {
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
                          <Td>{item?.summery?.totalAmount}</Td>
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
                    })}
                  </Tbody>
                </Table>
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="success" />
                  </div>
                )}
                {!loading && request?.orders?.length < 1 && (
                  <div className="text-center">
                    <h4>No Order!</h4>
                  </div>
                )}
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
