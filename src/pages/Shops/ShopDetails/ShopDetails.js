/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Label, Modal, Row } from 'reactstrap';
import styled from 'styled-components';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from '@mui/material';

import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined';
import FeaturedPlayListOutlinedIcon from '@mui/icons-material/FeaturedPlayListOutlined';
import FoodBankOutlinedIcon from '@mui/icons-material/FoodBankOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PaymentIcon from '@mui/icons-material/Payment';
import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import Lightbox from 'react-image-lightbox';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import DealForAdd from '../../../components/DealForAdd';
import FlagsAndReviews from '../../../components/FlagsAndReviews';
import GlobalWrapper from '../../../components/GlobalWrapper';
import InfoTwo from '../../../components/InfoTwo';
import InfoTwoWrapper from '../../../components/InfoTwoWrapper';
import { callApi } from '../../../components/SingleApiCall';
import { successMsg } from '../../../helpers/successMsg';
import { API_URL, DOWNLOAD_PRODUCT_TEMPLATE, MAP_URL, SINGLE_SHOP, UPLOAD_PRODUCT_FILE } from '../../../network/Api';
import requestApi from '../../../network/httpRequest';
import {
  ShopLiveStatus,
  addShopMaxDiscont,
  deleteDealOfShop,
  setAsFeaturedShop,
  updateShopIsUpdated,
  updateShopStatus,
} from '../../../store/Shop/shopAction';
// eslint-disable-next-line import/extensions
import ReviewTable from '../../../components/ReviewTable.js';

import { useGlobalContext } from '../../../context';
import { getAllAppSettings } from '../../../store/Settings/settingsAction';

// const marketingTypesInit = {
//   free_delivery: false,
//   double_menu: false,
//   percentage: false,
//   reward: false,
// };

