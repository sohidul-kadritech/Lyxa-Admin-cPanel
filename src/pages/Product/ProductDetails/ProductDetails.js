import AcUnitIcon from '@mui/icons-material/AcUnit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import BlockIcon from '@mui/icons-material/Block';
import CategoryIcon from '@mui/icons-material/Category';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DiscountIcon from '@mui/icons-material/Discount';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import Person3Icon from '@mui/icons-material/Person3';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ShopIcon from '@mui/icons-material/Shop';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Lightbox from 'react-image-lightbox';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, Col, Container, Modal, Row } from 'reactstrap';
import noPhoto from '../../../assets/images/noPhoto.jpg';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import DealForAdd from '../../../components/DealForAdd';
import GlobalWrapper from '../../../components/GlobalWrapper';
import InfoTwo from '../../../components/InfoTwo';
import InfoTwoWrapper from '../../../components/InfoTwoWrapper';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import { SINGLE_PRODUCT } from '../../../network/Api';
import AXIOS from '../../../network/axios';
import requestApi from '../../../network/httpRequest';
import { deleteDealOfProduct } from '../../../store/Product/productAction';

function ProductDetails() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const { products, status } = useSelector((state) => state.productReducer);

  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();

  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const [product, setProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [modalCenter, setModalCenter] = useState(false);

  console.log(product);

  // reward
  const rewardSettingsQuery = useQuery(['reward-settings'], () => AXIOS.get(Api.GET_ADMIN_REWARD_SETTINGS));

  const [rewardModal, setRewardModal] = useState(false);
  const [rewardBundleModal, setRewardBundleModal] = useState(false);
  const [rewardBundle, setRewardBundle] = useState('');
  const [rewardCategory, setRewardCategory] = useState('');

  const updateRewardSettings = useMutation((data) => AXIOS.post(Api.UPDATE_PRODUCT_REWARD_SETTINGS, data), {
    onSuccess: (data) => {
      if (data?.status) {
        setRewardModal(false);
        setRewardBundleModal(false);
        setProduct(data?.data?.product);
        successMsg(data?.message, 'success');
      } else {
        successMsg(data?.message);
      }
    },
    onError: (error) => {
      console.log('api error: ', error);
    },
  });

  // const updateRewardBundle = useMutation((data) => AXIOS.post(Api.UPDATE_PRODUCT_REWARD_BUNDLE, data), {
  //   onSuccess: (data) => {
  //     if (data?.status) {
  //       setRewardBundleModal(false);
  //       setProduct(data?.data?.product);
  //       successMsg(data?.message, 'success');
  //     } else {
  //       successMsg(data?.message);
  //     }
  //   },
  //   onError: (error) => {
  //     console.log('api error: ', error);
  //   },
  // });

  // console.log(rewardSettingsQuery.data);

  //   CALL TO SERVER
  const callApi = async (pId) => {
    try {
      const { data } = await requestApi().request(SINGLE_PRODUCT, {
        params: {
          id: pId,
        },
      });

      if (data.status) {
        setProduct(data.data.product);
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      const findProduct = products.find((item) => item._id === id);
      if (findProduct) {
        setProduct(findProduct);
      } else {
        callApi(id);
      }
    } else {
      history.push('/products/list', { replace: true });
    }
  }, [id]);

  // ADD DEAL

  useEffect(() => {
    if (status) {
      setModalCenter(false);
      callApi(product?._id);
    }
  }, [status]);

  // DEAL DELETE

  const deleteDeal = (dealId) => {
    dispatch(
      deleteDealOfProduct({
        productId: id,
        dealId,
      })
    );
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem="Details"
            title="Product"
            //   loading={loading}
            //   callList={callSellerList}
            isRefresh={false}
          />

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

          <Card className="">
            <CardBody>
              <div className="d-flex justify-content-between">
                <CardTitle>Product Details</CardTitle>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <Button
                    outline
                    color="success"
                    onClick={() => {
                      setRewardModal(true);
                      setRewardCategory(product?.rewardCategory || '');
                      document.body.classList.add('no_padding');
                    }}
                  >
                    Add Reward Category
                  </Button>
                  <Button
                    outline
                    color="success"
                    onClick={() => {
                      setRewardBundleModal(true);
                      const rewardBundle = !product?.rewardBundle
                        ? ''
                        : product?.rewardBundle !== '0'
                        ? product?.rewardBundle
                        : '';
                      setRewardBundle(rewardBundle);
                      document.body.classList.add('no_padding');
                    }}
                  >
                    Add Reward Bundle
                  </Button>
                  <Button
                    outline
                    color="success"
                    onClick={() => {
                      setModalCenter(!modalCenter);
                      document.body.classList.add('no_padding');
                    }}
                  >
                    Add Deal
                  </Button>
                  <Button outline color="success" onClick={() => history.push(`/products/edit/${id}`)}>
                    Edit
                  </Button>
                </div>
              </div>
              <hr />
              <Row className="py-4">
                <Col xl={2} className="text-center text-capitalize">
                  <img
                    className="cursor-pointer imgSetting"
                    alt="Product"
                    src={!product?.images[0] ? noPhoto : product?.images[0]}
                    onClick={() => {
                      setIsOpen(true);
                      setSelectedImg(product?.images[0]);
                    }}
                  />
                  <h5 className="text-center mt-3" style={{ color: '#6b6b6b !important' }}>
                    {product?.name}
                  </h5>
                </Col>
                <Col xl={3}>
                  <div className="ps-0 ps-xl-3">
                    <InfoTwoWrapper>
                      <InfoTwo
                        name="Seller"
                        Icon={Person3Icon}
                        value={`${product?.seller?.name}`}
                        link={`/seller/details/${product?.seller?._id}`}
                      />
                      <InfoTwo
                        Icon={ShopIcon}
                        name="Shop"
                        value={`${product?.shop?.shopName}`}
                        link={`/shops/details/${product?.shop?._id}`}
                      />
                      <InfoTwo name="Price" Icon={PriceCheckIcon} value={`${product?.price} ${currency}`} />

                      <InfoTwo name="Type" Icon={AllInclusiveIcon} value={`${product?.type}`} />
                      {product?.type === 'food' && (
                        <InfoTwo name="Food Type" Icon={FoodBankIcon} value={`${product?.foodType}`} />
                      )}
                    </InfoTwoWrapper>
                  </div>
                </Col>
                <Col xl={3}>
                  <InfoTwoWrapper>
                    <InfoTwo name="Quantity" Icon={ShoppingCartIcon} value={`${product?.quantity ?? 1}`} />
                    <InfoTwo name="Discount" Icon={DiscountIcon} value={`${product?.discountPrice} ${currency}`} />
                    <InfoTwo name="Unit" Icon={AcUnitIcon} value={`${product?.unit ?? 'Unknown'}`} />
                    <InfoTwo
                      name="Reward Category"
                      Icon={DiscountIcon}
                      value={`${product?.rewardCategory || 'None'}`}
                    />
                    <InfoTwo name="Reward Bundle" Icon={CategoryIcon} value={`${product?.rewardBundle || '0'}`} />
                  </InfoTwoWrapper>
                </Col>
                <Col xl={3}>
                  <InfoTwo
                    Icon={product?.status === 'active' ? CheckBoxIcon : BlockIcon}
                    value={`${product?.status === 'active' ? 'available' : 'unavailable'}`}
                    name="Status"
                  />
                  <InfoTwoWrapper>
                    <InfoTwo
                      Icon={CategoryIcon}
                      value={`${product?.category?.name}`}
                      link={`/category/details/${product?.category?._id}`}
                      name="Category"
                    />

                    <InfoTwo
                      Icon={CategoryIcon}
                      value={`${product?.subCategory?.name ?? "Has't Any"}`}
                      link={`/category/details/${product?.subCategory?._id}`}
                      name="Sub-Category"
                    />

                    <InfoTwo
                      Icon={DeliveryDiningIcon}
                      value={`${product?.freeDelivery ? 'Yes' : 'No'}`}
                      name="Free Delivery"
                    />

                    <InfoTwo
                      Icon={AddCircleIcon}
                      value={`${new Date(product?.createdAt).toDateString()}`}
                      name="Added Date"
                    />
                  </InfoTwoWrapper>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Row>
            <Col lg={6}>
              <div className="mb-4">
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Attributes</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {product?.attributes?.length > 0 ? (
                      product?.attributes?.map((attribute, index) => (
                        <ul key={index} style={{ listStyleType: 'square' }}>
                          <li>
                            <div className="d-flex justify-content-between">
                              <span
                                style={{
                                  fontSize: '15px',
                                  fontWeight: '500',
                                }}
                              >
                                {attribute?.name}
                                {attribute?.required ? '(Required)' : ''}
                              </span>
                            </div>
                          </li>
                          {attribute.items.map((item, index) => (
                            <ul key={index}>
                              <li>
                                <span>{item.name}-</span>
                                <span className="ms-1">{item.extraPrice}</span>
                              </li>
                            </ul>
                          ))}
                        </ul>
                      ))
                    ) : (
                      <h5 className="text-center">No Attributes!</h5>
                    )}
                  </AccordionDetails>
                </Accordion>
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-4">
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Addons</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {product?.addons?.length > 0 ? (
                      product?.addons?.map((item, index) => (
                        <ul key={index} style={{ listStyleType: 'square' }}>
                          <li>
                            <div className="d-flex justify-content-between">
                              <div>
                                <img loading="lazy" width="60" src={item.images[0]} alt="" />
                                <span
                                  style={{
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    marginLeft: '10px',
                                  }}
                                >
                                  {item.name}
                                </span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      ))
                    ) : (
                      <h5 className="text-center">No Addons!</h5>
                    )}
                  </AccordionDetails>
                </Accordion>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-4">
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Deals</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {product?.deals?.length > 0 ? (
                      product?.deals?.map((deal, index) => (
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
                                onClick={() => deleteDeal(deal._id)}
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
                      <h5 className="text-center">No Deals!</h5>
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
          <DealForAdd type="product" item={product} shopType={product?.type} />
        </div>
      </Modal>
      {/* Reward Category */}
      <Modal
        isOpen={rewardModal}
        toggle={() => {
          setRewardModal(false);
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Add Reward Category</h5>
          <button
            type="button"
            onClick={() => {
              setRewardModal(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <FormControl fullWidth>
            <InputLabel>Categories</InputLabel>
            <Select
              label="Categories"
              value={rewardCategory}
              onChange={(e) => {
                setRewardCategory(e.target.value);
              }}
            >
              {rewardSettingsQuery?.data?.data?.rewardSetting?.rewardCategory?.map((item) => (
                <MenuItem key={item?._id} value={item.name}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <Button
              outline
              color="success"
              className="mt-3"
              disabled={updateRewardSettings.loading}
              onClick={() => {
                if (rewardCategory === '') {
                  return;
                }
                updateRewardSettings.mutate({
                  productId: product?._id,
                  rewardCategory,
                });
              }}
            >
              Add Category
            </Button>
          </div>
        </div>
      </Modal>
      {/* Reward Bundle */}
      <Modal
        isOpen={rewardBundleModal}
        toggle={() => {
          setRewardBundleModal(false);
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Add Reward Bundle</h5>
          <button
            type="button"
            onClick={() => {
              setRewardBundleModal(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <FormControl fullWidth>
            <InputLabel>Bundles</InputLabel>
            <Select
              label="Categories"
              value={rewardBundle}
              onChange={(e) => {
                setRewardBundle(e.target.value);
              }}
            >
              {/*  */}
              {rewardSettingsQuery?.data?.data?.rewardSetting?.rewardBundle?.map((item) => (
                <MenuItem key={`${item}`} value={`${item}`}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <Button
              outline
              color="success"
              className="mt-3"
              disabled={updateRewardSettings.loading}
              onClick={() => {
                if (rewardBundle === '') {
                  return;
                }
                updateRewardSettings.mutate({
                  productId: product?._id,
                  rewardBundle,
                });
              }}
            >
              Add Bundle
            </Button>
          </div>
        </div>
      </Modal>
    </GlobalWrapper>
  );
}

export default ProductDetails;
