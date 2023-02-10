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
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Lightbox from 'react-image-lightbox';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, Col, Container, Modal, Row } from 'reactstrap';
import noPhoto from '../../../assets/images/noPhoto.jpg';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import DealForAdd from '../../../components/DealForAdd';
import GlobalWrapper from '../../../components/GlobalWrapper';
import InfoTwo from '../../../components/InfoTwo';
import InfoTwoWrapper from '../../../components/InfoTwoWrapper';
import { SINGLE_PRODUCT } from '../../../network/Api';
import requestApi from '../../../network/httpRequest';
import { deleteDealOfProduct } from '../../../store/Product/productAction';

function ProductDetails() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const { products, status } = useSelector((state) => state.productReducer);

  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();

  const [product, setProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [modalCenter, setModalCenter] = useState(false);

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
                <div>
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
                  <Button className="ms-3" outline color="success" onClick={() => history.push(`/products/edit/${id}`)}>
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
                      Icon={product?.status === 'active' ? CheckBoxIcon : BlockIcon}
                      value={`${product?.status === 'active' ? 'available' : 'unavailable'}`}
                      name="Status"
                    />
                  </InfoTwoWrapper>
                </Col>
                <Col xl={3}>
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
                      product?.attributes?.map((attribute) => (
                        <ul key={Math.random()} style={{ listStyleType: 'square' }}>
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
                          {attribute.items.map((item) => (
                            <ul key={Math.random()}>
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
                      product?.addons?.map((item) => (
                        <ul key={Math.random()} style={{ listStyleType: 'square' }}>
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
                      product?.deals?.map((deal) => (
                        <ul key={Math.random()} style={{ listStyleType: 'square' }}>
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
    </GlobalWrapper>
  );
}

export default ProductDetails;
