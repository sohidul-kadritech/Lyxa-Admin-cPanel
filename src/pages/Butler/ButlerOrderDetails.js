/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-restricted-globals */
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Accordion, AccordionDetails, AccordionSummary, Tooltip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Lightbox from 'react-image-lightbox';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Button, Card, CardBody, CardTitle, Col, Container, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import styled from 'styled-components';
import Breadcrumb from '../../components/Common/Breadcrumb';
import FlagsAndReviews from '../../components/FlagsAndReviews';
import OrderTrackingMap from '../../components/OrderTrackingMap';

import noPhoto from '../../assets/images/noPhoto.jpg';
import GlobalWrapper from '../../components/GlobalWrapper';
import { callApi } from '../../components/SingleApiCall';
import TableImgItem from '../../components/TableImgItem';
import { BUTLER_SINGLE_ORDER } from '../../network/Api';

function OrderInfo({ items = [] }) {
  const history = useHistory();
  return (
    <InfoWrapper>
      <Row className="">
        {items?.map((item, index) => (
          <Col xl={4} key={index} className="info cursor-pointer">
            <span className="title">{item?.title}</span>
            <div className={`${item?.valueTwo ? 'd-flex justify-content-center  align-items-center' : ''}`}>
              <h6
                className={`info-value text-capitalize ${item?.link ? 'link' : ''}`}
                onClick={item?.link ? () => history.push(item?.link) : null}
              >
                {item?.value}
              </h6>
              {item?.valueTwo ? (
                <h6 className={`info-value-two text-capitalize font-size-13  ${item?.class}`}>{item?.valueTwo}</h6>
              ) : null}
            </div>
          </Col>
        ))}
      </Row>
    </InfoWrapper>
  );
}

function SummaryInfo({ title, value }) {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();

  return (
    <div className="item">
      <span>{title}</span>
      <span className="summary-value">{`${value}  ${isNaN(value) ? `` : currency}`}</span>
    </div>
  );
}

function Riders({ list = [], heading }) {
  const history = useHistory();
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography>{heading}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Table id="tech-companies-1" className="table table__wrapper table-hover cursor-pointer">
          <Thead>
            <Tr style={{ color: 'black' }}>
              <Th>SL.</Th>
              <Th>Name</Th>
              <Th>Phone</Th>
            </Tr>
          </Thead>
          <Tbody style={{ position: 'relative', borderTop: 'none' }}>
            {list?.length > 0
              ? list?.map((rider, index) => (
                  <Tr
                    className="align-middle"
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'black',
                    }}
                    onClick={() => history.push(`/deliveryman/details/${rider._id}`)}
                    key={rider._id}
                    title="Click to see details"
                  >
                    <Th
                      style={{
                        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                      }}
                    >
                      #{index + 1}
                    </Th>

                    <Td>{rider?.name}</Td>

                    <Td>{rider?.number}</Td>
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>

        {list?.length === 0 ? (
          <div className="text-center w-100">
            <h5>No Delivery Boy</h5>
          </div>
        ) : null}
      </AccordionDetails>
    </Accordion>
  );
}

