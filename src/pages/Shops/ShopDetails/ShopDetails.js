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
} from "reactstrap";

import Lightbox from "react-image-lightbox";
import {
  deleteProduct,
  getAllProduct,
} from "../../../store/Product/productAction";
import AppPagination from "../../../components/AppPagination";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { FormControlLabel, Switch, Tooltip } from "@mui/material";
import SweetAlert from "react-bootstrap-sweetalert";
import { ShopLiveStatus } from "../../../store/Shop/shopAction";

const ShopDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { shops } = useSelector((state) => state.shopReducer);
  const {
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    loading,
    products,
  } = useSelector((state) => state.productReducer);

  const [shop, setShop] = useState(null);

  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState("");
  const [dynamic_description, setdynamic_description] = useState("");
  const [activeStatus, setActiveStatus] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getAllProduct(true, id));
      const findShop = shops.find((item) => item._id == id);
      if (findShop) {
        console.log({ findShop });
        const activeStatus = findShop.liveStatus == "live" ? true : false;
        setActiveStatus(activeStatus);
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
      const activeStatus = data.data.shop.liveStatus == "live" ? true : false;
      setActiveStatus(activeStatus);
      setShop(data.data.shop);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

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
    setActiveStatus(e.target.checked);
    const status = e.target.checked;
    dispatch(
      ShopLiveStatus({
        id: shop._id,
        liveStatus: status ? "online" : "offline",
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

            {success_dlg ? (
              <SweetAlert
                success
                title={dynamic_title}
                onConfirm={() => {
                  setsuccess_dlg(false);
                }}
              >
                {dynamic_description}
              </SweetAlert>
            ) : null}

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <Row>
                      <div className="d-flex justify-content-between align-items-center w-100 pb-1">
                        <h4>Shop</h4>
                        <div>
                          <Switch
                            checked={activeStatus}
                            onChange={changeLiveStatus}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                          <Label>{activeStatus ? "Online" : "Offline"}</Label>
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

            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center ">
                  <CardTitle className="h4"> Product List</CardTitle>
                  <Button color="success" onClick={addProduct}>
                    Add Product
                  </Button>
                </div>
                <hr className="my-2" />
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Image</Th>
                      <Th>Name</Th>
                      <Th>Shop Name</Th>
                      <Th>Price</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {products &&
                      products.length > 0 &&
                      products.map((item, index) => {
                        return (
                          <Tr
                            key={index}
                            className="align-middle"
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                            }}
                          >
                            <Th>
                              <div style={{ height: "50px" }}>
                                <img
                                  onClick={() => {
                                    // setIsZoom(true);
                                    // setProImg(item?.images[0]);
                                  }}
                                  className="img-fluid cursor-pointer"
                                  alt=""
                                  src={item?.images[0]}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                            </Th>

                            <Td>{item?.name}</Td>
                            <Td>{item?.shop?.shopName}</Td>
                            <Td>
                              <p>{item?.price}</p>
                              <p>{item?.shopEndTimeText}</p>
                            </Td>
                            <Td>{item?.status}</Td>
                            <Td>
                              <div>
                                <Tooltip title="Edit">
                                  <button
                                    className="btn btn-success me-3 button"
                                    onClick={() =>
                                      history.push(
                                        `/products/edit/${item?._id}`
                                      )
                                    }
                                  >
                                    <i className="fa fa-edit" />
                                  </button>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <button
                                    className="btn btn-danger button"
                                    onClick={() => {
                                      setconfirm_alert(true);
                                    }}
                                  >
                                    <i className="fa fa-trash" />
                                  </button>
                                </Tooltip>
                                {confirm_alert ? (
                                  <SweetAlert
                                    title="Are you sure?"
                                    warning
                                    showCancel
                                    confirmButtonText="Yes, delete it!"
                                    confirmBtnBsStyle="success"
                                    cancelBtnBsStyle="danger"
                                    onConfirm={() => {
                                      handleDelete(item?._id);
                                      setconfirm_alert(false);
                                      setsuccess_dlg(true);
                                      setdynamic_title("Deleted");
                                      setdynamic_description(
                                        "Your file has been deleted."
                                      );
                                    }}
                                    onCancel={() => setconfirm_alert(false)}
                                  >
                                    You want to delete this Product.
                                  </SweetAlert>
                                ) : null}
                              </div>
                            </Td>
                          </Tr>
                        );
                      })}
                  </Tbody>
                </Table>
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="info" />
                  </div>
                )}
                {!loading && products.length < 1 && (
                  <div className="text-center">
                    <h4>No Data</h4>
                  </div>
                )}
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
                    lisener={(page) => dispatch(getAllProduct(true, id, page))}
                  />
                </div>
              </Col>
            </Row>
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
