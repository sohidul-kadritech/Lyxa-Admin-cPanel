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

const OrderDetails = () => {
  const { id } = useParams();
  const { orders } = useSelector((state) => state.orderReducer);
  const mapRef = useRef();
  const sidebar = useRef();
  const floatingPanel = useRef();

  const [order, setOrder] = useState(null);
  const [isZoom, setIsZoom] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [directionsRenderer, setdirectionsRenderer] = useState(null);
  const [directionsService, setdirectionsService] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const google = window.google;

  useEffect(() => {
    if (id) {
      map()
      const findOrder = orders.find((order) => order._id == id);
      if (findOrder) {
        console.log({ findOrder });
        setOrder(findOrder);
      } else {
        console.log("call api");
      }
    }
  }, [id]);

  // SHOW MAP

  const map = () =>{
    const directionsRenderer_ = new google.maps.DirectionsRenderer();
      const directionsService_ = new google.maps.DirectionsService();
      setdirectionsRenderer(directionsRenderer_);
      setdirectionsService(directionsService_);

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 22.328127, lng: 91.805502 },
        zoom: 12,
        disableDefaultUI: true,
        // mapTypeId: 'satellite',
        // heading: 90,
        // tilt: 45,
      });

      directionsRenderer_.setMap(map);
      directionsRenderer_.setPanel(sidebar.current);

      const control = floatingPanel.current;
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

      calculateAndDisplayRoute(directionsService_, directionsRenderer_);
  }

  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    // const {latitude, longitude} = order?.orderDeliveryAddress;
    directionsService
      .route({
        origin: { lat: 23.7356, lng: 90.3837 },
        destination: { lat: 22.328127, lng: 91.805502 },
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {


        const route = response.routes[0];

        directionsRenderer.setDirections(response);

        setDistance(route.legs[0].distance.value.toString());
        setDuration(route.legs[0].duration.value.toString());

      })
      .catch((e) =>
        window.alert("Directions request failed due to " + e.message)
      );

  }

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

            {/* TIMELINE AND CHAT */}
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
                            {item.createdAt && (
                              <Box>
                                <Typography>
                                  {new Date(item?.createdAt).toLocaleString()}
                                </Typography>
                                <Typography>{item?.note}</Typography>
                              </Box>
                            )}
                          </TimelineOppositeContent>
                          <TimelineSeparator
                          // style={{
                          //
                          // }}
                          >
                            <TimelineDot
                              color={item?.createdAt ? "success" : "grey"}
                              className="m-0"
                            />
                            <TimelineConnector
                              style={{
                                backgroundColor: item?.createdAt
                                  ? "#2e7d32"
                                  : "grey",
                                display:
                                  index === order?.timeline.length - 1 &&
                                  "none",
                              }}
                            />
                          </TimelineSeparator>
                          <TimelineContent
                            color={item?.active ? 'green' : "black"}
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
                    </div>
                  </CardBody>
                </Card>
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
                      <Th>Type</Th>
                      <Th>Quantity</Th>
                      <Th>Price</Th>
                      <Th>Total Price</Th>
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
                          <Td>{item?.product?.type}</Td>
                          <Td>{item?.productQuantity}</Td>
                          <Td>{item?.productPrice}</Td>
                          <Td>{item?.productTotalPrice}</Td>
                        </Tr>
                      );
                    })}
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

            {/* ADDRESS AND SUMMERY */}

            <Row>
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="h4">Delivery Address</CardTitle>
                    <hr />
                    <DeliveryAddress>
                      <i className="fa fa-map-marker"></i>
                      <span className="ms-2 address ">
                        {`Full Address: ${order?.orderDeliveryAddress?.address}`}
                      </span>
                    </DeliveryAddress>
                    <DeliveryAddress>
                      <i className="fa fa-map-marker"></i>
                      <span className="ms-2 address">
                        {`State: ${order?.orderDeliveryAddress?.state}`}
                      </span>
                    </DeliveryAddress>
                    <DeliveryAddress>
                      <i className="fa fa-map-marker"></i>
                      <span className="ms-2 address">
                        {`City: ${order?.orderDeliveryAddress?.city}`}
                      </span>
                    </DeliveryAddress>
                    <DeliveryAddress>
                      <i className="fa fa-map-marker"></i>
                      <span className="ms-2 address">
                        {`Country: ${order?.orderDeliveryAddress?.country}`}
                      </span>
                    </DeliveryAddress>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="h4">Summery</CardTitle>
                    <hr />
                 
                      <Summery>
                        <div className='item'>
                          <span>Subtotal</span>
                          <span>{order?.summery?.netPrice}</span>
                        </div>
                        <div className='item'>
                          <span>Coupon Discount</span>
                          <span>{order?.summery?.coupon}</span>
                        </div>
                        <div className='item'>
                          <span>Discount</span>
                          <span>{order?.summery?.discount}</span>
                        </div>
                        <div className='item'>
                          <span>Payable Total</span>
                          <span>{order?.summery?.total}</span>
                        </div>
                      </Summery>
                  
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <div
                  ref={mapRef}
                  className="map"
                  style={{ width: "100%", height: "250px" }}
                ></div>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

const DeliveryAddress = styled.div`
  .address {
    font-size: 15px;
    font-weight: 500;
    font-family: "Courier New", Courier, monospace;
  }
`;

const Summery = styled.div`

  .item{
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
    }
  
`;

export default OrderDetails;
