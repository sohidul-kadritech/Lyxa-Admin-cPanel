import React, { useEffect, useState } from "react";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import requestApi from "../../../network/httpRequest";
import { MAP_URL, SINGLE_DELIVERY_MAN } from "../../../network/Api";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import styled from "styled-components";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import Lightbox from "react-image-lightbox";

import {
  getDeliveryAllOrder,
  setDeliveryStatusFalse,
} from "../../../store/DeliveryMan/DeliveryManAction";

import OrderTable from "../../../components/OrderTable";
import AppPagination from "../../../components/AppPagination";
import FlagsAndReviews from "../../../components/FlagsAndReviews";
import { callApi } from "../../../components/SingleApiCall";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import noPhoto from "../../../assets/images/noPhoto.jpg";
import InfoTwo from "../../../components/InfoTwo";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import MoneyIcon from "@mui/icons-material/Money";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import MopedIcon from "@mui/icons-material/Moped";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";

const DeliverymanDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    deliveryMans,
    orders,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
  } = useSelector((state) => state.deliveryManReducer);
  const { account_type, adminType } = useSelector(store => store.Login.admin);

  const [deliveryMan, setDeliveryMan] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const currency = useSelector(store => store.settingsReducer.appSettingsOptions.currency).toUpperCase();



  useEffect(async () => {
    if (id) {
      // dispatch(setDeliveryStatusFalse());
      dispatch(getDeliveryAllOrder(true, id));
      const findMan = deliveryMans.find((man) => man._id == id);
      if (findMan) {
        setDeliveryMan(findMan);
      } else {
        const data = await callApi(id, SINGLE_DELIVERY_MAN, "delivery");
        if (data) {
          setDeliveryMan(data);
        } else {
          history.push("/deliveryman/list", { replace: true });
        }
      }
    }
  }, [id]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Lyxa"
              breadcrumbItem={"Details"}
              title="Delivery Boy"
              isRefresh={false}
            />

            {isOpen && (
              <Lightbox
                mainSrc={selectedImg}
                enableZoom={true}
                imageCaption="img"
                onCloseRequest={() => {
                  setIsOpen(!isOpen);
                }}
              />
            )}

            <Card className="pb-5">
              <CardBody>
                <div className="d-flex justify-content-between">
                  <CardTitle>Delivery Man Informations</CardTitle>
                  <div>
                    <Button
                      outline={true}
                      color="primary"
                      onClick={() => history.push(`/deliveryman/edit/${id}`)}
                    >
                      Edit
                    </Button>
                    {account_type === "admin" && adminType === "admin" && (
                      <Button
                        outline={true}
                        color="primary"
                        onClick={() =>
                          history.push(
                            `/add-wallet/single-delivery-transactions/${id}`
                          )
                        }
                        className="ms-2"
                      >
                        Payment history
                      </Button>
                    )}
                  </div>
                </div>
                <hr className="my-3" />
                <Row>
                  <Col lg={2}>
                    <ImageWrapper className="text-center">
                      <div style={{position: 'relative'}}>
                      <img
                        className="cursor-pointer rounded"
                        alt="User"
                        src={deliveryMan?.image ?? noPhoto}
                        loading="lazy"
                        height="100%"
                        width="100%"
                      />
                      <div className={`img-tag ${deliveryMan?.liveStatus === 'online' ? 'img-tag-active' : 'img-tag-inactive'}`}>
                        {deliveryMan?.liveStatus}
                      </div>
                      </div>
                    </ImageWrapper>
                  </Col>
                  <Col lg={5}>
                    <InfoTwo
                      value={`${deliveryMan?.name} (Name)`}
                      Icon={PersonOutlineOutlinedIcon}
                    />
                    <InfoTwo
                      value={deliveryMan?.email}
                      Icon={AlternateEmailOutlinedIcon}
                      classes="text-lowercase"
                    />
                    <InfoTwo
                      value={`${deliveryMan?.address}`}
                      Icon={LocationOnIcon}
                    />
                    <InfoTwo
                      value={`${deliveryMan?.vehicleType} (Vahicle Type)`}
                      Icon={MopedIcon}
                    />
                    <InfoTwo
                      value={`${deliveryMan?.vehicleNumber} (Vahicle No)`}
                      Icon={MopedIcon}
                    />
                    <InfoTwo
                      value={`${deliveryMan?.address}`}
                      Icon={RoomOutlinedIcon}
                    />
                  </Col>
                  <Col lg={5}>
                    <InfoTwo
                      value={`${deliveryMan?.status} (Status)`}
                      Icon={
                        deliveryMan?.status === "active"
                          ? ToggleOnIcon
                          : ToggleOffIcon
                      }
                    />
                    <InfoTwo
                      value={`${deliveryMan?.liveStatus} (Live Status)`}
                      Icon={
                        deliveryMan?.liveStatus === "online"
                          ? ToggleOnIcon
                          : ToggleOffIcon
                      }
                    />
                    <InfoTwo
                      value={`${deliveryMan?.totalIncome} ${currency} (Total Income's)`}
                      Icon={MoneyIcon}
                    />
                    <InfoTwo
                      value={`${deliveryMan?.balance} ${currency} (Balance's)`}
                      Icon={AccountBalanceIcon}
                    />
                    <InfoTwo
                      value={`${deliveryMan?.totalOrder} (Order's)`}
                      Icon={LocalShippingIcon}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Row className="mb-4">
              <Col lg={6}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Images</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <Row>
                        <Col md={6} className="d-flex justify-content-center">
                          <ImageWrapper>
                            <img
                              onClick={() => {
                                setIsOpen(true);
                                setSelectedImg(deliveryMan?.nationalIdDocument);
                              }}
                              className="img-fluid cursor-pointer  rounded"
                              alt="NID"
                              src={deliveryMan?.nationalIdDocument ?? noPhoto}
                              width="100%"
                              height="100%"
                              loading="lazy"
                            />
                            <small>NID</small>
                          </ImageWrapper>
                        </Col>
                        <Col md={6} className="d-flex justify-content-center">
                          <ImageWrapper>
                            <img
                              onClick={() => {
                                setIsOpen(true);
                                setSelectedImg(deliveryMan?.nationalIdDocument);
                              }}
                              className="img-fluid cursor-pointer rounded"
                              alt="Vahicle Document"
                              src={
                                deliveryMan?.vehicleRegistrationDocument ??
                                noPhoto
                              }
                              width="100%"
                              height="100%"
                            />
                            <small>Vahicle Document</small>
                          </ImageWrapper>
                        </Col>
                      </Row>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Col>
              <Col lg={6}>
                <FlagsAndReviews flags={deliveryMan?.flags} />
              </Col>
            </Row>

            <div>
              <OrderTable orders={orders} />
            </div>
            <Row>
              <Col xl={12}>
                <div className="d-flex justify-content-center">
                  <AppPagination
                    paging={paging}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    currentPage={currentPage}
                    lisener={(page) =>
                      dispatch(
                        getDeliveryAllOrder(true, deliveryMan?._id, page)
                      )
                    }
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

const ImageWrapper = styled.div`
  text-align: center;
  height: 150px;
  width: 150px;
`;

export default DeliverymanDetails;
