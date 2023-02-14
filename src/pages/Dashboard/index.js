// import 'chartist/dist/scss/chartist.scss';
import React, { lazy, Suspense, useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import { Card, CardBody, Col, Container, Row, Spinner } from 'reactstrap';

// i18n
import { useDispatch, useSelector } from 'react-redux';

import { TextField } from '@mui/material';
import styled from 'styled-components';

import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import MopedOutlinedIcon from '@mui/icons-material/MopedOutlined';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import SettingsInputSvideoIcon from '@mui/icons-material/SettingsInputSvideo';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import noPhoto from '../../assets/images/noPhoto.jpg';
import GlobalWrapper from '../../components/GlobalWrapper';
import InfoTwo from '../../components/InfoTwo';
import InfoTwoWrapper from '../../components/InfoTwoWrapper';
import { MAP_URL } from '../../network/Api';
import {
  getDashboardSummary,
  updateDashboardCardEndDate,
  updateDashboardCardStartDate,
} from '../../store/Dashboard/dashboardAction';

const AdminDashboard = lazy(() => import('../../components/AdminDashboard'));
const SellerDashboard = lazy(() => import('../../components/SellerDashboard'));
const ShopDashboard = lazy(() => import('../../components/ShopDashboard'));

function Dashboard() {
  const dispatch = useDispatch();

  const {
    dashboardData: { summary = {}, top_activity },
    startDate,
    endDate,
    loading,
  } = useSelector((state) => state.dashboardReducer);

  const { account_type, adminType } = useSelector((store) => store.Login.admin);

  useEffect(() => {
    if (startDate || endDate) {
      dispatch(
        getDashboardSummary(
          account_type === 'admin' && adminType !== 'customerService'
            ? 'admin'
            : account_type === 'seller'
            ? 'seller'
            : 'shop'
        )
      );
    }
  }, [startDate, endDate]);

  return (
    <div className="page-content">
      <GlobalWrapper>
        <MetaTags>
          <title>Lyxa</title>
        </MetaTags>
        <Container fluid>
          <Card className="page-title-box p-0">
            <CardBody
              style={{
                boxShadow: '0 4px 2px -2px lightgray',
                padding: '10px 15px',
              }}
            >
              <Row className="align-items-center">
                <Col md={account_type === 'shop' ? 9 : 6}>
                  {account_type === 'admin' ? (
                    <>
                      <h6 className="page-title text-danger">Dashboard</h6>
                      <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item active">Welcome to Lyxa Dashboard</li>
                      </ol>
                    </>
                  ) : account_type === 'seller' ? (
                    <SellerInfo />
                  ) : (
                    <ShopInfo />
                  )}
                </Col>
                <Col md={account_type === 'shop' ? 3 : 6}>
                  <div className={`d-flex ${account_type === 'shop' && 'flex-column'}`}>
                    <DateFilter className=" me-2 ">
                      <div className="date-label">
                        <small>Start</small>
                        <h5>Date</h5>
                      </div>
                      <TextField
                        type="date"
                        className="form-control"
                        id="example-time-input"
                        variant="standard"
                        format="YYYY-MM-DD"
                        value={startDate}
                        onChange={(e) => dispatch(updateDashboardCardStartDate(e.target.value))}
                      />
                    </DateFilter>
                    <DateFilter className={`${account_type !== 'shop' && 'ps-3'}`}>
                      <div className="date-label">
                        <small>End</small>
                        <h5>Date</h5>
                      </div>
                      <TextField
                        type="date"
                        className="form-control"
                        id="example-time-input"
                        variant="standard"
                        format="YYYY-MM-DD"
                        value={endDate}
                        onChange={(e) => dispatch(updateDashboardCardEndDate(e.target.value))}
                      />
                    </DateFilter>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {loading && (
            <div className="text-center">
              <Spinner animation="border" color="success" />
            </div>
          )}

          <div>
            {account_type === 'admin' ? (
              <Suspense fallback={<div>Loading...</div>}>
                <AdminDashboard summary={summary} topActivity={top_activity} />
              </Suspense>
            ) : account_type === 'seller' ? (
              <Suspense fallback={<div>Loading...</div>}>
                <SellerDashboard summary={summary} />
              </Suspense>
            ) : (
              <Suspense fallback={<div>Loading...</div>}>
                <ShopDashboard summary={summary} />
              </Suspense>
            )}
          </div>
        </Container>
      </GlobalWrapper>
    </div>
  );
}

const DateFilter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  .date-label {
    width: 65px;
  }
`;

const InfoWrapper = styled.div`
  .img_wrapper {
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      height: 100%;
      border: 1px solid #dd5f5f;
    }
  }

  .text-capitalize {
    background-color: #f3f3f3;
    padding: 5px 13px;
    border-radius: 15px;
    margin-bottom: 0 !important;
  }