function ButlerOrderDetails() {
  const { account_type } = useSelector((store) => store.Login.admin);
  const { id } = useParams();
  const { orders, status } = useSelector((state) => state.butlerReducer);
  const history = useHistory();
  const [order, setOrder] = useState(null);
  const [isZoom, setIsZoom] = useState(false);
  const [selectedImg] = useState(null);
  console.log(order);

  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();

  useEffect(() => {
    if (id) {
      const findOrder = orders.find((order) => order._id === id);

      if (findOrder) {
        setOrder(findOrder);
      } else {
        (async function getOrder() {
          const data = await callApi(id, BUTLER_SINGLE_ORDER, 'order');
          if (data) {
            setOrder(data);
          } else {
            // history.push('/orders/list', { replace: true });
          }
        })();
      }
    }
  }, [id]);

  // GENEREATE ORDER PDF
  const downloadPdf = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape
    // eslint-disable-next-line new-cap
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(14);

    const title = 'Order Informations';

    const orderCharge = `Order Charge: ${order?.summary?.totalAmount} ${currency}.`;
    const vat = `Order Vat: ${order?.summary?.vat}`;
    const orderType = `Order Type: ${order.orderType === 'purchase_delivery' ? 'Purchase Delivery' : 'Only Delivery'}`;
    const address = `Address: ${order?.dropOffLocation?.address}.`;
    const orderTime = `Order Time : ${new Date(order?.createdAt).toLocaleString()}`;

    const marginLeft = 40;
    const headers = [['Product', 'Price', 'Quantity', 'Total']];

    const productData = order?.products?.map((item) => [
      item?.productName,
      item?.perProductPrice,
      item?.quantity,
      item?.totalProductAmount,
    ]);

    const content = {
      startY: 190,
      head: headers,
      body: productData,
    };

    doc.text(title, 220, 30);
    doc.text(orderCharge, marginLeft, 80);
    doc.text(vat, marginLeft, 100);
    doc.text(orderType, marginLeft, 120);
    doc.text(orderTime, marginLeft, 140);
    doc.text(address, marginLeft, 160);

    if (order?.orderType === 'purchase_delivery') {
      doc.autoTable(content);
    } else {
      const itemDescription = `Product Description: ${order?.itemDescription}`;
      doc.text(itemDescription, marginLeft, 180);
    }

    doc.save(`${order.orderId}.pdf`);
  };

  useEffect(() => {
    if (status) {
      (async function getOrder() {
        const data = await callApi(id, BUTLER_SINGLE_ORDER, 'order');
        if (data) {
          setOrder(data);
        }
      })();
    }
  }, [status]);

  const parseTime = (date) => {
    const m = moment(date).format('hh:mm a');
    return m;
  };

  console.log(order);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Details" title="Order" isRefresh={false} />
          {isZoom ? (
            <Lightbox
              mainSrc={selectedImg}
              enableZoom
              onCloseRequest={() => {
                setIsZoom(!isZoom);
              }}
            />
          ) : null}
          {/* ORDER INFORMATIONS */}
          <Card className="pb-5">
            <CardBody>
              <Row>
                <Col xl={6}>
                  <div style={{ height: '37px' }}>
                    <h5 className="text-dark">Order Details</h5>
                    <span>#{order?.orderId}</span>
                  </div>
                  <hr />
                  {/* SELLER AND USER IMAGE */}
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <img
                        className="rounded-circle avatar-lg cursor-pointer me-1"
                        alt="User"
                        loading="lazy"
                        src={order?.user?.profile_photo ? order?.user?.profile_photo : noPhoto}
                        style={{
                          border: '1px solid lightgray',
                          objectFit: 'cover',
                        }}
                        onClick={() => history.push(`/users/details/${order?.user?._id}`)}
                      />
                      <h6
                        onClick={() => history.push(`/users/details/${order?.user?._id}`)}
                        className="cursor-pointer link"
                      >
                        {order?.user?.name}
                      </h6>
                    </div>
                  </div>
                  {/* ORDER INFO */}
                  <div className="mt-4">
                    <OrderInfo
                      items={[
                        {
                          title: 'Order Time',
                          value: new Date(order?.createdAt).toLocaleString('en-US', { hour12: false }),
                        },
                        {
                          title: 'Payment Method',
                          value: order?.paymentMethod,
                          valueTwo: order?.paymentStatus,
                          class: 'orderStatus',
                        },
                        {
                          title: 'Order Type',
                          value: `${order?.orderType === 'delivery_only' ? 'Delivery Only' : 'Purchase Delivery'}`,
                        },
                      ]}
                    />
                    <OrderInfo
                      items={[
                        {
                          title: 'Order Status',
                          value: order?.orderStatus.split('_').join(' '),
                        },
                        {
                          title: 'Rating',
                          value:
                            order?.review === 4
                              ? 'Excellent'
                              : order?.review === 3
                              ? 'Very good'
                              : order?.review === 2
                              ? 'Good'
                              : order?.review === 1
                              ? 'Bad'
                              : 'No Rating',
                        },
                        {
                          title: '',
                          value: '',
                        },
                      ]}
                    />
                    <OrderInfo
                      items={[
                        {
                          title: 'Delivery Boy',
                          value: order?.deliveryBoy
                            ? order?.deliveryBoy?.name
                            : order?.orderFor === 'specific'
                            ? 'Self Delivery'
                            : 'Not Assigned',
                          link: order?.deliveryBoy ? `/deliveryman/details/${order?.deliveryBoy?._id}` : null,
                        },
                        {
                          title: 'Delivered Time',
                          value: `${
                            order?.orderStatus === 'delivered'
                              ? new Date(order?.timeline.at(-1)?.createdAt).toLocaleString('en-US', { hour12: false })
                              : 'No Time'
                          }`,
                        },
                        {
                          title: 'Delivery Distance',
                          value: `${order?.deliveryDistance} KM`,
                        },
                      ]}
                    />
                  </div>
                </Col>
                <Col xl={6}>
                  <div className="d-flex justify-content-between align-items-center" style={{ height: '37px' }}>
                    <h5 className="text-dark">Delivery Address</h5>
                    <Button outline color="success" onClick={() => downloadPdf()}>
                      Download PDF
                    </Button>
                  </div>
                  <hr />
                  <div className="d-flex align-items-center" style={{ padding: '2px 0px' }}>
                    <RoomOutlinedIcon className="text-danger" />
                    <h6 className="text-dark font-size-14">{order?.dropOffLocation?.address}</h6>
                  </div>
                  <hr />

                  <h5 className="text-dark" style={{ marginBottom: '30px' }}>
                    Summary
                  </h5>
                  <Summery>
                    <SummaryInfo title="Delivery Charge" value={order?.summary?.deliveryFee} />
                    {order?.orderType === 'purchase_delivery' && (
                      <SummaryInfo title="Estimated Product Amount" value={order?.summary?.productAmount} />
                    )}
                    <SummaryInfo title="VAT" value={order?.summary?.vat} />
                    <SummaryInfo title="Total Amount" value={order?.summary?.totalAmount + order?.summary?.vat} />
                  </Summery>
                  <Summery
                    className="mt-3 text-capitalize"
                    style={{
                      border:
                        order?.orderStatus === 'cancelled'
                          ? '1px solid #ffcfce'
                          : order?.orderStatus === 'delivered'
                          ? '1px solid #e1f4d0'
                          : '1px solid #f3f3f3',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="text-dark font-size-14">Status</h6>
                      {order?.orderCancel ? (
                        <span>
                          {order?.orderCancel?.canceledBy} |{' '}
                          {order?.orderCancel?.cancelReason
                            ? order?.orderCancel?.cancelReason?.name
                            : order?.orderCancel.otherReason}
                        </span>
                      ) : (
                        ''
                      )}

                      <span
                        className={`px-2 ${
                          ['cancelled', 'refused'].includes(order?.orderStatus)
                            ? 'inactive-status'
                            : order?.orderStatus === 'delivered'
                            ? 'active-status'
                            : 'orderStatus'
                        }`}
                      >
                        {order?.orderStatus?.split('_')?.join(' ')}
                      </span>
                    </div>
                    <hr style={{ margin: '6px 0px' }} />

                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="text-dark font-size-14">Delivery Time</h6>
                      <span className="">
                        {order?.deliveredMinutes === 0 ? 'Not Delivered.' : `${order?.deliveredMinutes} Min`}
                      </span>
                    </div>
                  </Summery>
                </Col>
              </Row>
              <h5 className="text-dark" style={{ marginBottom: '30px' }}>
                Order Amount Details
              </h5>
              <Summery>
                <SummaryInfo title="Rider Profit" value={order?.deliveryBoyFee} />
                <SummaryInfo title="Total Lyxa Profit" value={order?.dropCharge} />
              </Summery>
              {/* order cancel details */}
              {order?.orderStatus === 'cancelled' && (
                <h5 className="text-dark" style={{ marginBottom: '30px', marginTop: '30px' }}>
                  Order Cancel Amount Details
                </h5>
              )}
              {order?.userCancelTnx && (
                <Summery>
                  <SummaryInfo
                    title="Refund Type"
                    value={order?.userCancelTnx?.isRefund ? 'Full Refund' : 'Partial Refund'}
                  />
                  <SummaryInfo title="Admin Cut" value={order?.userCancelTnx?.adminCut} />
                  <SummaryInfo title="Rider Cut" value={order?.userCancelTnx?.deliveryBoyCut} />
                  <SummaryInfo title="Total Refund" value={order?.userCancelTnx?.amount} />
                </Summery>
              )}
              {order?.orderStatus === 'cancelled' && !order?.userCancelTnx && (
                <Summery>
                  <SummaryInfo title="Refund Type" value="No Refund" />
                </Summery>
              )}
            </CardBody>
          </Card>

          {/* TIMELINE AND SUMMARY */}
          <Row>
            <Col xl={6}>
              <Card className="card-height">
                <CardBody>
                  <CardTitle>Order Timeline</CardTitle>
                  <hr />
                  <Timeline>
                    {order?.timeline.map((item, index) => (
                      <TimelineItem key={index}>
                        <TimelineOppositeContent color="text.secondary">
                          {item.active && (
                            <Box>
                              <Typography>{new Date(item?.createdAt).toLocaleString()}</Typography>
                              <Typography>{item?.note}</Typography>
                            </Box>
                          )}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot color={item?.active ? 'success' : 'grey'} className="m-0" />
                          <TimelineConnector
                            style={{
                              backgroundColor: item?.active ? '#2e7d32' : 'grey',
                              display: index === order?.timeline?.length - 1 && 'none',
                            }}
                          />
                        </TimelineSeparator>
                        <TimelineContent color={item?.active ? 'green' : 'black'} className="text-capitalize">
                          {item?.status.split('_').join(' ')}
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6} className="card-height">
              {order?.pickUpLocation && order?.dropOffLocation && (
                <OrderTrackingMap pickup={order?.pickUpLocation} dropoff={order?.dropOffLocation} />
              )}
            </Col>
          </Row>
          {account_type === 'admin' && (
            <Row className="mb-4">
              {/* Flags and Chat */}
              <Col lg={6}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Chat (User & Rider)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="chat-conversation">
                      <SimpleBar>
                        <ul
                          className="conversation-list"
                          data-simplebar
                          style={{
                            maxHeight: '300px',
                            width: '100%',
                          }}
                        >
                          {order?.chats?.length > 0 ? (
                            order?.chats?.map((chat, index) => (
                              <div key={index}>
                                {chat?.sender === 'user' && (
                                  <li className="clearfix">
                                    <div className="chat-avatar">
                                      <Tooltip title="See user details">
                                        <img
                                          src={chat?.user?.profile_photo}
                                          className="avatar-xs rounded-circle cursor-pointer"
                                          alt="User"
                                          onClick={() => history.push(`/users/details/${chat?.user?._id}`)}
                                        />
                                      </Tooltip>
                                    </div>
                                    <div className="conversation-text color-primary">
                                      <div className="ctext-wrap">
                                        <strong>{chat?.message}.</strong>
                                        <div style={{ color: 'grey' }}>{parseTime(chat?.createdAt)}</div>
                                      </div>
                                    </div>
                                  </li>
                                )}

                                {chat?.sender === 'deliveryBoy' && (
                                  <li className="clearfix odd">
                                    <div className="chat-avatar">
                                      <Tooltip title="See delivery boy details">
                                        <img
                                          src={chat?.deliveryBoy?.image}
                                          className="avatar-xs rounded-circle cursor-pointer"
                                          alt="Delivery Boy"
                                          onClick={() => history.push(`/deliveryman/details/${chat?.deliveryBoy?._id}`)}
                                        />
                                      </Tooltip>
                                    </div>
                                    <div className="conversation-text color-primary">
                                      <div className="ctext-wrap">
                                        <strong>{chat?.message}.</strong>
                                        <div style={{ color: 'grey' }}>{parseTime(chat?.createdAt)}</div>
                                      </div>
                                    </div>
                                  </li>
                                )}
                              </div>
                            ))
                          ) : (
                            <h5 className="text-center">No Conversions!</h5>
                          )}
                        </ul>
                      </SimpleBar>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <FlagsAndReviews flags={order?.flag} isFromOrder />
              </Col>
              {/* Riders */}
              <Col lg={6}>
                <Riders list={order?.deliveryBoyList} heading="Available Riders" />
                <Riders list={order?.rejectedDeliveryBoy} heading="Rejected Riders" />
              </Col>
            </Row>
          )}
          {/* PRODUCT TABLE */}
          {order?.orderType === 'purchase_delivery' ? (
            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Product List</CardTitle>
                <Table id="tech-companies-1" className="table  table-hover text-center">
                  <Thead>
                    <Tr>
                      <Th class="text-start">Product</Th>
                      <Th>Price</Th>
                      <Th>Quantity</Th>
                      <Th>Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: 'relative' }} id="table-data">
                    {order?.products?.map((item) => (
                      <Tr
                        key={item?.autoGenId}
                        className="align-middle"
                        style={{
                          fontSize: '15px',
                          fontWeight: '500',
                        }}
                        id="table-content"
                      >
                        <Td>
                          <TableImgItem img={item.productImage} name={item?.productName} id={item?._id} />
                        </Td>
                        <Td>{item?.perProductPrice}</Td>
                        <Td>{item?.quantity}</Td>
                        <Td>{item?.totalProductAmount}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody>
                <CardTitle className="h4">Product Description</CardTitle>
                <p>{order?.itemDescription}</p>
              </CardBody>
            </Card>
          )}
        </Container>
      </div>
    </GlobalWrapper>
  );
}

const InfoWrapper = styled.div`
  border: 1px solid #f3f3f3;
  border-radius: 10px;
  padding: 15px 5px;
  margin-bottom: 8px;
  .info:nth-child(2) {
    text-align: center;
  }
  .info:last-child {
    text-align: right;
  }

  .info-value {
    font-size: 15px;
    margin-bottom: 0px;
    color: black;
    text-transform: capitalize;
  }

  .link {
    &:hover {
      color: blue;
      font-weight: blod;
      text-decoration: underline;
    }
  }

  .info-value-two {
    font-size: 13px;
    text-transform: capitalize;
    padding: 2px 6px;
    margin-left: 20px;
    margin-bottom: 0px;
  }
`;

const Summery = styled.div`
  border: 1px solid #f3f3f3;
  border-radius: 10px;
  padding: 6px;
  .item {
    font-family: Arial, Helvetica, sans-serif;
    border-bottom: 1px solid #f3f3f3;
    padding: 4px 0;
    color: #333333;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    &:last-child {
      border-bottom: none;
      font-weight: bold;
    }
  }
`;

export default ButlerOrderDetails;
