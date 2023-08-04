/* eslint-disable react/no-array-index-key */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Button, Card, CardBody, CardTitle, Col, Container, Row, Spinner } from 'reactstrap';

import { TextField, Tooltip } from '@mui/material';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { actionTypes } from 'redux-form';
import SimpleBar from 'simplebar-react';
import user1 from '../../../assets/images/user1.jpg';
import ChatMessageTable from '../../../components/ChatMessageTable';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import getCookiesAsObject from '../../../helpers/cookies/getCookiesAsObject';
import { LAST_FIVE_ORDER, SINGLE_CHAT } from '../../../network/Api';
import requestApi from '../../../network/httpRequest';
import {
  acceptChatReq,
  closeConversation,
  sendMsgToUser,
  setAcceptChat,
  setChatStatusFalse,
} from '../../../store/chat/chatAction';

function ChatDetails() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const history = useHistory();
  const userId = history?.location?.state?.user?._id;

  const { search } = useLocation();
  const bottomRef = useRef(null);
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const { status, loading, selectedMsg, isSendingMsg, isChatClose, isChatAccepted } = useSelector(
    (state) => state.chatReducer
  );
  const { socket } = useSelector((state) => state.socketReducer);
  const { access_token } = getCookiesAsObject();

  const [request, setRequest] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState('');
  const [dynamic_description, setdynamic_description] = useState('');
  const [chatStatus, setChatStatus] = useState('');
  const [requestId, setRequestId] = useState('');
  const [lastFiveOrder, setLastFiveOrder] = useState([]);

  // Scroll to Bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }, 5);
  };

  const callApi = async (orderId) => {
    try {
      const { data } = await requestApi().request(SINGLE_CHAT, {
        params: {
          orderId,
        },
      });

      console.log('data-data', data);

      if (data.status) {
        setIsLoading(false);
        const chats = data?.data?.chats;
        const length = chats?.length;
        setRequestId(chats[length - 1]?.adminChatRequest?._id);
        setRequest(data?.data?.chats);
        scrollToBottom();
      }

      // last five order
      const response = await requestApi().request(LAST_FIVE_ORDER + userId);

      if (data?.status) {
        setLastFiveOrder(response?.data?.data);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const status = searchParams.get('status');
      dispatch(setChatStatusFalse(status === 'closed'));
      dispatch(setAcceptChat(status === 'accepted'));
      setChatStatus(status);
      callApi(id);
    }
  }, [id]);

  // SOCKET
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (requestId && socket) {
      socket.on(`user_message_sent`, (data) => {
        setRequest((prev) => [...prev, data]);
        scrollToBottom();
      });

      socket.on(`chat-close`, () => {
        setChatStatus('closed');

        dispatch({
          type: actionTypes.OPEN_CHATS_DECREMENT_VALUE,
        });
      });
      return () => {
        socket.removeListener(`user_message_sent-${requestId}`);
        socket.removeListener(`chat-close-${requestId}`);
      };
    }
  }, [requestId, socket]);

  // SENT MESSAGE TO USER
  const sendMsg = () => {
    dispatch(
      sendMsgToUser({
        id: requestId,
        message,
      })
    );
  };

  //  JOIN TO THE CHAT ROOM
  useEffect(() => {
    if (chatStatus === 'accepted' && socket) {
      socket.emit('join_user_and_admin_chat', { room: requestId, data: { access_token } });
    }
  }, [chatStatus, socket]);

  useEffect(() => {
    if (selectedMsg) {
      setMessage(selectedMsg);
    }
  }, [selectedMsg]);

  useEffect(() => {
    if (status) {
      const newMessage = {
        message,
        type: 'admin',
        createdAt: new Date(),
      };

      setRequest((prev) => [...prev, newMessage]);
      setMessage('');
      scrollToBottom();
    }
  }, [status]);

  // CLOSE CONVERSATION ACTION
  const handleClosedConversation = () => {
    dispatch(closeConversation(requestId));
    setconfirm_alert(false);
    setsuccess_dlg(true);
    setdynamic_title('Close');
    setdynamic_description('Your file has been closed.');
  };

  // accept conversation
  const handleAcceptConversation = () => {
    dispatch(acceptChatReq(requestId));
    setconfirm_alert(false);
    setsuccess_dlg(true);
    setdynamic_title('Accept');
    setdynamic_description('Your chat has been accepted.');
  };

  useEffect(() => {
    if (isChatClose) {
      setChatStatus('closed');
    }

    if (isChatAccepted) {
      setChatStatus('accepted');
    }

    if (!isSendingMsg) {
      scrollToBottom();
    }
  }, [isChatClose, isSendingMsg, isChatAccepted]);

  const parseTime = (date) => {
    const m = moment(date).format('hh:mm a');
    return m;
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
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

          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Details" title="Single Query" isRefresh={false} />

          <Row>
            <Col lg={6}>
              <Card style={{ height: '500px' }}>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <CardTitle className="d-flex flex-column">
                      <p className="mb-0">{`Conversion with ${
                        !request[0]?.user?.name ? '' : request[0]?.user?.name
                      }`}</p>
                      <strong
                        style={{
                          color:
                            chatStatus === 'pending'
                              ? 'blue'
                              : chatStatus === 'accepted'
                              ? 'green'
                              : chatStatus === 'closed'
                              ? '#42f5aa'
                              : 'red',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                        }}
                      >
                        {chatStatus}
                      </strong>
                    </CardTitle>
                    {(loading || isLoading) && (
                      <div className="text-center">
                        <Spinner animation="border" color="info" />
                      </div>
                    )}
                    <div className="d-flex align-items-center justify-content-end" style={{ width: '190px' }}>
                      {chatStatus !== 'closed' ? (
                        <Button
                          className={`btn ms-1 ${chatStatus === 'accepted' ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => setconfirm_alert(true)}
                          disabled={loading}
                        >
                          {chatStatus === 'accepted' ? 'Close Chat' : 'Accept Chat'}
                        </Button>
                      ) : null}
                      {confirm_alert ? (
                        <SweetAlert
                          title={`${
                            chatStatus === 'accepted'
                              ? 'You want to close this conversation?'
                              : 'You want to accept this conversation?'
                          }`}
                          success={chatStatus !== 'accepted'}
                          warning={chatStatus === 'accepted'}
                          showCancel
                          confirmButtonText={chatStatus === 'accepted' ? 'Yes, close it!' : 'Yes, accept it!'}
                          confirmBtnBsStyle="success"
                          cancelBtnBsStyle="danger"
                          onConfirm={() => {
                            console.log(chatStatus);
                            if (chatStatus === 'accepted') {
                              handleClosedConversation();
                            } else {
                              handleAcceptConversation();
                            }
                          }}
                          onCancel={() => setconfirm_alert(false)}
                        >
                          You won't be able to revert this!
                        </SweetAlert>
                      ) : null}
                    </div>
                  </div>
                  <hr />
                  <div style={{ marginBottom: 10 }}>
                    <SimpleBar
                      style={{
                        height: '300px',
                        overflow: 'hidden scroll',
                      }}
                      id="chatInfo"
                    >
                      {request?.length > 0 && (
                        <ul className="conversation-list" data-simplebar>
                          {request?.map((chat, index) => (
                            <div key={index}>
                              {chat?.type === 'system' && (
                                <div className="mb-4 ">
                                  <p className="text-center">{new Date(chat.createdAt).toLocaleString()}</p>
                                  <div className="ctext-wrap">
                                    <strong>{chat?.message}.</strong>
                                  </div>
                                </div>
                              )}

                              {chat?.type === 'user' && (
                                <li className="clearfix">
                                  <div className="chat-avatar">
                                    <Tooltip title="See user details">
                                      <img
                                        src={chat?.user?.profile_photo}
                                        className="avatar-xs rounded-circle cursor-pointer"
                                        alt="Admin"
                                        onClick={() => history.push(`/users/details/${chat?.user?._id}`)}
                                      />
                                    </Tooltip>
                                  </div>
                                  <div className="d-flex flex-column">
                                    <div className="conversation-text color-primary">
                                      <div className="ctext-wrap">
                                        <strong>{chat?.message}.</strong>
                                        <div style={{ color: 'grey' }}>{parseTime(chat?.createdAt)}</div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )}

                              {chat?.type === 'admin' && (
                                <li className="clearfix odd">
                                  <div className="chat-avatar">
                                    <img src={user1} className="avatar-xs rounded-circle" alt="Admin" />
                                  </div>
                                  <div className="conversation-text">
                                    <div className="ctext-wrap">
                                      <strong>{chat?.message}.</strong>
                                      <div style={{ color: 'grey' }}>{parseTime(chat?.createdAt)}</div>
                                    </div>
                                  </div>
                                </li>
                              )}
                            </div>
                          ))}
                          <li ref={bottomRef}></li>
                        </ul>
                      )}
                    </SimpleBar>
                  </div>
                  {chatStatus === 'accepted' && (
                    <Row
                      className="py-1"
                      style={{
                        boxShadow: '1px 1px 3px 1px #cfcaca',
                        borderRadius: '5px',
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
                          onChange={(e) => {
                            setMessage(e.target.value);
                          }}
                        />
                      </Col>
                      <Col md={2} className="chat-send">
                        <div style={{ marginTop: 2 }} className="d-flex align-items-center justify-content-end h-100">
                          <Button
                            onClick={sendMsg}
                            type="submit"
                            color="success"
                            className="btn-block"
                            disabled={isSendingMsg}
                          >
                            {isSendingMsg ? 'Sending' : 'Send'}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  )}
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card style={{ height: '450px' }}>
                <CardBody>
                  <div className=" w-100 pb-1">
                    <h4>Default Messages</h4>
                  </div>
                  <hr />
                  <ChatMessageTable isFromChat />
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
              <Table id="tech-companies-1" className="table  table-hover text-center">
                <Thead>
                  <Tr>
                    <Th>Order Id</Th>

                    <Th>Status</Th>
                    <Th>Payment Status</Th>
                    <Th>Total Amount</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>

                <Tbody style={{ position: 'relative' }}>
                  {lastFiveOrder?.map((item) => (
                    <Tr
                      key={item._id}
                      className="align-middle"
                      style={{
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      <Th>{item?.orderId}</Th>
                      <Td>{item?.orderStatus}</Td>
                      <Td>{item?.paymentStatus}</Td>
                      <Td>{item?.summary?.baseCurrency_totalAmount}</Td>
                      <Td>
                        <div>
                          <Tooltip title="Details">
                            <button
                              type="button"
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
                  ))}
                </Tbody>
              </Table>
              {isLoading && (
                <div className="text-center">
                  <Spinner animation="border" variant="success" />
                </div>
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default ChatDetails;