`;

function SellerInfo() {
  const {
    admin: {
      profile_photo,
      name,
      company_name,
      status,
      sellerType,
      addressSeller: { address, latitude, longitude },
      phone_number,
      email,
    },
  } = useSelector((state) => state.Login);

  return (
    <InfoWrapper>
      <Row>
        <Col md={2} className="px-0 d-flex align-items-center justify-content-center">
          <div className="img_wrapper">
            <img
              className="rounded-circle avatar-xl cursor-pointer"
              style={{ borderRadius: 200, width: 90, height: 90, objectFit: 'cover' }}
              alt="Seller"
              src={!profile_photo ? noPhoto : profile_photo}
            />
          </div>
        </Col>
        <Col md={10}>
          <div className="d-flex align-items-center pb-1">
            <h5 className="me-2">
              Welcome, <span className="text-danger">{company_name}</span>
            </h5>
            <h6 className="text-capitalize mx-3">{`Status - ${status}`}</h6>
            <h6 className="text-capitalize">{sellerType}</h6>
          </div>
          <InfoTwoWrapper>
            <InfoTwo value={`${name}`} Icon={PersonOutlineOutlinedIcon} name="Manager" />
            <InfoTwo
              value={`${address}`}
              mapLink={`${MAP_URL}?z=10&t=m&q=loc:${latitude}+${longitude}`}
              Icon={RoomOutlinedIcon}
              name="Location"
            />
            <InfoTwo value={phone_number} Icon={LocalPhoneOutlinedIcon} name="Phone" />
            <InfoTwo name="Email" classes="text-lowercase" value={email} Icon={AlternateEmailOutlinedIcon} />
          </InfoTwoWrapper>
        </Col>
      </Row>
    </InfoWrapper>
  );
}

function ShopInfo() {
  const {
    admin: {
      shopLogo,
      shopStatus,
      shopType,
      isFeatured,
      cuisineType,
      shopName,
      phone_number,
      shopStartTimeText,
      shopEndTimeText,
      email,
      rating,
      minOrderAmount,
      expensive,
      haveOwnDeliveryBoy,
      deliveryFee,
      deals,
      address: { address, latitude, longitude },
    },
  } = useSelector((state) => state.Login);
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();

  return (
    <InfoWrapper>
      <Row>
        <Col md={1} className="px-0 d-flex align-items-center justify-content-center">
          <div className="img_wrapper">
            <img
              style={{ borderRadius: 200, width: 90, height: 90, objectFit: 'cover' }}
              className="rounded-circle avatar-xl cursor-pointer"
              alt="Seller"
              src={!shopLogo ? noPhoto : shopLogo}
            />
          </div>
        </Col>
        <Col md={10}>
          <div className="d-flex align-items-center pb-1">
            <h5>
              Welcome, <span className="text-danger me-2">{shopName}</span>
            </h5>
            <h6 className="text-capitalize me-1">{`Status - ${shopStatus}`}</h6>
            <h6 className="text-capitalize me-1">{shopType}</h6>
            <h6 className="text-capitalize me-1">{`Featured - ${isFeatured ? 'Yes' : 'No'}`}</h6>
            <h6 className="text-capitalize me-1">{`Cuisines - ${
              cuisineType.length > 0 ? cuisineType[0]?.name : 'N/A'
            }`}</h6>
          </div>

          <Row className="pt-2">
            <Col lg={4}>
              <InfoTwoWrapper>
                <InfoTwo
                  mapLink={`${MAP_URL}?z=10&t=m&q=loc:${latitude}+${longitude}`}
                  value={address}
                  Icon={RoomOutlinedIcon}
                  name="Location"
                />
                <InfoTwo
                  value={`Mon to Fri - ${shopStartTimeText} ${
                    shopStartTimeText.split(':')[0] < 12 ? 'AM' : 'PM'
                  } - ${shopEndTimeText} ${shopEndTimeText.split(':')[0] < 12 ? 'AM' : 'PM'}`}
                  Icon={AccessTimeOutlinedIcon}
                  name="Open"
                />
                <InfoTwo name="Phone" value={phone_number} Icon={LocalPhoneOutlinedIcon} />
                <InfoTwo name="Email" classes="text-lowercase" value={email} Icon={AlternateEmailOutlinedIcon} />
              </InfoTwoWrapper>
            </Col>

            <Col lg={4}>
              <InfoTwoWrapper>
                <InfoTwo name="Min Order" value={`${minOrderAmount} ${currency}`} Icon={StorefrontOutlinedIcon} />
                <InfoTwo
                  value={`${
                    rating === 4
                      ? 'Excellent'
                      : rating === 3
                      ? 'Very good'
                      : rating === 2
                      ? 'Good'
                      : rating === 1
                      ? 'Bad'
                      : ''
                  }`}
                  name="Rating"
                  Icon={SentimentSatisfiedOutlinedIcon}
                />
                <InfoTwo
                  name="Price Range"
                  value={`${expensive === 1 ? '$' : expensive === 2 ? '$$' : expensive === '3' ? '$$$' : '$$$$'}`}
                  Icon={WorkHistoryOutlinedIcon}
                />
              </InfoTwoWrapper>
            </Col>

            <Col lg={4}>
              <InfoTwoWrapper>
                <InfoTwo name="Delivery Type" value={`${haveOwnDeliveryBoy ? 'Self' : 'Lyxa'}`} Icon={PaymentIcon} />
                <InfoTwo name="Delivery Fee" value={`${deliveryFee}`} Icon={MopedOutlinedIcon} />
                <InfoTwo name="No Deals" value={deals.length || ''} Icon={SettingsInputSvideoIcon} />
              </InfoTwoWrapper>
            </Col>
          </Row>
        </Col>
      </Row>
    </InfoWrapper>
  );
}

export default Dashboard;
