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
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Lightbox from "react-image-lightbox";
import Info from "./../../../components/Info";
import OrderTrackingMap from "../../../components/OrderTrackingMap";
import FlagsAndReviews from "../../../components/FlagsAndReviews";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import { SINGLE_ORDER } from "../../../network/Api";
import user1 from "../../../assets/images/user1.jpg";
import { callApi } from "../../../components/SingleApiCall";
import TableImgItem from "../../../components/TableImgItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import noPhoto from "../../../assets/images/noPhoto.jpg";

const OrderInfo = ({ items = [] }) => {
  return (
    <InfoWrapper>
      <Row className="mt-2">
        {items?.map((item, index) => (
          <Col xl={4} key={index} className="info">
            <span className="title">{item?.title}</span>
            <h6>{item?.value}</h6>
          </Col>
        ))}
      </Row>
    </InfoWrapper>
  );
};

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
        const data = await callApi(id, SINGLE_ORDER, "order");
        if (data) {
          setOrder(data);
        } else {
          history.push("/orders/list", { replace: true });
        }
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
    const paymentMethod = `Payment Method : ${order?.paymentMethod} ${
      order?.selectPos !== "no" ? "(Pos)" : ""
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

            <Card className="pb-5">
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
                <Row className="card-height">
                  <Col lg={2}>
                    <div className="text-center">
                      <img
                        className="rounded-circle avatar-lg cursor-pointer"
                        alt="Seller"
                        src={
                          order?.user?.profile_photo
                            ? order?.user?.profile_photo
                            : noPhoto
                        }
                        style={{ border: "1px solid lightgray" }}
                        onClick={() =>
                          history.push(`/users/details/${order?.user?._id}`)
                        }
                      />
                      <h5
                        className="text-capitalize cursor-pointer"
                        onClick={() =>
                          history.push(`/users/details/${order?.user?._id}`)
                        }
                      >
                        {order?.user?.name}
                      </h5>
                    </div>
                  </Col>
                  <Col lg={5}>
                    <Info
                      title="Shop"
                      value={order?.shop?.shopName}
                      link={`/shops/details/${order?.shop?._id}`}
                      valueTwo={order?.shop?.shopStatus}
                      statusClass={
                        order?.shop?.shopStatus
                          ? "active-status"
                          : "inactive-status"
                      }
                    />
                    {order?.deliveryBoy && (
                      <Info
                        title="Delivery Boy"
                        value={order?.deliveryBoy?.name}
                        link={`/deliveryman/details/${order?.deliveryBoy?._id}`}
                      />
                    )}

                    <Info
                      title="Order Time"
                      value={new Date(order?.createdAt).toLocaleString()}
                    />

                    <Info title="Order Type" value={order?.orderType} />
                    <Info title="Order Status" value={order?.orderStatus} />
                  </Col>

                  <Col lg={5}>
                    <Info
                      title="Payment Method"
                      value={`${order?.paymentMethod} ${
                        order?.selectPos !== "no" ? "(Pos)" : ""
                      }`}
                      valueTwo={order?.paymentStatus}
                    />
                    <Info
                      title="Delivery Distance"
                      value={`${order?.deliveryDistance} KM`}
                    />
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
                          : "No Rating"
                      }
                    />
                    {order?.orderCancel && (
                      <>
                        <Info
                          title="Cancelled By"
                          value={order?.orderCancel.canceledBy}
                        />
                        <Info
                          title="Cancel Reason"
                          value={
                            order?.orderCancel.cancelReason
                              ? order?.orderCancel?.cancelReason?.name
                              : order?.orderCancel?.otherReason
                          }
                        />
                      </>
                    )}
                    {order?.reviewDes && (
                      <Info title="User Review" value={order?.reviewDes} />
                    )}
                  </Col>

                  {/* <Col xl={6}>
                    <h5>Order Details</h5>
                    <p>#{order?.orderId}</p>
                    <hr />

                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <img
                          className="rounded-circle avatar-lg cursor-pointer me-1"
                          alt="Seller"
                          src={
                            order?.user?.profile_photo
                              ? order?.user?.profile_photo
                              : noPhoto
                          }
                          style={{ border: "1px solid lightgray" }}
                          onClick={() =>
                            history.push(`/users/details/${order?.user?._id}`)
                          }
                        />
                        <h6>{order?.user?.name}</h6>
                      </div>
                      <div className="d-flex align-items-center">
                        <img
                          className="rounded-circle avatar-lg cursor-pointer me-1"
                          alt="Seller"
                          src={
                            order?.user?.profile_photo
                              ? order?.user?.profile_photo
                              : noPhoto
                          }
                          style={{ border: "1px solid lightgray" }}
                          onClick={() =>
                            history.push(`/users/details/${order?.user?._id}`)
                          }
                        />
                        <h6>{order?.user?.name}</h6>
                      </div>
                    </div>

                    <div className="mt-4">
                      <OrderInfo
                        items={[
                          { title: "Order Type", value: order?.orderType },
                          {
                            title: "Payment Method",
                            value: order?.paymentMethod,
                          },
                          {
                            title: "Order Time",
                            value: new Date(order?.createdAt).toLocaleString(),
                          },
                        ]}
                      />
                    </div>
                  </Col>

                  <Col xl={6}></Col> */}
                </Row>
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
                            className="text-capitalize"
                          >
                            {item?.status.split("_").join(" ")}
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card className="card-height">
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

            <Row className="mb-4">
              <Col lg={6}>
                <FlagsAndReviews flags={order?.flag} isFromOrder={true} />
              </Col>
              <Col lg={6}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>
                      Conversations (User & Delivery Body)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <div className="chat-conversation">
                        <SimpleBar
                        // style={{ height: "300px", overflow: "hidden scroll" }}
                        >
                          <ul
                            className="conversation-list"
                            data-simplebar
                            style={{
                              maxHeight: "300px",
                              width: "100%",
                            }}
                          >
                            {order?.chats?.length > 0 ? (
                              order?.chats?.map((chat, index, arr) => (
                                <div key={index}>
                                  {chat?.sender === "user" && (
                                    <li className="clearfix">
                                      <div className="chat-avatar">
                                        <Tooltip title="See user details">
                                          <img
                                            src={user1}
                                            className="avatar-xs rounded-circle cursor-pointer"
                                            alt="User"
                                            onClick={() =>
                                              history.push(
                                                `/users/details/${chat?.user?._id}`
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

                                  {chat?.sender === "deliveryBoy" && (
                                    <li className="clearfix odd">
                                      <div className="chat-avatar">
                                        <Tooltip title="See delivery boy details">
                                          <img
                                            src={user1}
                                            className="avatar-xs rounded-circle cursor-pointer"
                                            alt="Delivery Boy"
                                            onClick={() =>
                                              history.push(
                                                `/deliveryman/details/${chat?.deliveryBoy?._id}`
                                              )
                                            }
                                          />
                                        </Tooltip>
                                      </div>
                                      <div className="conversation-text">
                                        <div className="ctext-wrap">
                                          <strong>{chat?.message}.</strong>
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
                    </Typography>
                  </AccordionDetails>
                </Accordion>
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
              <Col lg={6} className="card-height">
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

const InfoWrapper = styled.div`
  border: 1px solid lightgray;
  border-radius: 5px;
  .info:last-child {
    text-align: right;
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
