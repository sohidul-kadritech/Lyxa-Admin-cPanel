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
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Lightbox from "react-image-lightbox";
import Info from "./../../../components/Info";
import OrderTrackingMap from "../../../components/OrderTrackingMap";
import Flags from "../../../components/Flags";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ReactDOMServer from "react-dom/server";

const OrderDetails = () => {
  const { id } = useParams();
  const { orders } = useSelector((state) => state.orderReducer);
  // const pdfRef = useRef(null);
  const [order, setOrder] = useState(null);
  const [isZoom, setIsZoom] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (id) {
      const findOrder = orders.find((order) => order._id == id);
      if (findOrder) {
        console.log({ findOrder });
        setOrder(findOrder);
      } else {
        console.log("call api");
      }
    }
  }, [id]);

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
    const paymentMethod = `Payment Method : ${order?.paymentMethod} ${
      order?.selectPos !== "no" ? "(Pos)" : ""
    }`;

    const orderTime = `Order Time : ${new Date(
      order?.createdAt
    ).toLocaleString()}`;

    const headers = [
      ["Product", "Type", "Quantity", "Discount(NGN)", "Total Price(NGN)"],
    ];
    const marginLeft = 40;

    const productData = order?.productsDetails.map((item) => [
      item?.productName,
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
    doc.save("order.pdf");
  };

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

            <Card>
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
                    <Info
                      title="Delivery Distance"
                      value={`${order?.deliveryDistance} KM`}
                    />
                    <Info title="Order Status" value={order?.orderStatus} />
                    <Info title="Order Type" value={order?.orderType} />
                  </Col>

                  <Col lg={6}>
                    <Info
                      title="Payment Method"
                      value={`${order?.paymentMethod} ${
                        order?.selectPos !== "no" ? "(Pos)" : ""
                      }`}
                    />
                    <Info title="Payment Status" value={order?.paymentStatus} />
                    <Info
                      title="Order Time"
                      value={new Date(order?.createdAt).toLocaleString()}
                    />
                    {order?.deliveryBoy && (
                      <Info
                        title="Rider"
                        value={order?.deliveryBoy?.name}
                        link={`/deliveryman/details/${order?.deliveryBoy?._id}`}
                      />
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* TIMELINE AND SUMMARY */}
            <Row>
              <Col xl={6}>
                <Card>
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

              <Col xl={6}>
                <Card>
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

                {order?.flag.length > 0 && (
                  <Flags flags={order.flag} isFromOrder={true} />
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
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
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
                  <Tbody style={{ position: "relative" }}>
                    {order?.productsDetails?.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th style={{ height: "50px", maxWidth: "150px" }}>
                            <img
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
                            <span>{item?.productName}</span>
                          </Th>
                          <Td>
                            {item?.selectedAttributes.length > 0
                              ? item?.selectedAttributes.map((arr, index) => (
                                  <div key={index}>
                                    <span style={{ fontSize: "12px" }}>
                                      {arr?.name}
                                    </span>
                                    {arr?.selectedItems?.map((item, index) => (
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

            {/* ADDRESS AND MAP */}

            <Row>
              <Col lg={6}>
                <Card>
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
              <Col lg={6}>
                {order?.pickUpLocation && order?.dropOffLocation && (
                  <OrderTrackingMap
                    pickup={order?.pickUpLocation}
                    dropoff={order?.dropOffLocation}
                  />
                )}
              </Col>
            </Row>

            {/* CHATS */}

            {order?.chats.length > 0 && (
              <Row>
                <Col md={6}>
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
                                    Hi, How are you? What about our next
                                    meeting?
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
            )}
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
      color: green;
    }
  }
`;

export default OrderDetails;
