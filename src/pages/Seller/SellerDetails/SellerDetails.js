import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import React, { useEffect, useState } from 'react';
import Lightbox from 'react-image-lightbox';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, Col, Container, Modal, Row } from 'reactstrap';
import styled from 'styled-components';
import noPhoto from '../../../assets/images/noPhoto.jpg';
import AppPagination from '../../../components/AppPagination';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import DropCharge from '../../../components/DropCharge';
import GlobalWrapper from '../../../components/GlobalWrapper';
import InfoTwo from '../../../components/InfoTwo';
import ShopTable from '../../../components/ShopTable';
import { callApi } from '../../../components/SingleApiCall';
import { MAP_URL, SINGLE_SELLER } from '../../../network/Api';
import { getAllShop } from '../../../store/Shop/shopAction';

function SellerDetails() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { sellers, status } = useSelector((state) => state.sellerReducer);

  const { paging, hasNextPage, hasPreviousPage, currentPage } = useSelector((state) => state.shopReducer);
  const { account_type, adminType } = useSelector((store) => store.Login.admin);
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();

  const [seller, setSeller] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPercentage, setIsOpenPercentage] = useState(false);

  useEffect(async () => {
    if (id) {
      const findSeller = sellers.find((item) => item._id === id);
      if (findSeller) {
        setSeller(findSeller);
      } else {
        const data = await callApi(id, SINGLE_SELLER, 'seller');
        if (data) {
          setSeller(data);
        } else {
          history.push('/seller/list', { replace: true });
        }
      }
    }
  }, [id]);

  //   ADD PRODUCT
  const addNewProduct = () => {
    history.push({
      pathname: '/shops/add',
      search: `?sellerId=${id}`,
    });
  };

  useEffect(() => {
    if (status) {
      setIsOpenPercentage(false);
      callApi(id);
    }
  }, [status]);

  return (
    <>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid>
            <Breadcrumb maintitle="Lyxa" breadcrumbItem="Details" title="Seller" isRefresh={false} />

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

            <Card className="card-height">
              <CardBody>
                <div className="d-flex justify-content-between">
                  <CardTitle>Seller Informations</CardTitle>
                  <div>
                    <Button
                      outline
                      color="success"
                      className="me-3"
                      onClick={() => setIsOpenPercentage(!isOpenPercentage)}
                    >
                      Update Drop Charge
                    </Button>
                    <Button color="primary" outline onClick={() => history.push(`/seller/edit/${id}`)}>
                      Edit
                    </Button>
                  </div>
                </div>
                <hr className="my-2" />
                <Row className="px-3">
                  <Col lg={6}>
                    <InfoTwo name="Company" value={`${seller?.company_name}`} Icon={ApartmentOutlinedIcon} />
                    <InfoTwo name="Manager" value={`${seller?.name}`} Icon={PersonOutlineOutlinedIcon} />
                    <InfoTwo
                      value={`${seller?.addressSeller?.address}`}
                      Icon={RoomOutlinedIcon}
                      mapLink={`
                      ${MAP_URL}?z=10&t=m&q=loc:${seller?.addressSeller?.latitude}+${seller?.addressSeller?.longitude}`}
                      name="Location"
                    />
                    <InfoTwo name="Phone" value={seller?.phone_number} Icon={LocalPhoneOutlinedIcon} />
                    <InfoTwo
                      name="Email"
                      value={seller?.email}
                      Icon={AlternateEmailOutlinedIcon}
                      classes="text-lowercase"
                    />
                    <InfoTwo name="Status" value={`${seller?.status}`} Icon={AutorenewOutlinedIcon} />
                    <InfoTwo name="Type" value={`${seller?.sellerType}`} Icon={StoreOutlinedIcon} />
                    {seller?.dropPercentage && (
                      <InfoTwo
                        Icon={PaidOutlinedIcon}
                        name="Lyxa Charge"
                        value={`${seller?.dropPercentage}${seller?.dropPercentageType === 'amount' ? currency : '%'}`}
                      />
                    )}
                  </Col>
                  <Col lg={6}>
                    <Row>
                      <Col md={4}>
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
                              setSelectedImg(seller?.profile_photo);
                            }}
                            className="img-fluid cursor-pointer"
                            alt=""
                            src={!seller?.profile_photo ? noPhoto : seller?.profile_photo}
                            width="100%"
                            loading="lazy"
                          />
                          <small>Company image</small>
                        </ImageWrapper>
                      </Col>
                      <Col md={4}>
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
                              setSelectedImg(seller?.certificate_of_incorporation);
                            }}
                            className="img-fluid cursor-pointer"
                            alt=""
                            src={!seller?.certificate_of_incorporation ? noPhoto : seller?.certificate_of_incorporation}
                            width="100%"
                            loading="lazy"
                          />
                          <small>Certificate of incorporation</small>
                        </ImageWrapper>
                      </Col>
                      <Col md={4}>
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
                              setSelectedImg(seller?.national_id);
                            }}
                            className="img-fluid cursor-pointer"
                            alt=""
                            src={!seller?.national_id ? noPhoto : seller?.national_id}
                            loading="lazy"
                          />
                          <small>National Id</small>
                        </ImageWrapper>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="d-flex justify-content-between">
                  <CardTitle className="h4"> Shop List</CardTitle>
                  {account_type === 'admin' && adminType === 'admin' && (
                    <Button color="success" onClick={addNewProduct}>
                      Add Shop
                    </Button>
                  )}
                </div>
                <hr className="my-3" />

                <ShopTable shops={seller?.shops} />
              </CardBody>
            </Card>
            <Row>
              <Col xl={12}>
                <div className="d-flex justify-content-center">
                  <AppPagination
                    paging={paging}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    currentPage={currentPage}
                    lisener={(page) => dispatch(getAllShop(true, id, page))}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>

      {/* SELLER PERCENTAGE SETTINGS */}

      <Modal
        isOpen={isOpenPercentage}
        toggle={() => {
          setIsOpenPercentage(!isOpenPercentage);
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Update Drop Charge</h5>
          <button
            type="button"
            onClick={() => {
              setIsOpenPercentage(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className="modal-body">
          <DropCharge
            chargeType={seller?.dropPercentageType}
            chargeValue={seller?.dropPercentage}
            type="seller"
            seller={seller?._id}
          />
        </div>
      </Modal>
    </>
  );
}

const ImageWrapper = styled.div`
  text-align: center;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
    border: 1px solid lightgray;
    border-radius: 5px;
    padding: 0px 3px;
  }
`;

export default SellerDetails;
