import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { SINGLE_PRODUCT } from "../../../network/Api";
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
  Modal,
} from "reactstrap";
import styled from "styled-components";
import Lightbox from "react-image-lightbox";
import { Autocomplete, Box, Paper, TextField, Tooltip } from "@mui/material";
import { getAllDeal, getAllDealForAdd } from "../../../store/Deal/dealAction";
import { addProductDeal } from "../../../store/Product/productAction";
import { toast } from "react-toastify";
import DealForAdd from "../../../components/DealForAdd";

const ProductDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const { products, loading, status } = useSelector(
    (state) => state.productReducer
  );
  

  const [product, setProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [modalCenter, setModalCenter] = useState(false);
  
 

  useEffect(() => {
    if (id) {
      const findProduct = products.find((item) => item._id === id);
      if (findProduct) {
        console.log(findProduct);
        setProduct(findProduct);
      } else {
        callApi(id);
      }
    } else {
      history.push("/products/list", { replace: true });
    }
  }, [id]);

  //   CALL TO SERVER

  const callApi = async (pId) => {
    try {
      const { data } = await requestApi().request(SINGLE_PRODUCT, {
        params: {
          id: pId,
        },
      });

      if (data.status) {
        console.log(data.data.product);
        setProduct(data.data.product);
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (modalCenter) {
      
    }
  }, [modalCenter]);

  // ADD DEAL

  

  useEffect(() => {
    if (status) {
      setModalCenter(false);
      callApi(product?._id)
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
              title="Product"
              //   loading={loading}
              //   callList={callSellerList}
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
                <div className="d-flex justify-content-between">
                  <CardTitle>Product Informations</CardTitle>
                  <div>
                    <Button
                      outline={true}
                      color="success"
                      onClick={() => {
                        setModalCenter(!modalCenter);
                        document.body.classList.add("no_padding");
                      }}
                    >
                      Add Deal
                    </Button>
                    <Button
                      className="ms-3"
                      outline={true}
                      color="success"
                      onClick={() => history.push(`/products/edit/${id}`)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <hr />
                <div className="d-flex justify-content-center pb-3">
                  <img
                    className="rounded-circle avatar-xl cursor-pointer"
                    alt="Product"
                    src={product?.images[0]}
                    onClick={() => {
                      setIsOpen(true);
                      setSelectedImg(product?.images[0]);
                    }}
                  />
                </div>
                <Row>
                  <Col xl={4}>
                    <div className="ps-0 ps-xl-3">
                      <Details>
                        <h5>Name:</h5>
                        <Value>{product?.name}.</Value>
                      </Details>

                      <Details>
                        <h5>Slug:</h5>
                        <Value>{product?.slug}.</Value>
                      </Details>
                      <Details>
                        <h5>Visibility:</h5>
                        <Value>
                          {product?.productVisibility ? "Yes" : "No"}.
                        </Value>
                      </Details>

                      <Details>
                        <h5>Type:</h5>
                        <Value>{product?.type}.</Value>
                      </Details>
                      <Details>
                        <h5>Minimum Order:</h5>
                        <Value>{product?.orderQuantityMinimum}.</Value>
                      </Details>
                      <Details>
                        <h5>Featured:</h5>
                        <Value>{product?.isFeatured ? "Yes" : "No"}.</Value>
                      </Details>
                    </div>
                  </Col>
                  <Col xl={4}>
                    <Details>
                      <h5>Price:</h5>
                      <Value>{product?.price}.</Value>
                    </Details>
                    <Details>
                      <h5>Previous Price:</h5>
                      <Value>{product?.previousPrice}.</Value>
                    </Details>
                    <Details>
                      <h5>Delivery Time(Min):</h5>
                      <Value>{product?.minDeliveryTime}.Min</Value>
                    </Details>
                    <Details>
                      <h5>Delivery Time(Max):</h5>
                      <Value>{product?.maxDeliveryTime}Min.</Value>
                    </Details>
                    <Details>
                      <h5>Status:</h5>
                      <Value>{product?.status}.</Value>
                    </Details>
                    <Details>
                      <h5>Free Delivery:</h5>
                      <Value>{product?.freeDelivery ? "Yes" : "No"}.</Value>
                    </Details>
                  </Col>
                  <Col xl={4}>
                    <Details>
                      <h5>Category:</h5>
                      <div className="ms-2">
                        <img
                          src={product?.category?.image}
                          className="avatar-xs rounded-circle me-2 cursor-pointer"
                          alt="category"
                          onClick={() => {
                            setIsOpen(true);
                            setSelectedImg(product?.category?.image);
                          }}
                        />
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            color: "#343a40",
                          }}
                        >
                          {product?.category?.name}.
                        </span>
                      </div>
                    </Details>
                    <Details>
                      <h5>Subcategory:</h5>
                      <div className="ms-2">
                        <img
                          src={product?.subCategory?.image}
                          className="avatar-xs rounded-circle me-2 cursor-pointer"
                          alt="subCategory"
                          onClick={() => {
                            setIsOpen(true);
                            setSelectedImg(product?.subCategory?.image);
                          }}
                        />
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            color: "#343a40",
                          }}
                        >
                          {product?.subCategory?.name}.
                        </span>
                      </div>
                    </Details>
                    <Details>
                      <h5>Seller:</h5>
                      <div className="ms-2">
                        <img
                          src={product?.seller?.profile_photo}
                          className="avatar-xs rounded-circle me-2 cursor-pointer"
                          alt="product"
                          onClick={() => {
                            setIsOpen(true);
                            setSelectedImg(product?.seller?.profile_photo);
                          }}
                        />

                        <Link to={`/seller/details/${product?.seller?._id}`}>
                          <Tooltip title="Details">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#343a40",
                              }}
                            >
                              {product?.seller?.name}.
                            </span>
                          </Tooltip>
                        </Link>
                      </div>
                    </Details>
                    <Details className="mt-1">
                      <h5>Shop:</h5>
                      <div className="ms-2">
                        <img
                          src={product?.shop?.shopLogo}
                          className="avatar-xs rounded-circle me-2 cursor-pointer"
                          alt="Shop"
                          onClick={() => {
                            setIsOpen(true);
                            setSelectedImg(product?.shop?.shopLogo);
                          }}
                        />

                        <Link to={`/shops/details/${product?.shop?._id}`}>
                          <Tooltip title="Details">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#343a40",
                              }}
                            >
                              {product?.shop?.shopName}.
                            </span>
                          </Tooltip>
                        </Link>
                      </div>
                    </Details>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Row>
              {product?.attributes.length > 0 && (
                <Col lg={4}>
                  <div className="mb-4">
                    <Paper className="py-2">
                      <h5 className="text-center">Attributes List</h5>
                      <hr />
                      {product.attributes.length > 0 &&
                        product.attributes.map((attribute, index) => (
                          <ul key={index} style={{ listStyleType: "square" }}>
                            <li>
                              <div className="d-flex justify-content-between">
                                <span
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {attribute.name}
                                  {attribute.required ? "(Required)" : ""}
                                </span>
                              </div>
                            </li>
                            {attribute.items.map((item, index) => (
                              <ul key={index}>
                                <li>
                                  <span>{item.name}-</span>
                                  <span className="ms-1">
                                    {item.extraPrice}
                                  </span>
                                </li>
                              </ul>
                            ))}
                          </ul>
                        ))}
                    </Paper>
                  </div>
                </Col>
              )}
              {product?.addons?.length > 0 && (
                <Col lg={4}>
                  <div className="mb-4">
                    <Paper className="py-2">
                      <h5 className="text-center">Addons List</h5>
                      <hr />
                      {product?.addons?.length > 0 &&
                        product?.addons?.map((item, index) => (
                          <ul key={index} style={{ listStyleType: "square" }}>
                            <li>
                              <div className="d-flex justify-content-between">
                                <div>
                                  <img
                                    loading="lazy"
                                    width="60"
                                    src={item.images[0]}
                                    alt=""
                                  />
                                  <span
                                    style={{
                                      fontSize: "15px",
                                      fontWeight: "500",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {item.name}
                                  </span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        ))}
                    </Paper>
                  </div>
                </Col>
              )}
              {product?.deals.length > 0 && (
                <Col lg={4}>
                  <div className="mb-4">
                    <Paper className="py-2">
                      <h5 className="text-center">Deals List</h5>
                      <hr />
                      {product.deals.length > 0 &&
                        product.deals.map((deal, index) => (
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
            <DealForAdd type='product' item={product} shopType ={product?.shop?.shopType} />
          </div>
        </Modal>
      </GlobalWrapper>
    </React.Fragment>
  );
};

const Details = styled.div`
  display: flex;
  align-items: center;
`;

const Value = styled.h5`
  color: #343a40;
  /* font-style: italic; */
  font-weight: 600;
  margin-left: 4px;
  /* padding-left: 5px; */
`;

export default ProductDetails;