function ShopDetails() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { appSettingsOptions } = useSelector((state) => state.settingsReducer);
  const { shops, status, isUpdated, loading } = useSelector((state) => state.shopReducer);
  const [shop, setShop] = useState(null);
  const [liveStatus, setLiveStatus] = useState(false);
  const [modalCenter, setModalCenter] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isImportProductOpen, setIsImportProductOpen] = useState(false);
  const [productsFile, setProductsFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const { account_type } = useSelector((store) => store.Login.admin);
  const { currentUser, general } = useGlobalContext();
  const { userType } = currentUser;

  const currency = general?.currency?.symbol;

  const getShop = async () => {
    const data = await callApi(id, SINGLE_SHOP, 'shop');
    console.log(data);
    if (data) {
      const activeStatus = data?.liveStatus === 'online';
      setLiveStatus(activeStatus);
      setShop(data);
    } else {
      history.push('/shops/list', { replace: true });
    }
  };

  useEffect(() => {
    if (id) {
      const findShop = shops.find((item) => item._id === id);
      if (findShop) {
        const activeStatus = findShop?.liveStatus === 'online';
        setLiveStatus(activeStatus);
        setShop(findShop);
      } else {
        getShop();
      }
    }
  }, [id, isUpdated]);

  // CHANGE LIVE STATUS
  const changeLiveStatus = (e) => {
    setLiveStatus(e.target.checked);
    const status = e.target.checked;
    dispatch(
      ShopLiveStatus({
        id: shop._id,
        liveStatus: status ? 'online' : 'busy',
      })
    );
  };

  useEffect(() => {
    if (status) {
      setModalCenter(false);
      (async function getShop() {
        const data = await callApi(shop?._id, SINGLE_SHOP, 'shop');

        if (data) {
          const activeStatus = data?.liveStatus === 'online';
          setLiveStatus(activeStatus);
          setShop(data);
        }
      })();
    }
  }, [status]);

  const [maxDiscountModal, setMaxDiscountModal] = useState(false);
  const [newMaxDiscount, setNewMaxDiscount] = useState('');

  const updateShopMaxDiscount = () => {
    dispatch(addShopMaxDiscont({ shopId: shop._id, maxDiscount: newMaxDiscount }));
  };

  useEffect(() => {
    if (appSettingsOptions.maxDiscount.length === 0) {
      dispatch(getAllAppSettings());
    }
  }, []);

  useEffect(() => {
    if (isUpdated) {
      setMaxDiscountModal(false);
      dispatch(updateShopIsUpdated(false));
    }
  }, [isUpdated]);

  // SET AS FEATURED
  const setAsFeatured = () => {
    dispatch(
      setAsFeaturedShop({
        id: shop._id,
        isFeatured: !shop?.isFeatured,
      })
    );
  };

  // DELETE DEAL
  const deleteDeal = (dealId) => {
    dispatch(
      deleteDealOfShop({
        shopId: id,
        dealId,
      })
    );
  };

  // UPDATE SHOP STATUS
  // eslint-disable-next-line consistent-return
  const updateActiveStatus = () => {
    if (shop?.seller?.status === 'inactive') {
      return successMsg('Seller is inactive. Please contact with your seller.', 'error');
    }
    dispatch(
      updateShopStatus({
        id: shop?._id,
        status: shop?.shopStatus === 'active' ? 'inactive' : 'active',
      })
    );
  };

  const updatePriceRange = (value) => (value === 1 ? '$' : value === 2 ? '$$' : value === '3' ? '$$$' : '$$$$');

  // DOWNLOAD PRODUCT TEMPLATE
  const downloadProductTemplate = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { data } = await requestApi().request(DOWNLOAD_PRODUCT_TEMPLATE, {
        params: {
          sellerId: shop?.seller?._id,
        },
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  // IMPORT PRODUCT FILE
  // eslint-disable-next-line consistent-return
  const submitProductFile = async () => {
    if (!productsFile) {
      return successMsg('Upload products file');
    }
    const fileExt = productsFile.name.split('.');
    const validExts = ['xlsx', 'xls'];
    const checkExt = validExts.includes(fileExt[1]);
    if (!checkExt) {
      return successMsg('Upload valid products file');
    }

    const formData = new FormData();
    formData.append('shopId', shop?._id);
    formData.append('file', productsFile);

    try {
      setIsLoading(true);
      const { data } = await requestApi().request(UPLOAD_PRODUCT_FILE, {
        method: 'POST',
        data: formData,
      });

      console.log(data);

      if (data?.data?.products.length > 0) {
        setIsLoading(false);
        successMsg(data?.message, 'success');
        setIsImportProductOpen(false);
      } else {
        setIsLoading(false);
        successMsg('No products file found', 'error');
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e.message);
    }
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Details" title="Shop" isRefresh={false} />
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
          <Card>
            <CardBody>
              <HeaderWrapper>
                <h4>Shop</h4>
                <div className="d-flex flex-wrap  align-items-center">
                  <Button outline color="success" onClick={downloadProductTemplate} className="me-3">
                    <TemplateButton
                      href={`${API_URL}${DOWNLOAD_PRODUCT_TEMPLATE}?sellerId=${shop?.seller?._id}`}
                      target="_blank"
                    >
                      Download Product Template
                    </TemplateButton>
                  </Button>
                  <Button
                    outline
                    color="success"
                    onClick={() => setIsImportProductOpen(!isImportProductOpen)}
                    className="me-3"
                  >
                    Import Products
                  </Button>
                  <Button outline color="success" onClick={() => setMaxDiscountModal(true)} className="me-3">
                    Add Max Discount
                  </Button>
                  {userType === 'admin' && (
                    <>
                      <Button
                        outline
                        color="success"
                        onClick={() => {
                          // setCurrentMarketing('percentage');
                          history.push(`/shops/marketing/${shop?._id}`, shop);
                        }}
                        className="me-3"
                      >
                        Marketing Settings
                      </Button>
                      <Button outline color="success" onClick={setAsFeatured} className="me-3">
                        {!shop?.isFeatured ? 'Set as featured' : 'Remove featured'}
                      </Button>
                      <Button outline color="success" onClick={updateActiveStatus} className="me-3">
                        {shop?.shopStatus === 'active' ? 'Inactive' : 'Activate'}
                      </Button>
                    </>
                  )}
                  <div>
                    <Switch
                      checked={liveStatus}
                      onChange={changeLiveStatus}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <Label className="mt-2">{liveStatus ? 'Online' : 'Busy'}</Label>
                  </div>
                </div>
              </HeaderWrapper>
              <hr />
              <Row>
                <Col xl={4}>
                  <InfoTwoWrapper>
                    <InfoTwo
                      Icon={ApartmentOutlinedIcon}
                      value={`${shop?.seller?.name}`}
                      name="Seller"
                      link={userType === 'admin' ? `/seller/details/${shop?.seller?._id}` : ''}
                    />
                    <InfoTwo Icon={StoreOutlinedIcon} value={`${shop?.shopName}`} name="Shop Name" />
                    <InfoTwo Icon={LocalPhoneOutlinedIcon} value={shop?.phone_number} name="Phone" />
                    <InfoTwo
                      Icon={AlternateEmailOutlinedIcon}
                      value={shop?.email}
                      name="Email"
                      classes="text-lowercase"
                    />
                    <InfoTwo
                      Icon={RoomOutlinedIcon}
                      value={shop?.address.address}
                      mapLink={`${MAP_URL}?z=10&t=m&q=loc:${shop?.address?.latitude}+${shop?.address?.longitude}`}
                      name="Location"
                    />
                    {/* <InfoTwo
                      value={`Mon to Fri - ${shop?.shopStartTimeText} ${
                        shop?.shopStartTimeText?.split(':') && shop?.shopStartTimeText?.split(':')[0] < 12 ? 'AM' : 'PM'
                      } - ${shop?.shopEndTimeText} ${shop?.shopEndTimeText.split(':')[0] < 12 ? 'AM' : 'PM'}`}
                      Icon={AccessTimeOutlinedIcon}
                      name="Available"
                    /> */}
                    <InfoTwo Icon={StoreOutlinedIcon} value={`${shop?.shopType}`} name="Shop Type" />
                    <InfoTwo
                      Icon={AccountBalanceWalletOutlinedIcon}
                      value={`${shop?.paymentOption?.join(', ')}`}
                      name="Payment Options"
                    />
                  </InfoTwoWrapper>
                </Col>
                <Col xl={4}>
                  <InfoTwoWrapper>
                    <InfoTwo value={`${shop?.shopStatus}`} Icon={AutorenewOutlinedIcon} name="Status" />
                    <InfoTwo
                      value={`${
                        shop?.rating === 4
                          ? 'Excellent'
                          : shop?.rating === 3
                          ? 'Very good'
                          : shop?.rating === 2
                          ? 'Good'
                          : shop?.rating === 1
                          ? 'Bad'
                          : ''
                      }`}
                      Icon={SentimentSatisfiedOutlinedIcon}
                      name="Rating"
                    />
                    <InfoTwo
                      Icon={ProductionQuantityLimitsOutlinedIcon}
                      value={`${shop?.totalOrder}`}
                      name="Total Orders"
                    />
                    <InfoTwo
                      Icon={FeaturedPlayListOutlinedIcon}
                      value={`${shop?.isFeatured ? 'Yes' : 'No'}`}
                      name="Featured"
                    />
                    <InfoTwo
                      Icon={WorkHistoryOutlinedIcon}
                      value={`${shop?.minOrderAmount} ${currency}`}
                      name="Minimum Order"
                    />
                    {shop?.haveOwnDeliveryBoy && (
                      <InfoTwo Icon={PaymentIcon} value={`${shop?.deliveryFee ?? 0} ${currency}`} name="Delivery Fee" />
                    )}
                    <InfoTwo
                      Icon={DeliveryDiningOutlinedIcon}
                      value={`${shop?.freeDelivery ? 'Yes' : 'No'}`}
                      name="Free Delivery"
                    />
                    <InfoTwo
                      Icon={PaidOutlinedIcon}
                      value={`${shop?.maxDiscount ? shop?.maxDiscount : 0}`}
                      name={`Max Discount (${currency})`}
                    />
                  </InfoTwoWrapper>
                </Col>
                <Col xl={4}>
                  <InfoTwoWrapper>
                    {shop?.foodType && (
                      <InfoTwo Icon={FoodBankOutlinedIcon} value={`${shop?.foodType}`} name="Food Type" />
                    )}
                    <InfoTwo
                      Icon={FeaturedPlayListOutlinedIcon}
                      value={`${shop?.orderValue?.productAmount / shop?.orderValue?.count || 0}`}
                      name="Average Order Value"
                    />

                    <InfoTwo
                      Icon={PaidOutlinedIcon}
                      value={`${updatePriceRange(shop?.expensive)}`}
                      name="Price Range"
                    />

                    {shop?.tags?.length > 0 && (
                      <InfoTwo
                        Icon={TagOutlinedIcon}
                        value={`${shop?.tags?.map((item) => item).join(', ')}`}
                        name="Tags"
                      />
                    )}
                    {shop?.cuisineType?.length > 0 && (
                      <InfoTwo
                        Icon={FastfoodOutlinedIcon}
                        value={`${shop?.cuisineType?.map((item) => item.name).join(', ')}`}
                        name="Cuisines"
                      />
                    )}
                    <InfoTwo Icon={AccountBalanceOutlinedIcon} value={`${shop?.bank_name}`} name="Bank Name" />
                    <InfoTwo
                      Icon={AccountBalanceWalletOutlinedIcon}
                      value={`${shop?.account_name}`}
                      name="Bank Account Name"
                    />
                    <InfoTwo Icon={SavingsOutlinedIcon} value={`${shop?.account_number}`} name="Bank Account No" />
                  </InfoTwoWrapper>
                </Col>
              </Row>
            </CardBody>
          </Card>
          {/* SHOP FLAGS AND REVIEWS */}
          <Row className="mb-3">
            <Col xl={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography>Order Reviews</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ReviewTable reviews={shop?.reviews} isFromOrder={false} />
                </AccordionDetails>
              </Accordion>
            </Col>
            <Col xl={6}>
              <FlagsAndReviews flags={shop?.flags} />
            </Col>
          </Row>
          {/* SHOP PHOTOS */}
          <Row className="mb-5">
            <Col xl={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography>Shop Photos</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {shop?.shopBanner || shop?.shopPhotos || shop?.shopLogo ? (
                    <Row>
                      <Col md={6}>
                        <ImageWrapper
                          style={{
                            width: '100%',
                            height: '200px',
                            padding: '10px 0px',
                          }}
                        >
                          <img
                            className="img-fluid cursor-pointer cursor-pointer"
                            alt="partner"
                            src={shop?.shopLogo}
                            onClick={() => {
                              setIsOpen(true);
                              setSelectedImg(shop?.shopLogo);
                            }}
                            width="100%"
                            // eslint-disable-next-line react/no-unknown-property
                            lazy="loading"
                          />
                          <small>Shop Logo</small>
                        </ImageWrapper>
                      </Col>
                      <Col md={6}>
                        {shop.shopBanner ? (
                          <ImageWrapper
                            style={{
                              width: '100%',
                              height: '200px',
                              padding: '10px 0px',
                            }}
                          >
                            <img
                              onClick={() => {
                                setIsOpen(true);
                                setSelectedImg(shop?.shopBanner);
                              }}
                              className="img-fluid cursor-pointer"
                              alt="shop banner"
                              src={shop?.shopBanner}
                              width="100%"
                              // eslint-disable-next-line react/no-unknown-property
                              lazy="loading"
                            />
                            <small>Shop Banner</small>
                          </ImageWrapper>
                        ) : null}
                      </Col>
                      <Col md={4}>
                        {shop.shopPhotos ? (
                          <ImageWrapper
                            style={{
                              width: '100%',
                              height: '200px',
                              padding: '10px 0px',
                            }}
                          >
                            <img
                              onClick={() => {
                                setIsOpen(true);
                                setSelectedImg(shop?.shopPhotos[0]);
                              }}
                              className="img-fluid cursor-pointer"
                              alt="shopPhoto"
                              src={shop?.shopPhotos[0]}
                              width="100%"
                            />
                            <small>Shop Photos</small>
                          </ImageWrapper>
                        ) : null}
                      </Col>
                    </Row>
                  ) : (
                    <h5 className="text-center">No Photos</h5>
                  )}
                </AccordionDetails>
              </Accordion>
            </Col>
            <Col xl={6}>
              <div className="mb-4">
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Deals</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {shop?.deals?.length > 0 ? (
                      shop?.deals?.map((deal, index) => (
                        <ul key={index} style={{ listStyleType: 'square' }}>
                          <li>
                            <div className="d-flex justify-content-between px-3">
                              <span
                                style={{
                                  fontSize: '15px',
                                  fontWeight: '500',
                                }}
                              >
                                {deal?.name}
                                {`-(${deal?.status})`}
                              </span>
                              <i
                                className="fa fa-trash cursor-pointer"
                                style={{ color: 'red' }}
                                onClick={() => deleteDeal(deal?._id)}
                              ></i>
                            </div>
                          </li>

                          <ul>
                            <li>
                              <span>{deal?.type}-</span>
                              <span className="ms-1">
                                {deal?.option}
                                {deal?.percentage && `(${deal?.percentage}%)`}
                              </span>
                            </li>
                          </ul>
                        </ul>
                      ))
                    ) : (
                      <h5 className="text-center"> No Deals </h5>
                    )}
                  </AccordionDetails>
                </Accordion>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {/* DEAL */}
      <Modal
        isOpen={modalCenter}
        toggle={() => {
          setModalCenter(!modalCenter);
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Add Deal</h5>
          <button
            type="button"
            onClick={() => {
              setModalCenter(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <DealForAdd type="shop" item={shop} shopType={shop?.shopType} />
        </div>
      </Modal>
      {/* Import Product */}
      <Modal
        isOpen={isImportProductOpen}
        toggle={() => {
          setIsImportProductOpen(!isImportProductOpen);
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Import Products File</h5>
          <button
            type="button"
            onClick={() => {
              setIsImportProductOpen(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="d-flex flex-column">
            <label>Upload excel sheet</label>
            <input
              type="file"
              onChange={(e) => setProductsFile(e.target.files[0])}
              title="select file"
              required
              accept=".xlsx,.xls"
            />
          </div>
          <Button onClick={submitProductFile} className="mt-3 px-4" color="success" disabled={isLoading}>
            {isLoading ? 'Importing...' : 'Import'}
          </Button>
        </div>
      </Modal>
      {/* Max discoutn */}
      <Modal
        isOpen={maxDiscountModal}
        toggle={() => {
          setMaxDiscountModal(false);
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Add Max Discount</h5>
          <button
            type="button"
            onClick={() => {
              setMaxDiscountModal(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <Stack spacing={6}>
            <FormControl fullWidth>
              <InputLabel>Max Discount</InputLabel>
              <Select
                fullWidth
                label="Max Discount"
                value={newMaxDiscount}
                onChange={(e) => {
                  setNewMaxDiscount(e.target.value);
                }}
              >
                {appSettingsOptions.maxDiscount.map((item) => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={() => {
                updateShopMaxDiscount();
              }}
            >
              Update
            </Button>
          </Stack>
        </div>
      </Modal>
      {/* marketing modal */}
      {/* <MSettingsModal open={Boolean(currentMarketing)}>
        <MarketingSettings
          shop={shop}
          creatorType="admin"
          marketingType={currentMarketing}
          closeModal={() => {
            setCurrentMarketing(null);
          }}
        />
      </MSettingsModal> */}
    </GlobalWrapper>
  );
}

const ImageWrapper = styled.div`
  text-align: center;
  border: 1px solid lightgray;
  border-radius: 5px;
  img {
    object-fit: contain;
    width: 100%;
    height: 90%;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 5px;

  @media (max-width: 790px) {
    flex-direction: column;
  }
`;

const TemplateButton = styled.a`
  color: #02a499;
  &:hover {
    color: white;
  }
`;

export default ShopDetails;
