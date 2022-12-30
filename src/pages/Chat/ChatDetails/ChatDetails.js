import React, { useEffect, useRef, useState } from "react";
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
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptChatReq,
  closeConversation,
  rejectChatReq,
  sendMsgToUser,
  setChatStatusFalse,
} from "../../../store/chat/chatAction";
import { TextField, Tooltip } from "@mui/material";
import { SINGLE_CHAT } from "../../../network/Api";
import ChatMessageTable from "../../../components/ChatMessageTable";
import { callApi } from "../../../components/SingleApiCall";
import SweetAlert from "react-bootstrap-sweetalert";
import requestApi from "../../../network/httpRequest";
import { useMemo } from "react";

const ChatDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const history = useHistory();
  const { search } = useLocation();
  const bottomRef = useRef(null);
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const { status, loading, selectedMsg, isSendingMsg, isChatClose } =
    useSelector((state) => state.chatReducer);
  const { socket } = useSelector((state) => state.socketReducer);
  const { token } = JSON.parse(localStorage.getItem("admin"));

  const [request, setRequest] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState("");
  const [dynamic_description, setdynamic_description] = useState("");
  const [chatStatus, setChatStatus] = useState("");

  useEffect(() => {
    if (id) {
      setIsLoading(true);

      // const findChat = chatRequests.find((chat) => chat?._id === id);

      // if (findChat) {
      //   setIsLoading(false);
      //   setRequest(findChat);
      // } else {

      // }

      dispatch(setChatStatusFalse());
      const status = searchParams.get("status");
      setChatStatus(status);

      callApi(id);
    }
    return;
  }, [id]);

  const callApi = async (orderId) => {
    try {
      const { data } = await requestApi().request(SINGLE_CHAT, {
        params: {
          orderId,
        },
      });

      if (data.status) {
        setIsLoading(false);
        setRequest(data?.data?.chats);
        scrollToBottom();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  // SOCKET

  useEffect(() => {
    if (socket) {
      socket.on("user_message_sent", (data) => {
        setRequest((prev) => [...prev, data]);
        scrollToBottom();
      });

      socket.on("chat-close", () => {
        setChatStatus("closed");
      });
    }
    return;
  }, [socket]);

  // SENT MESSAGE TO USER
  const sendMsg = () => {
    const requestId = request?.at(-1)?.adminChatRequest?._id;
    dispatch(
      sendMsgToUser({
        id: requestId,
        message,
      })
    );
  };

  // ACCEPT REQUEST

  // const handleAccept = () => {
  //   dispatch(acceptChatReq(id));
  // };

  //  JOIN TO THE CHAT ROOM

  useEffect(() => {
    if (chatStatus === "accepted" && socket) {
      socket.emit("join_user_and_admin_chat", { room: id, data: { token } });
    }
    return;
  }, [chatStatus, socket]);

  useEffect(() => {
    if (selectedMsg) {
      setMessage(selectedMsg);
    }

    return;
  }, [selectedMsg]);

  useEffect(() => {
    if (status) {
      (async function getSingleChat() {
        const data = await callApi(id, SINGLE_CHAT, "chatRequest");
        if (data) {
          setRequest(data);
        }
      })();

      setMessage("");
    }
  }, [status]);

  // CLOSE CONVERSATION ACTION

  const handleClosedConversation = () => {
    const requestId = request?.at(-1)?.adminChatRequest?._id;

    dispatch(closeConversation(requestId));
  };

  useEffect(() => {
    if (isChatClose) {
      setChatStatus("closed");
    }
    if (!isSendingMsg) {
      scrollToBottom();
    }
    // return () => {
    //   setChatStatus("");
    // };
  }, [isChatClose, isSendingMsg]);

  // Scroll to Bottom

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
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
              maintitle="Lyxa"
              breadcrumbItem="Details"
              title="Single Query"
              isRefresh={false}
            />

            <Row>
              <Col lg={6}>
                <Card style={{ height: "450px" }}>
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-center">
                      <CardTitle>{`Conversion with ${
                        !request[0]?.user?.name ? "" : request[0]?.user?.name
                      }`}</CardTitle>
                      {(loading || isLoading) && (
                        <div className="text-center">
                          <Spinner animation="border" color="info" />
                        </div>
                      )}
                      <div
                        className={`d-flex align-items-center ${
                          request?.status === "accepted"
                            ? "justify-content-between"
                            : "justify-content-end"
                        }`}
                        style={{ width: "190px" }}
                      >
                        <strong
                          style={{
                            color:
                              chatStatus === "pending"
                                ? "blue"
                                : chatStatus === "accepted"
                                ? "green"
                                : chatStatus === "resolved"
                                ? "#42f5aa"
                                : "red",
                            fontSize: "15px",
                            textTransform: "uppercase",
                          }}
                        >
                          {chatStatus}
                        </strong>
                        {chatStatus === "accepted" ? (
                          <Button
                            className="btn btn-danger ms-1"
                            onClick={() => setconfirm_alert(true)}
                            disabled={loading}
                          >
                            Close chat
                          </Button>
                        ) : null}
                        {confirm_alert ? (
                          <SweetAlert
                            title="You want to close this conversation?"
                            warning
                            showCancel
                            confirmButtonText="Yes, close it!"
                            confirmBtnBsStyle="success"
                            cancelBtnBsStyle="danger"
                            onConfirm={() => {
                              handleClosedConversation();
                              setconfirm_alert(false);
                              setsuccess_dlg(true);
                              setdynamic_title("Close");
                              setdynamic_description(
                                "Your file has been closed."
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

                    <div className="chat-conversation">
                      <SimpleBar
                        style={{
                          height: "300px",
                          overflow: "hidden scroll",
                        }}
                        id="chatInfo"
                      >
                        {request?.length > 0 && (
                          <>
                            <ul
                              className="conversation-list"
                              data-simplebar
                              // style={{
                              //   maxHeight: "300px",
                              //   width: "100%",
                              // }}
                            >
                              {request?.map((chat, index, arr) => (
                                <div key={index}>
                                  {chat?.type === "system" && (
                                    <div className="mb-4 ">
                                      <p className="text-center">
                                        {new Date(
                                          chat.createdAt
                                        ).toLocaleString()}
                                      </p>
                                      <div className="ctext-wrap">
                                        <strong>{chat?.message}.</strong>
                                      </div>
                                    </div>
                                  )}

                                  {chat?.type === "user" && (
                                    <li className="clearfix">
                                      <div className="chat-avatar">
                                        <Tooltip title="See user details">
                                          <img
                                            src={chat?.user?.profile_photo}
                                            className="avatar-xs rounded-circle cursor-pointer"
                                            alt="Admin"
                                            onClick={() =>
                                              history.push(
                                                `/users/details/${chat?.user?._id}`
                                              )
                                            }
                                          />
                                        </Tooltip>
                                      </div>
                                      <div className="d-flex flex-column">
                                        <div className="conversation-text color-primary">
                                          <div className="ctext-wrap">
                                            <strong>{chat?.message}.</strong>
                                          </div>
                                        </div>
                                        {/* {index === arr.at(-1) && (
                                          <small className="ms-3">
                                            {chat?.seen && "Seen"}
                                          </small>
                                        )} */}
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
                              <li ref={bottomRef}></li>
                            </ul>
                          </>
                        )}
                      </SimpleBar>

                      {/* {request?.status === "pending" && (
                        <div className="text-center py-3">
                          <h6 className="text-success mb-3">
                            {request?.chats[0]?.message}
                          </h6>
                          <Button
                            color="primary"
                            // outline={true}
                            onClick={handleAccept}
                            disabled={loading}
                          >
                            Accept
                          </Button>
                          <Button
                            color="danger"
                            onClick={() => dispatch(rejectChatReq(id))}
                            // outline={true}
                            disabled={loading}
                            className="ms-3"
                          >
                            Reject
                          </Button>
                        </div>
                      )} */}

                      {chatStatus === "accepted" && (
                        <Row
                          className="py-1"
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
                                disabled={isSendingMsg}
                              >
                                {isSendingMsg ? "Sending" : "Send"}
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
                <Card style={{ height: "450px" }}>
                  <CardBody>
                    <div className=" w-100 pb-1">
                      <h4>Default Messages</h4>
                    </div>
                    <hr />
                    <ChatMessageTable isFromChat={true} />
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4">User Last 5 Orders</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table  table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Order Id</Th>

                      <Th>Status</Th>
                      <Th>Payment Status</Th>
                      <Th>Total Amount</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>

                  <Tbody style={{ position: "relative" }}>
                    {request?.lastFiveOrder?.map((item, index) => {
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
                          <Td>{item?.orderStatus}</Td>
                          <Td>{item?.paymentStatus}</Td>
                          <Td>{item?.summary?.totalAmount}</Td>
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
                {isLoading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="success" />
                  </div>
                )}
                {/* {!isLoading && list?.orders?.length < 1 && (
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
