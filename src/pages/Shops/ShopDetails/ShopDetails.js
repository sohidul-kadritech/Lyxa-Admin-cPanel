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

import { Paper, Switch } from "@mui/material";

import {
  deleteDealOfShop,
  setAsFeaturedShop,
  ShopLiveStatus,
  updateShopStatus,
} from "../../../store/Shop/shopAction";
import DealForAdd from "../../../components/DealForAdd";

import Lightbox from "react-image-lightbox";
import Info from "./../../../components/Info";
import { successMsg } from "../../../helpers/successMsg";
import Flags from "../../../components/Flags";

const ShopDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { shops, status } = useSelector((state) => state.shopReducer);

  const [shop, setShop] = useState(null);

  const [liveStatus, setLiveStatus] = useState(false);
  const [modalCenter, setModalCenter] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const findShop = shops.find((item) => item._id == id);
      if (findShop) {
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

  // CHANGE LIVE STATUS

  const changeLiveStatus = (e) => {
    setLiveStatus(e.target.checked);
    const status = e.target.checked;
    dispatch(
      ShopLiveStatus({
        id: shop._id,
        liveStatus: status ? "online" : "busy",
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

  const updateActiveStatus = () => {
    if (shop?.seller?.status === "inactive") {
      return successMsg(
        "Seller is inactive. Please contact with your seller.",
        "error"
      );
    } else {
      dispatch(
        updateShopStatus({
          id: shop?._id,
          status: shop?.shopStatus === "active" ? "inactive" : "active",
        })
      );
    }
  };

  const updatePriceRange = (value) => {
    return value === 1
      ? "$"
      : value === 2
        ? "$$"
        : value === "3"
          ? "$$$"
          : "$$$$";
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
            <Card>
              <CardBody>
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
                    <Button
                      outline={true}
                      color="success"
                      onClick={() => updateActiveStatus()}
                      className="me-3"
                    >
                      {shop?.shopStatus === "active" ? "Inactive" : "Activate"}
                    </Button>
                    <div>
                      <Switch
                        checked={liveStatus}
                        onChange={changeLiveStatus}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      <Label className="mt-2">
                        {liveStatus ? "Online" : "Busy"}
                      </Label>
                    </div>
                  </div>
                </HeaderWrapper>
                <hr />
                <Row className='card-height'>
                  <Col xl={6}>
                    <Info
                      title="Seller"
                      value={shop?.seller?.name}
                      link={`/seller/details/${shop?.seller?._id}`}
                    />
                    <Info title="Name" value={shop?.shopName} />
                    <Info title="Start Time" value={shop?.shopStartTimeText} />
                    <Info title="End Time" value={shop?.shopEndTimeText} />
                    <Info title="Shop Type" value={shop?.shopType} />
                    <Info
                      title="Featured"
                      value={shop?.isFeatured ? "Yes" : "No"}
                    />
                    <Info
                      title="Minimum Order"
                      value={`${shop?.minOrderAmount} NGN`}
                    />
                    <Info title="Status" value={shop?.shopStatus} />
                    <Info
                      title="Rating"
                      value={
                        shop?.rating === 4
                          ? "Excellent"
                          : shop?.rating === 3
                            ? "Very good"
                            : shop?.rating === 2
                              ? "Good"
                              : shop?.rating === 1
                                ? "Bad"
                                : ""
                      }
                    />
                  </Col>

                  <Col xl={6}>
                    <Info title="Phone" value={shop?.phone_number} />
                    <Info title="Email" value={shop?.email} />
                    <Info title="Address" value={shop?.address.address} />
                    {shop?.haveOwnDeliveryBoy && (
                      <Info
                        title="Delivery fee"
                        value={`${shop?.deliveryFee ?? 0} NGN`}
                      />
                    )}
                    {/* <Info
                      title="Drop charge"
                      value={`${shop?.dropChargePerKm} NGN`}
                    /> */}
                    <Info
                      title="Free Delivery"
                      value={shop?.freeDelivery ? "Yes" : "No"}
                    />

                    <Info
                      title="Price Range"
                      value={updatePriceRange(shop?.expensive)}
                    />

                    {shop?.foodType && (
                      <Info title="Type" value={shop?.foodType} />
                    )}
                    {shop?.tags?.length > 0 && (
                      <Info
                        title="Tags"
                        value={shop?.tags?.map((item) => item).join(", ")}
                      />
                    )}
                    {shop?.cuisineType?.length > 0 && (
                      <Info
                        title="Cusines"
                        value={shop?.cuisineType
                          ?.map((item) => item.name)
                          .join(", ")}
                      />
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Row>
              <Col xl={6}>

                <Flags reviews={shop?.reviews} isReview={true} />

              </Col>
              <Col xl={6}>
                <Flags flags={shop?.flags} />
              </Col>
            </Row>

            <Row >
              <Col xl={6} >

                <Card className="card-height">
                  <CardBody>
                    <div>
                      <CardTitle>Shop Photos</CardTitle>
                      <hr />
                    </div>
                    {shop?.shopBanner || shop?.shopPhotos || shop?.shopLogo ? (<Row>
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
                    </Row>) : <h5 className="text-center">No Photos</h5>}
                  </CardBody>
                </Card>

              </Col>


              <Col xl={6}>
                <div className="mb-4">
                  <Card className="py-2 card-height">
                    <CardBody>
                      <h5 className="text-center">Deals List</h5>
                      <hr />
                      {shop?.deals?.length > 0 ?
                        shop?.deals?.map((deal, index) => (
                          <ul key={index} style={{ listStyleType: "square" }}>
                            <li>
                              <div className="d-flex justify-content-between px-3">
                                <span
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {deal?.name}
                                  {`-(${deal?.status})`}
                                </span>
                                <i
                                  className="fa fa-trash cursor-pointer"
                                  style={{ color: "red" }}
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
                        )) : <h5 className="text-center"> No Deals </h5>}
                    </CardBody>
                  </Card>
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

const ImageWrapper = styled.div`
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
  padding-bottom: 5px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const DealsWrapper = styled.div``;

export default ShopDetails;
