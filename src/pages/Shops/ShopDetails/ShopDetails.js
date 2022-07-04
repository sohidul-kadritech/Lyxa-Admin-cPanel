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
  Label,
  Modal,
} from "reactstrap";

import { getAllProduct } from "../../../store/Product/productAction";
import AppPagination from "../../../components/AppPagination";

import { Paper, Switch } from "@mui/material";

import {
  setAsFeaturedShop,
  ShopLiveStatus,
} from "../../../store/Shop/shopAction";
import DealForAdd from "../../../components/DealForAdd";
import { getAllOrder } from "../../../store/order/orderAction";
import ProductTable from "../../../components/ProductTable";
import Lightbox from "react-image-lightbox";
import OrderTable from "../../../components/OrderTable";
import Info from "./../../../components/Info";

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
      const { shop } = data.data;
      if (shop) {
        const activeStatus = shop?.liveStatus == "online" ? true : false;
        setLiveStatus(activeStatus);
        setShop(shop);
      } else {
        history.push("/shops/list", { replace: true });
      }
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

  // SET AS FEATURED

  const setAsFeatured = () => {
    dispatch(
      setAsFeaturedShop({
        id: shop._id,
        isFeatured: shop?.isFeatured ? false : true,
      })
    );
  };

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
                      <HeaderWrapper>
                        <h4>Shop</h4>
                        <div className="d-flex  align-items-center">
                          <Button
                            outline={true}
                            color="success"
                            onClick={() => {
                              setAsFeatured();
                            }}
                            className="me-3"
                          >
                            {!shop?.isFeatured
                              ? "Set as featured"
                              : "Remove featured"}
                          </Button>
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
                          <div>
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
                      </HeaderWrapper>
                      <hr />
                    </Row>
                    <Row>
                      <div className="ps-4">
                        <Info title="Name" value={shop?.shopName} />
                        <Info
                          title="Start Time"
                          value={shop?.shopStartTimeText}
                        />
                        <Info title="End Time" value={shop?.shopEndTimeText} />
                        <Info title="Shop Type" value={shop?.shopType} />
                        <Info title="Delivery" value={shop?.delivery} />
                        <Info
                          title="Featured"
                          value={shop?.isFeatured ? "Yes" : "No"}
                        />
                        <Info
                          title="Minimum Order"
                          value={shop?.minOrderAmount}
                        />
                        <Info title="Status" value={shop?.shopStatus} />
                        <Info
                          title="Free Delivery"
                          value={shop?.freeDelivery ? "Yes" : "No"}
                        />

                        {shop?.foodType && (
                          <Info title="Type" value={shop?.foodType} />
                        )}

                        <Info title="Phone" value={shop?.phone_number} />
                        <Info title="Email" value={shop?.email} />
                        <Info title="Address" value={shop?.address.address} />
                        <Info
                          title="Delivery fee(per/km)"
                          value={shop?.deliveryFeePerKm}
                        />
                        <Info
                          title="Drop charge(per/km)"
                          value={shop?.dropChargePerKm}
                        />
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                {shop?.shopBanner || shop?.shopPhotos || shop?.shopLogo ? (
                  <Card>
                    <CardBody>
                      <div>
                        <CardTitle>Shop Photos</CardTitle>
                        <hr />
                      </div>
                      <Row>
                        <Col md={4}>
                          <ImageWrapper
                            style={{
                              width: "100%",
                              height: "200px",
                              padding: "10px 0px",
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
                            />
                            <small>Shop Logo</small>
                          </ImageWrapper>
                        </Col>
                        <Col md={4}>
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
                                alt="shop banner"
                                src={shop?.shopBanner}
                                width="100%"
                              />
                              <small>Shop Banner</small>
                            </ImageWrapper>
                          ) : null}
                        </Col>
                        <Col md={4}>
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
                                alt="shopPhoto"
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
                      <Col lg={8} className=" mt-5 mt-md-0">
                        <div className="ps-4">
                          <Info title="Name" value={shop?.seller?.name} />
                          <Info
                            title="Phone"
                            value={shop?.seller?.phone_number}
                          />
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
            <DealForAdd type="shop" item={shop} />
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

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export default ShopDetails;
