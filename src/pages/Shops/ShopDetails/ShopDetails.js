import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { SINGLE_SHOP } from "../../../network/Api";
import requestApi from "../../../network/httpRequest";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
  Form,
  Label,
  Modal,
} from "reactstrap";

import { getAllProduct } from "../../../store/Product/productAction";
import AppPagination from "../../../components/AppPagination";

import { Paper, Switch } from "@mui/material";

import { ShopLiveStatus } from "../../../store/Shop/shopAction";
import DealForAdd from "../../../components/DealForAdd";
import { getAllOrder } from "../../../store/order/orderAction";
import ProductTable from "../../../components/ProductTable";
import Lightbox from "react-image-lightbox";
import OrdersList from "../../Orders/OrdersList/OrdersList";
import OrderTable from "../../../components/OrderTable";

const ShopDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { shops, status } = useSelector((state) => state.shopReducer);
  const {
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    loading,
    products,
  } = useSelector((state) => state.productReducer);
  const {
    orders,
    loading: orderLoading,
    paging: orderPaging,
    hasNextPage: orderHasNextPage,
    hasPreviousPage: orderHasPreviousPage,
    currentPage: orderCurrentPage,
  } = useSelector((state) => state.orderReducer);

  const [shop, setShop] = useState(null);

  const [liveStatus, setLiveStatus] = useState(false);
  const [modalCenter, setModalCenter] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getAllProduct(true, id));
      dispatch(getAllOrder(true, 1, id));
      const findShop = shops.find((item) => item._id == id);
      if (findShop) {
        console.log({ findShop });
        const activeStatus = findShop?.liveStatus == "online" ? true : false;
        setLiveStatus(activeStatus);
        setShop(findShop);
      } else {
        callApi(id);
      }
    } else {
      history.push("/shop/list", { replace: true });
    }
  }, [id]);

  const callApi = async (shopId) => {
    const { data } = await requestApi().request(SINGLE_SHOP, {
      params: {
        id: shopId,
      },
    });
    // console.log(banner)
    if (data.status) {
      console.log(data.data.shop);
      const activeStatus =
        data?.data?.shop?.liveStatus == "online" ? true : false;
      setLiveStatus(activeStatus);
      setShop(data.data.shop);
    }
  };

  // const handleDelete = (id) => {
  //   dispatch(deleteProduct(id));
  // };

  // ADD PRODUCT

  const addProduct = () => {
    history.push({
      pathname: "/products/add",
      search: `?shopId=${id}`,
      // state: { detail: 'some_value' }
    });
  };

  // CHANGE LIVE STATUS

  const changeLiveStatus = (e) => {
    setLiveStatus(e.target.checked);
    const status = e.target.checked;
    dispatch(
      ShopLiveStatus({
        id: shop._id,
        liveStatus: status ? "online" : "offline",
      })
    );
  };

  useEffect(() => {
    if (status) {
      setModalCenter(false);
      callApi(shop?._id);
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
              title="Shop"
              loading={loading}
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

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <Row>
                      <div className="d-flex justify-content-between align-items-center w-100 pb-1">
                        <h4>Shop</h4>
                        <div className="d-flex align-items-center">
                          <Button
                            outline={true}
                            color="success"
                            onClick={() => {
                              setModalCenter(!modalCenter);
                              document.body.classList.add("no_padding");
                            }}
                            className="me-3"
                          >
                            Add Deal
                          </Button>
                          <Switch
                            checked={liveStatus}
                            onChange={changeLiveStatus}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                          <Label className="mt-2">
                            {liveStatus ? "Online" : "Offline"}
                          </Label>
                        </div>
                      </div>
                      <hr />
                    </Row>
                    <Row>
                      <Col
                        lg={4}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div>
                          <img
                            className="rounded-circle avatar-xl cursor-pointer"
                            alt="partner"
                            src={shop?.shopLogo}
                            onClick={() => {
                              setIsOpen(true);
                              setSelectedImg(shop?.shopLogo);
                            }}
                          />
                        </div>
                      </Col>
                      <Col
                        lg={8}
                        className="d-flex justify-content-between  align-items-center mt-5 mt-md-0"
                      >
                        <div className="ps-4">
                          <Details>
                            <h5>Name:</h5>
                            <Value>{shop?.shopName}</Value>
                          </Details>
                          <Details>
                            <h5>Start Time:</h5>
                            <Value>{shop?.shopStartTimeText}</Value>
                          </Details>
                          <Details>
                            <h5>End Time:</h5>
                            <Value>{shop?.shopEndTimeText}</Value>
                          </Details>
                          <Details>
                            <h5>Shop Type:</h5>
                            <Value>{shop?.shopType}</Value>
                          </Details>
                          <Details>
                            <h5>Delivery:</h5>
                            <Value>{shop?.delivery}</Value>
                          </Details>
                          <Details>
                            <h5>Minimum Order:</h5>
                            <Value>{shop?.minOrderAmount}</Value>
                          </Details>
                          <Details>
                            <h5>Status:</h5>
                            <Value>{shop?.shopStatus}</Value>
                          </Details>
                          <Details>
                            <h5>Free Delivery:</h5>
                            <Value>{shop?.freeDelivery ? "Yes" : "No"}</Value>
                          </Details>
                          {shop?.foodType && (
                            <Details>
                              <h5>Food Type:</h5>
                              <Value>{shop?.foodType}</Value>
                            </Details>
                          )}
                          <Details>
                            <h5>Address:</h5>
                            <Value>{shop?.address.address}</Value>
                          </Details>
                          <Details>
                            <h5>Phone:</h5>
                            <Value>{shop?.phone_number}</Value>
                          </Details>
                          <Details>
                            <h5>Email:</h5>
                            <Value>{shop?.phone_number}</Value>
                          </Details>
                          <Details>
                            <h5>Delivery Fee(per/km):</h5>
                            <Value>{shop?.deliveryFeePerKm}</Value>
                          </Details>
                          <Details>
                            <h5>Drop Charge(per/km):</h5>
                            <Value>{shop?.dropChargePerKm}</Value>
                          </Details>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                {shop?.shopBanner || shop?.shopPhotos ? (
                  <Card>
                    <CardBody>
                      <div>
                        <CardTitle>Shop Photos</CardTitle>
                        <hr />
                      </div>
                      <Row>
                        <Col md={6}>
                          {shop.shopBanner ? (
                            <ImageWrapper
                              style={{
                                width: "100%",
                                height: "200px",
                                padding: "10px 0px",
                              }}
                            >
                              <img
                                onClick={() => {
                                  setIsOpen(true);
                                  setSelectedImg(shop?.shopBanner);
                                }}
                                className="img-fluid cursor-pointer"
                                alt="Veltrix"
                                src={shop?.shopBanner}
                                width="100%"
                              />
                              <small>Shop Banner</small>
                            </ImageWrapper>
                          ) : null}
                        </Col>
                        <Col md={6}>
                          {shop.shopPhotos ? (
                            <ImageWrapper
                              style={{
                                width: "100%",
                                height: "200px",
                                padding: "10px 0px",
                              }}
                            >
                              <img
                                onClick={() => {
                                  setIsOpen(true);
                                  setSelectedImg(shop?.shopPhotos[0]);
                                }}
                                className="img-fluid cursor-pointer"
                                alt="Veltrix"
                                src={shop?.shopPhotos[0]}
                                width="100%"
                              />
                              <small>Shop Photos</small>
                            </ImageWrapper>
                          ) : null}
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                ) : null}
              </Col>
            </Row>

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <Row>
                      <div className="d-flex justify-content-between align-items-center w-100 pb-1">
                        <h4>Seller</h4>
                        <button
                          onClick={() =>
                            history.push(`/seller/details/${shop?.seller?._id}`)
                          }
                          className="btn btn-success"
                        >
                          Details
                        </button>
                      </div>
                      <hr />
                    </Row>
                    <Row>
                      <Col
                        lg={4}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div>
                          <img
                            className="rounded-circle avatar-xl cursor-pointer"
                            alt="partner"
                            src={shop?.seller?.profile_photo}
                            onClick={() => {
                              setIsOpen(true);
                              setSelectedImg(shop?.seller?.profile_photo);
                            }}
                          />
                        </div>
                      </Col>
                      <Col
                        lg={8}
                        className="d-flex justify-content-between  align-items-center mt-5 mt-md-0"
                      >
                        <div className="ps-4">
                          <Details>
                            <h5>Name:</h5>
                            <Value>{shop?.seller?.name}</Value>
                          </Details>
                          <Details>
                            <h5>Phone:</h5>
                            <Value>{shop?.seller?.phone_number}</Value>
                          </Details>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              {shop?.deals.length > 0 && (
                <Col lg={4}>
                  <div className="mb-4">
                    <Paper className="py-2">
                      <h5 className="text-center">Deals List</h5>
                      <hr />
                      {shop.deals.length > 0 &&
                        shop.deals.map((deal, index) => (
                          <ul key={index} style={{ listStyleType: "square" }}>
                            <li>
                              <div className="d-flex justify-content-between">
                                <span
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {deal.name}
                                  {`-(${deal.status})`}
                                </span>
                              </div>
                            </li>

                            <ul>
                              <li>
                                <span>{deal.type}-</span>
                                <span className="ms-1">
                                  {deal.option}
                                  {deal.percentage && `(${deal.percentage}%)`}
                                </span>
                              </li>
                            </ul>
                          </ul>
                        ))}
                    </Paper>
                  </div>
                </Col>
              )}
            </Row>

            {/* Product list */}
            <div>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center ">
                    <CardTitle className="h4"> Product List</CardTitle>

                    <Button
                      color="success"
                      onClick={addProduct}
                      className="ms-3"
                    >
                      Add Product
                    </Button>
                  </div>
                  <hr className="my-2" />

                  <ProductTable products={products} loading={loading} />
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
                      lisener={(page) =>
                        dispatch(getAllProduct(true, id, page))
                      }
                    />
                  </div>
                </Col>
              </Row>
            </div>

            {/* Order list */}
            <div>
              <OrderTable orders={orders} loading={orderLoading} />
              <Row>
                <Col xl={12}>
                  <div className="d-flex justify-content-center">
                    <AppPagination
                      paging={orderPaging}
                      hasNextPage={orderHasNextPage}
                      hasPreviousPage={orderHasPreviousPage}
                      currentPage={orderCurrentPage}
                      lisener={(page) => dispatch(getAllOrder(true, page, id))}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
        {/* DEAL */}

        <Modal
          isOpen={modalCenter}
          toggle={() => {
            setModalCenter(!modalCenter);
          }}
          centered={true}
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
      </GlobalWrapper>
    </React.Fragment>
  );
};

export const ImageWrapper = styled.div`
  text-align: center;
  img {
    object-fit: contain;
    width: 100%;
    height: 90%;
  }
`;

const Details = styled.div`
  display: flex;
  /* justify-content: space-between; */
`;

const Value = styled.h5`
  color: lightcoral;
  font-style: italic;
  font-weight: 500;
  margin-left: 4px;
  /* padding-left: 5px; */
`;

export default ShopDetails;
