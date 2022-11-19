import React, { useEffect, useRef, useState } from "react";

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
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import styled from "styled-components";
import SimpleBar from "simplebar-react";
import user2 from "../../../assets/images/users/user-2.jpg";
import user3 from "../../../assets/images/users/user-3.jpg";
import smimg1 from "../../../assets/images/small/img-1.jpg";
import smimg2 from "../../../assets/images/small/img-2.jpg";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Lightbox from "react-image-lightbox";
import Info from "./../../../components/Info";
import OrderTrackingMap from "../../../components/OrderTrackingMap";
import FlagsAndReviews from "../../../components/FlagsAndReviews";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import requestApi from "../../../network/httpRequest";
import { SINGLE_ORDER } from "../../../network/Api";
import user1 from "../../../assets/images/user1.jpg";
import { callApi } from "../../../components/SingleApiCall";
import TableImgItem from "../../../components/TableImgItem";

const OrderDetails = () => {
  const { id } = useParams();
  const { orders, status } = useSelector((state) => state.orderReducer);
  const history = useHistory();
  // const pdfRef = useRef(null);
  const [order, setOrder] = useState(null);
  const [isZoom, setIsZoom] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(async () => {
    if (id) {
      const findOrder = orders.find((order) => order._id == id);
      if (findOrder) {
        setOrder(findOrder);
      } else {
        const data = await callApi(id, SINGLE_ORDER, 'order')
        if (data) {
          setOrder(data);
        } else {
          history.push("/orders/list", { replace: true });
        }
      }
    }
  }, [id]);

  // CALL API FOR ORDER

  // const callApi = async (shopId) => {
  //   const { data } = await requestApi().request(SINGLE_ORDER, {
  //     params: {
  //       id: shopId,
  //     },
  //   });
  //   // console.log(banner)
  //   if (data.status) {
  //     const { order } = data.data;
  //     if (order) {
  //       setOrder(order);
  //     } else {
  //       history.push("/orders/list", { replace: true });
  //     }
  //   }
  // };

  const calProductAmount = (product) => {
    if (product.selectedAttributes.length > 0) {
      let totalPrice = 0;
      product.selectedAttributes.map((arr) => {
        const itemPrice = arr?.selectedItems.reduce((arr, item) => {
          return (arr += item?.extraPrice);
        }, 0);

        totalPrice += itemPrice;
      });

      return totalPrice + product?.productPrice;
    } else {
      return product?.productPrice;
    }
  };

  // GET ATTRIBUTE

  const getProductAttribute = (attributes) => {
    if (attributes.length > 0) {
      const attributeName = attributes.map((att) => att?.name);
      return attributeName;
    }
  };

  // GENEREATE ORDER PDF

  const downloadPdf = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(14);

    const title = "Order Informations";
    const shopName = `Shop Name : ${order?.shop?.shopName}. `;
    const price = `Price : ${order?.summary?.totalAmount} NGN.`;
    const address = `Address : ${order?.dropOffLocation?.address}.`;
    const paymentMethod = `Payment Method : ${order?.paymentMethod} ${order?.selectPos !== "no" ? "(Pos)" : ""
      }`;

    const orderTime = `Order Time : ${new Date(
      order?.createdAt
    ).toLocaleString()}`;

    const headers = [
      [
        "Product",
        "Attribute",
        "Type",
        "Quantity",
        "Discount(NGN)",
        "Total Price(NGN)",
      ],
    ];
    const marginLeft = 40;

    const productData = order?.productsDetails.map((item) => [
      item?.productName,
      getProductAttribute(item?.selectedAttributes) ?? "",
      item?.product?.type,
      item?.productQuantity,
      item?.discount ?? 0,
      calProductAmount(item),
    ]);

    let content = {
      startY: 170,
      head: headers,
      body: productData,
    };

    doc.text(title, 220, 30);
    doc.text(shopName, marginLeft, 60);
    doc.text(price, marginLeft, 80);
    doc.text(address, marginLeft, 100);
    doc.text(paymentMethod, marginLeft, 120);
    doc.text(orderTime, marginLeft, 140);
    doc.autoTable(content);
    doc.save(`${order.orderId}.pdf`);
  };

  useEffect(() => {
    if (status) {
      callApi(id);
    }
  }, [status]);

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
              isRefresh={false}
            />

            {isZoom ? (
              <Lightbox
                mainSrc={selectedImg}
                enableZoom={true}
                onCloseRequest={() => {
                  setIsZoom(!isZoom);
                }}
              />
            ) : null}

            {/* ORDER INFORMATIONS */}

            <Card className="card-height">
              <CardBody>
                <div className="d-flex align-items-center justify-content-between">
                  <CardTitle className="h4">Order Details</CardTitle>
                  <Button
                    outline={true}
                    color="success"
                    onClick={() => downloadPdf()}
                  >
                    Download PDF
                  </Button>
                </div>
                <hr />
                <Row className="text-center">
                  <Col lg={6}>
                    <Info
                      title="User"
                      value={order?.user?.name}
                      link={`/users/details/${order?.user?._id}`}
                    />
                    <Info
                      title="Shop"
                      value={order?.shop?.shopName}
                      link={`/shops/details/${order?.shop?._id}`}
                    />
                    {order?.deliveryBoy && (
                      <Info
                        title="Delivery Boy"
                        value={order?.deliveryBoy?.name}
                        link={`/deliveryman/details/${order?.deliveryBoy?._id}`}
                      />
                    )}
                    <Info title="Order Status" value={order?.orderStatus} />

                    <Info title="Order Type" value={order?.orderType} />

                    <Info
                      title="Payment Method"
                      value={`${order?.paymentMethod} ${order?.selectPos !== "no" ? "(Pos)" : ""
                        }`}
                    />
                    <Info title="Payment Status" value={order?.paymentStatus} />



                  </Col>

                  <Col lg={6}>
                    <Info
                      title="Order Time"
                      value={new Date(order?.createdAt).toLocaleString()}
                    />
                    <Info
                      title="Delivery Distance"
                      value={`${order?.deliveryDistance} KM`}
                    />
                    {order?.orderCancel && (
                      <>
                        <Info title="Cancelled By" value={order?.orderCancel.canceledBy} />
                        <Info title="Cancel Reason" value={order?.orderCancel.cancelReason ? order?.orderCancel?.cancelReason?.name : order?.orderCancel?.otherReason} />

                      </>
                    )}
                    {order?.deliveryBoy && (
                      <Info
                        title="Rider"
                        value={order?.deliveryBoy?.name}
                        link={`/deliveryman/details/${order?.deliveryBoy?._id}`}
                      />
                    )}
                    {order?.reviewDes && (
                      <Info title="User Review" value={order?.reviewDes} />
                    )}
                    <Info
                      title="Rating"
                      value={
                        order?.review === 4
                          ? "Excellent"
                          : order?.review === 3
                            ? "Very good"
                            : order?.review === 2
                              ? "Good"
                              : order?.review === 1
                                ? "Bad"
                                : 'No Rating'
                      }
                    />

                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* TIMELINE AND SUMMARY */}
            <Row>
              <Col xl={6}>
                <Card className='card-height'>
                  <CardBody>
                    <CardTitle>Order Timeline</CardTitle>
                    <hr />
                    <Timeline>
                      {order?.timeline?.map((item, index) => (
                        <TimelineItem key={index}>
                          <TimelineOppositeContent color="text.secondary">
                            {item.active && (
                              <Box>
                                <Typography>
                                  {new Date(item?.createdAt).toLocaleString()}
                                </Typography>
                                <Typography>{item?.note}</Typography>
                              </Box>
                            )}
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineDot
                              color={item?.active ? "success" : "grey"}
                              className="m-0"
                            />
                            <TimelineConnector
                              style={{
                                backgroundColor: item?.active
                                  ? "#2e7d32"
                                  : "grey",
                                display:
                                  index === order?.timeline.length - 1 &&
                                  "none",
                              }}
                            />
                          </TimelineSeparator>
                          <TimelineContent
                            color={item?.active ? "green" : "black"}
                          >
                            {item?.status}
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6} >
                <Card className='card-height'>
                  <CardBody>
                    <CardTitle className="h4">Summary</CardTitle>
                    <hr />

                    <Summery>
                      <div className="item">
                        <span>Products Amount</span>
                        <span className="value">
                          {order?.summary?.productAmount} NGN
                        </span>
                      </div>

                      <div className="item">
                        <span>Delivery Charge</span>
                        <span className="value">
                          {order?.summary?.deliveryFee} NGN
                        </span>
                      </div>
                      <div className="item">
                        <span>Payable Total</span>
                        <span className="value">
                          {order?.summary?.totalAmount} NGN
                        </span>
                      </div>
                    </Summery>
                  </CardBody>
                </Card>




              </Col>
            </Row>


            {/* Flags and Chat */}

            <Row>
              <Col lg={6}>
                <FlagsAndReviews flags={order?.flag} isFromOrder={true} />
              </Col>
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <CardTitle>Conversations (User & Delivery Body)</CardTitle>
                    <hr />
                    <div className="chat-conversation">
                      <SimpleBar style={{ height: "300px", overflow: 'hidden scroll' }}>
                        <ul
                          className="conversation-list"
                          data-simplebar
                          style={{
                            maxHeight: "300px",
                            width: "100%",
                          }}
                        >
                          {order?.chats?.length > 0 ? order?.chats?.map((chat, index, arr) => (
                            <div key={index}>
                              {chat?.sender === "user" && (
                                <li className="clearfix">
                                  <div className="chat-avatar">
                                    <Tooltip title='See user details'>
                                      <img
                                        src={user1}
                                        className="avatar-xs rounded-circle cursor-pointer"
                                        alt="User"
                                        onClick={() => history.push(`/users/details/${chat?.user?._id}`)}
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

                              {chat?.sender === "deliveryBoy" && (
                                <li className="clearfix odd">
                                  <div className="chat-avatar">
                                    <Tooltip title='See delivery boy details'>
                                      <img
                                        src={user1}
                                        className="avatar-xs rounded-circle cursor-pointer"
                                        alt="Delivery Boy"
                                        onClick={() => history.push(`/deliveryman/details/${chat?.deliveryBoy?._id}`)}
                                      />
                                    </Tooltip>
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
                          )) : <h5 className="text-center">No Conversions!</h5>}
                        </ul>
                      </SimpleBar>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* ADDRESS AND MAP */}

            <Row>
              <Col lg={6}>
                <Card className="card-height">
                  <CardBody>
                    <CardTitle className="h4">Delivery Address</CardTitle>
                    <hr />
                    <DeliveryAddress>
                      <i className="fa fa-map-marker-alt"></i>
                      <span className="ms-2 address ">
                        {`Full Address: ${order?.dropOffLocation?.address}`}
                      </span>
                    </DeliveryAddress>
                    <DeliveryAddress>
                      <i className="fa fa-map-marker-alt"></i>
                      <span className="ms-2 address">
                        {`State: ${order?.dropOffLocation?.state}`}
                      </span>
                    </DeliveryAddress>
                    <DeliveryAddress>
                      <i className="fa fa-map-marker-alt"></i>
                      <span className="ms-2 address">
                        {`City: ${order?.dropOffLocation?.city}`}
                      </span>
                    </DeliveryAddress>
                    <DeliveryAddress>
                      <i className="fa fa-map-marker-alt"></i>
                      <span className="ms-2 address">
                        {`Country: ${order?.dropOffLocation?.country}`}
                      </span>
                    </DeliveryAddress>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={6} className='card-height'>
                {order?.pickUpLocation && order?.dropOffLocation && (
                  <OrderTrackingMap
                    pickup={order?.pickUpLocation}
                    dropoff={order?.dropOffLocation}
                  />
                )}
              </Col>
            </Row>


            {/* PRODUCT TABLE */}
            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Product List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table  table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Product</Th>
                      <Th>Attributes</Th>
                      <Th>Type</Th>
                      <Th>Quantity</Th>
                      <Th>Discount(NGN)</Th>
                      <Th>Total Price(NGN)</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }} id="table-data">
                    {order?.productsDetails?.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                          id="table-content"
                        >
                          <Td>
                            {/* <img
                              onClick={() => {
                                setIsZoom(true);
                                setSelectedImg(item?.product?.images[0]);
                              }}
                              className="img-fluid cursor-pointer"
                              alt=""
                              src={item?.product?.images[0]}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                            <span>{item?.productName}</span> */}
                            <TableImgItem
                              img={item?.product?.images[0]}
                              name={item?.productName}
                              id={item?.autoGenId}
                            />
                          </Td>
                          <Td>
                            {item?.selectedAttributes.length > 0
                              ? item?.selectedAttributes.map((att, index) => (
                                <div key={index}>
                                  <span style={{ fontSize: "12px" }}>
                                    {att?.name}
                                  </span>
                                  {att?.selectedItems?.map((item, index) => (
                                    <p
                                      key={index}
                                      style={{ fontSize: "12px" }}
                                    >
                                      {item?.name}
                                    </p>
                                  ))}
                                </div>
                              ))
                              : "N/A"}
                          </Td>
                          <Td>{item?.product?.type}</Td>
                          <Td>{item?.productQuantity}</Td>
                          <Td>{item?.discount ?? 0}</Td>
                          <Td>{calProductAmount(item)}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>

          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

const DeliveryAddress = styled.div`
  .address {
    font-size: 18px;
    font-weight: 500;
    font-family: "Courier New", Courier, monospace;
  }
`;

const Summery = styled.div`
  .item {
    font-weight: 400;
    font-family: Arial, Helvetica, sans-serif;
    border-bottom: 1px solid #d8d8d8;
    padding: 10px 0;
    color: #333333;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    &:last-child {
      border-bottom: none;
    }

    .value {
      font-weight: bold;
      color: #02a499;
    }
  }
`;

export default OrderDetails;
