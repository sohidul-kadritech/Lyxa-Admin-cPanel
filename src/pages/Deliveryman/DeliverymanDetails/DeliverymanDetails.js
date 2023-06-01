import React, { useEffect, useState } from 'react';
import Lightbox from 'react-image-lightbox';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, Col, Container, Row } from 'reactstrap';
import styled from 'styled-components';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MoneyIcon from '@mui/icons-material/Money';
import MopedIcon from '@mui/icons-material/Moped';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import noPhoto from '../../../assets/images/noPhoto.jpg';
import AppPagination from '../../../components/AppPagination';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import FlagsAndReviews from '../../../components/FlagsAndReviews';
import GlobalWrapper from '../../../components/GlobalWrapper';
import InfoTwo from '../../../components/InfoTwo';
import InfoTwoWrapper from '../../../components/InfoTwoWrapper';
import OrderTable from '../../../components/OrderTable';
import { callApi } from '../../../components/SingleApiCall';
import { useGlobalContext } from '../../../context';
import { SINGLE_DELIVERY_MAN } from '../../../network/Api';
import { getDeliveryAllOrder } from '../../../store/DeliveryMan/DeliveryManAction';

function DeliverymanDetails() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const { deliveryMans, orders, paging, hasNextPage, hasPreviousPage, currentPage } = useSelector(
    (state) => state.deliveryManReducer
  );
  // const { account_type, adminType } = useSelector((store) => store.Login.admin);
  const { currentUser, general } = useGlobalContext();
  const { userType, adminType } = currentUser;

  const [deliveryMan, setDeliveryMan] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();
  const currency = general?.currency?.code?.toUpperCase();

  useEffect(async () => {
    if (id) {
      dispatch(getDeliveryAllOrder(true, id));
      const findMan = deliveryMans.find((man) => man._id === id);
      if (findMan) {
        setDeliveryMan(findMan);
      } else {
        const data = await callApi(id, SINGLE_DELIVERY_MAN, 'delivery');
        if (data) {
          setDeliveryMan(data);
        } else {
          history.push('/deliveryman/list', { replace: true });
        }
      }
    }
  }, [id]);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Details" title="Delivery Boy" isRefresh={false} />

          {isOpen && (
            <Lightbox
              mainSrc={selectedImg}
              enableZoom
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
                  <Button outline color="primary" onClick={() => history.push(`/deliveryman/edit/${id}`)}>
                    Edit
                  </Button>
                  {userType === 'admin' && adminType === 'admin' && (
                    <Button
                      outline
                      color="primary"
                      onClick={() => history.push(`/add-wallet/single-delivery-transactions/${id}`)}
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
                    <div style={{ position: 'relative' }}>
                      <img
                        className="cursor-pointer rounded"
                        alt="User"
                        src={deliveryMan?.image ?? noPhoto}
                        loading="lazy"
                        height="100%"
                        width="100%"
                      />
                      <div
                        className={`img-tag ${
                          deliveryMan?.liveStatus === 'online' ? 'img-tag-active' : 'img-tag-inactive'
                        }`}
                      >
                        {deliveryMan?.liveStatus}
                      </div>
                    </div>
                  </ImageWrapper>
                </Col>
                <Col lg={5}>
                  <InfoTwoWrapper>
                    <InfoTwo name="Name" value={`${deliveryMan?.name}`} Icon={PersonOutlineOutlinedIcon} />
                    <InfoTwo
                      name="Email"
                      value={deliveryMan?.email}
                      Icon={AlternateEmailOutlinedIcon}
                      classes="text-lowercase"
                    />
                    <InfoTwo name="Address" value={`${deliveryMan?.address}`} Icon={LocationOnIcon} />
                    <InfoTwo name="Vahicle Type" value={`${deliveryMan?.vehicleType}`} Icon={MopedIcon} />
                    <InfoTwo name="Vahicle No" value={`${deliveryMan?.vehicleNumber}`} Icon={MopedIcon} />
                    <InfoTwo name="Address" value={`${deliveryMan?.address}`} Icon={RoomOutlinedIcon} />
                  </InfoTwoWrapper>
                </Col>
                <Col lg={5}>
                  <InfoTwoWrapper>
                    <InfoTwo
                      name="Status"
                      value={`${deliveryMan?.status}`}
                      Icon={deliveryMan?.status === 'active' ? ToggleOnIcon : ToggleOffIcon}
                    />
                    <InfoTwo
                      name="Live Status"
                      value={`${deliveryMan?.liveStatus}`}
                      Icon={deliveryMan?.liveStatus === 'online' ? ToggleOnIcon : ToggleOffIcon}
                    />
                    <InfoTwo name="Total Income" value={`${deliveryMan?.totalIncome} ${currency}`} Icon={MoneyIcon} />
                    <InfoTwo name="Balance" value={`${deliveryMan?.balance} ${currency}`} Icon={AccountBalanceIcon} />
                    <InfoTwo name="Orders" value={`${deliveryMan?.totalOrder}`} Icon={LocalShippingIcon} />
                    <InfoTwo name="Shift" value={`${deliveryMan?.shift}`} Icon={RoomOutlinedIcon} />
                  </InfoTwoWrapper>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Row className="mb-4">
            <Col lg={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography>Images</Typography>
                </AccordionSummary>
                <AccordionDetails>
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
                          src={deliveryMan?.vehicleRegistrationDocument ?? noPhoto}
                          width="100%"
                          height="100%"
                        />
                        <small>Vahicle Document</small>
                      </ImageWrapper>
                    </Col>
                  </Row>
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
                  lisener={(page) => dispatch(getDeliveryAllOrder(true, deliveryMan?._id, page))}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

const ImageWrapper = styled.div`
  text-align: center;
  height: 150px;
  width: 150px;
`;

export default DeliverymanDetails;
