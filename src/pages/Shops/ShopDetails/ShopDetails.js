import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { API_URL, DOWNLOAD_PRODUCT_TEMPLATE, SINGLE_SHOP, UPLOAD_PRODUCT_FILE } from "../../../network/Api";
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

import { Switch, Tooltip } from "@mui/material";

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
import { callApi } from "../../../components/SingleApiCall";

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
  const [isImportProductOpen, setIsImportProductOpen] = useState(false);
  const [productsFile, setProductsFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { account_type, adminType } = JSON.parse(localStorage.getItem("admin"));

  useEffect(async () => {
    if (id) {
      const findShop = shops.find((item) => item._id == id);
      if (findShop) {
        const activeStatus = findShop?.liveStatus == "online" ? true : false;
        setLiveStatus(activeStatus);
        setShop(findShop);
      } else {
        // callApi(id);
        const data = await callApi(id, SINGLE_SHOP, 'shop')
        if (data) {
          const activeStatus = data?.liveStatus == "online" ? true : false;
          setLiveStatus(activeStatus);
          setShop(data);
        } else {
          history.push("/shops/list", { replace: true });
        }
      }
    }
  }, [id]);


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

  useEffect(async () => {
    if (status) {
      setModalCenter(false);
      const data = await callApi(shop?._id, SINGLE_SHOP, 'shop');

      if (data) {
        const activeStatus = data?.liveStatus == "online" ? true : false;
        setLiveStatus(activeStatus);
        setShop(data);
      }

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


  // DOWNLOAD PRODUCT TEMPLATE

  const downloadProductTemplate = async () => {
    try {
      const { data } = await requestApi().request(DOWNLOAD_PRODUCT_TEMPLATE, {
        params: {
          sellerId: shop?.seller?._id,
        },
      });

    } catch (e) {
      console.log(e.message);
    }
  }

  // IMPORT PRODUCT FILE 

  const submitProductFile = async () => {

    if (!productsFile) {
      return successMsg('Upload products file');
    } else {
      const fileExt = productsFile.name.split(".");
      const validExts = ['xlsx', 'xls'];
      const checkExt = validExts.includes(fileExt[1])
      if (!checkExt) {
        return successMsg('Upload valid products file');

      }

      let formData = new FormData();
      formData.append("shopId", shop?._id);
      formData.append("file", productsFile);

      try {
        setIsLoading(true);
        const { data } = await requestApi().request(UPLOAD_PRODUCT_FILE, {
          method: 'POST',
          data: formData
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


    }


  }

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Lyxa"
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
                  <div className="d-flex flex-wrap  align-items-center">

                    <Button
                      outline={true}
                      color="success"
                      onClick={downloadProductTemplate}
                      className="me-3"
                    >
                      <TemplateButton href={`${API_URL}${DOWNLOAD_PRODUCT_TEMPLATE}?sellerId=${shop?.seller?._id}`} target="_blank" >Download Product Template</TemplateButton>
                    </Button>

                    <Button
                      outline={true}
                      color="success"
                      onClick={() => setIsImportProductOpen(!isImportProductOpen)}
                      className="me-3"
                    >
                      Import Products
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
                    {account_type === 'admin' && <>

                      <Button
                        outline={true}
                        color="success"
                        onClick={setAsFeatured}
                        className="me-3"
                      >
                        {!shop?.isFeatured
                          ? "Set as featured"
                          : "Remove featured"}
                      </Button>
                      <Button
                        outline={true}
                        color="success"
                        onClick={updateActiveStatus}
                        className="me-3"
                      >
                        {shop?.shopStatus === "active" ? "Inactive" : "Activate"}
                      </Button>

                    </>}
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
                    <Info
                      title="Total Order"
                      value={shop?.totalOrder}
                    />
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

        {/* Import Product */}

        <Modal
          isOpen={isImportProductOpen}
          toggle={() => {
            setIsImportProductOpen(!isImportProductOpen);
          }}
          centered={true}
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
              <input type='file' onChange={(e) => setProductsFile(e.target.files[0])} title="select file" required={true} accept=".xlsx,.xls" />
            </div>
            <Button onClick={submitProductFile} className="mt-3 px-4" color="success" disabled={isLoading}>{isLoading ? "Importing..." : 'Import'}</Button>
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

  @media (max-width: 790px) {
    flex-direction: column;
  }
`;

const TemplateButton = styled.a`

color: #02a499;
&:hover{
  color: white;
}

`

const DealsWrapper = styled.div``;

export default ShopDetails;
