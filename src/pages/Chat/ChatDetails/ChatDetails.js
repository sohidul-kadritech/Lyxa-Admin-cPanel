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
import {
  acceptChatReq,
  closeConversation,
  rejectChatReq,
  sendMsgToUser,
} from "../../../store/chat/chatAction";
import { TextField, Tooltip } from "@mui/material";
import { SINGLE_CHAT } from "../../../network/Api";
import requestApi from "../../../network/httpRequest";
import ChatMessageTable from "../../../components/ChatMessageTable";
import { callApi } from "../../../components/SingleApiCall";
import SweetAlert from "react-bootstrap-sweetalert";

const ChatDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const history = useHistory();

  const { status, loading, selectedMsg } = useSelector(
    (state) => state.chatReducer
  );
  const { socket } = useSelector((state) => state.socketReducer);
  const { token } = JSON.parse(localStorage.getItem("admin"));

  const [request, setRequest] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState("");
  const [dynamic_description, setdynamic_description] = useState("");

  useEffect(() => {
    if (id) {
      getChatInfo()
        .then((data) => {
          setRequest(data);
          setIsLoading(false);
        })
        .catch((e) => history.push("/customer-support", { replace: true }));
    }
    return;
  }, [id]);

  const getChatInfo = async () => {
    setIsLoading(true);
    const data = await callApi(id, SINGLE_CHAT, "chatRequest");
    return data;
  };

  useEffect(() => {
    if (socket) {
      socket.on("user_message_sent", (data) => {
        console.log(data);
      });
    }
  }, [socket]);

  const sendMsg = () => {
    dispatch(
      sendMsgToUser({
        id,
        message,
      })
    );
  };

  // ACCEPT REQUEST

  const handleAccept = () => {
    // console.log(bannerId)
    dispatch(acceptChatReq(id));
  };

  useEffect(() => {
    if (request?.status === "accepted" || socket) {
      socket.emit("join_user_and_admin_chat", { room: id, data: { token } });
    }
    return;
  }, [request?.status, socket]);

  useEffect(() => {
    if (selectedMsg) {
      setMessage(selectedMsg);
      // var objDiv = document.getElementById("chatInfo");
      // objDiv.scrolll = objDiv.scrollHeight;
    }

    return;
  }, [selectedMsg]);

  useEffect(() => {
    if (status) {
      getChatInfo()
        .then((data) => {
          setRequest(data);
          setIsLoading(false);
        })
        .catch((e) => history.push("/customer-support", { replace: true }));
      setMessage("");
    }
  }, [status]);

  // CLOSE CONVERSATION ACTION

  const handleResolvedConversation = () => {
    dispatch(closeConversation(id));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            {success_dlg ? (
              <SweetAlert
                success
                title={dynamic_title}
                onConfirm={() => {
                  setsuccess_dlg(false);
                }}
              >
                {dynamic_description}
              </SweetAlert>
            ) : null}

            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Details"
              title="Customer Support"
              isRefresh={false}
            />

            <Row>
              <Col lg={6}>
                <Card className="card-height">
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-center">
                      <CardTitle>{`Conversion with ${
                        !request?.user?.name ? "" : request?.user?.name
                      }`}</CardTitle>
                      <div
                        className="d-flex align-items-center justify-content-between"
                        style={{ width: "190px" }}
                      >
                        <strong
                          style={{
                            color:
                              request?.status === "pending"
                                ? "blue"
                                : request?.status === "accepted"
                                ? "green"
                                : request?.status === "resolved"
                                ? "#42f5aa"
                                : "red",
                            fontSize: "15px",
                            textTransform: "uppercase",
                          }}
                        >
                          {request?.status}
                        </strong>
                        <Button
                          className="btn btn-success"
                          onClick={() => setconfirm_alert(true)}
                        >
                          Resolved
                        </Button>
                        {confirm_alert ? (
                          <SweetAlert
                            title="Are you sure?"
                            warning
                            showCancel
                            confirmButtonText="Yes, delete it!"
                            confirmBtnBsStyle="success"
                            cancelBtnBsStyle="danger"
                            onConfirm={() => {
                              handleResolvedConversation();
                              setconfirm_alert(false);
                              setsuccess_dlg(true);
                              setdynamic_title("Deleted");
                              setdynamic_description(
                                "Your file has been deleted."
                              );
                            }}
                            onCancel={() => setconfirm_alert(false)}
                          >
                            You won't be able to revert this!
                          </SweetAlert>
                        ) : null}
                      </div>
                    </div>
                    <hr />
                    {loading ||
                      (isLoading && (
                        <div className="text-center">
                          <Spinner animation="border" color="info" />
                        </div>
                      ))}

                    <div className="chat-conversation">
                      {request?.chats?.length > 0 && (
                        <SimpleBar
                          style={{ height: "235px", overflow: "hidden scroll" }}
                          id="chatInfo"
                        >
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
                                      <Tooltip title="See user details">
                                        <img
                                          src={request?.user?.profile_photo}
                                          className="avatar-xs rounded-circle cursor-pointer"
                                          alt="Admin"
                                          onClick={() =>
                                            history.push(
                                              `/users/details/${request?.user?._id}`
                                            )
                                          }
                                        />
                                      </Tooltip>
                                    </div>
                                    <div className="conversation-text color-primary">
                                      <div className="ctext-wrap">
                                        <strong>{chat?.message}.</strong>
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
                                        <strong>{chat?.message}.</strong>
                                      </div>
                                    </div>
                                  </li>
                                )}
                              </div>
                            ))}
                          </ul>
                        </SimpleBar>
                      )}

                      {request?.status === "pending" && (
                        <div className="text-center py-3">
                          <h5>Confirm Request or Reject!</h5>
                          <Button
                            color="primary"
                            outline={true}
                            onClick={handleAccept}
                          >
                            Accept
                          </Button>
                          <Button
                            color="danger"
                            onClick={() => dispatch(rejectChatReq(id))}
                            outline={true}
                            className="ms-3"
                          >
                            Reject
                          </Button>
                        </div>
                      )}

                      {request?.status === "accepted" && (
                        <Row
                          className="mt-3 py-1"
                          style={{
                            boxShadow: "1px 1px 3px 1px #cfcaca",
                            borderRadius: "5px",
                          }}
                        >
                          <Col md={10} className="chat-inputbar">
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
                          <Col md={2} className="chat-send">
                            <div className="d-flex align-items-center justify-content-end h-100">
                              <Button
                                onClick={sendMsg}
                                type="submit"
                                color="success"
                                className="btn-block"
                                disabled={loading}
                              >
                                {loading ? "Sending" : "Send"}
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={6}>
                <Card className="card-height">
                  <CardBody>
                    <div className=" w-100 pb-1">
                      <h4>Default Messages</h4>
                    </div>
                    <hr />

                    <Row>
                      <Col className="d-flex justify-content-between  align-items-center mt-5 mt-md-0">
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
                <CardTitle className="h4">Last 5 Orders</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table  table-hover text-center"
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
