import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { SINGLE_SHOP } from "../../../network/Api";
import requestApi from "../../../network/httpRequest";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import Lightbox from "react-image-lightbox";

const ShopDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const { shops } = useSelector((state) => state.shopReducer);

  const [shop, setShop] = useState(null);

  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);



  useEffect(() => {
    if (id) {
      const findShop = shops.find((item) => item._id == id);
      if (findShop) {
        console.log({ findShop });
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
      setShop(data.data.shop);
    }
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
              //   loading={loading}
              //   callList={callShopList}
              //   isAddNew={true}
              //   addNewRoute="shops/add"
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
                        <button
                          onClick={() => history.push(`/shops/edit/${id}`)}
                          className="btn btn-success"
                        >
                          Edit
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
                            <h5>Address:</h5>
                            <Value>{shop?.address.address}</Value>
                          </Details>
                          <Details>
                            <h5>Minimum Order:</h5>
                            <Value>{shop?.minOrderAmount}</Value>
                          </Details>
                          <Details>
                            <h5>Status:</h5>
                            <Value>{shop?.shopStatus}</Value>
                          </Details>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <Row>
                      <div className="d-flex justify-content-between align-items-center w-100 pb-1">
                        <h4>Seller</h4>
                        <button
                          //   onClick={() => history.push(`/shops/edit/${id}`)}
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
            </Row>

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
          </Container>
        </div>
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
