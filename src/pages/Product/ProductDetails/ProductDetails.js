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
  Modal,
} from "reactstrap";
import styled from "styled-components";
import Lightbox from "react-image-lightbox";
import { Paper, Tooltip } from "@mui/material";
import DealForAdd from "../../../components/DealForAdd";
import Info from "./../../../components/Info";
import { deleteDealOfProduct } from "../../../store/Product/productAction";

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
        setProduct(data.data.product);
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (modalCenter) {
  //   }
  // }, [modalCenter]);

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

            <Card className="card-height">
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
                      <Info title="Name" value={product?.name} />
                      <Info title="Type" value={product?.type} />
                      {product?.type === "food" && (
                        <Info title="Food Type" value={product?.foodType} />
                      )}
                      <Info
                        title="Minimum Order"
                        value={product?.orderQuantityMinimum}
                      />
                    </div>
                  </Col>
                  <Col xl={4}>
                    {product?.unit && (
                      <Info title="Unit Type" value={product?.unit} />
                    )}
                    <Info title="Price" value={`${product?.price} NGN`} />
                    <Info title="Status" value={product?.status} />
                    <Info title="SEO Title" value={product?.seoTitle} />
                  </Col>
                  <Col xl={4}>
                    <Info
                      title="Category"
                      value={product?.category?.name}
                      link={`/category/details/${product?.category?._id}`}
                    />
                    {product?.subCategory && (
                      <Info
                        title="Subcategory"
                        value={product?.subCategory?.name}
                        link={`/category/details/${product?.subCategory?._id}`}
                      />
                    )}
                    <Info
                      title="Seller"
                      value={product?.seller?.name}
                      link={`/seller/details/${product?.seller?._id}`}
                    />
                    <Info
                      title="Shop"
                      value={product?.shop?.shopName}
                      link={`/shops/details/${product?.shop?._id}`}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Row>
              {product?.attributes.length > 0 && (
                <Col lg={6}>
                  <div className="mb-4">
                    <Paper className="py-2 card-height">
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
                    <Paper className="py-2 card-height">
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
                <Col lg={6}>
                  <div className="mb-4">
                    <Paper className="py-2 card-height">
                      <h5 className="text-center">Deals List</h5>
                      <hr />
                      {product.deals.length > 0 &&
                        product.deals.map((deal, index) => (
                          <ul key={index} style={{ listStyleType: "square" }}>
                            <li>
                              <div className="d-flex justify-content-between px-3">
                                <span
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {deal.name}
                                  {`-(${deal.status})`}
                                </span>
                                <i
                                  className="fa fa-trash cursor-pointer"
                                  style={{ color: "red" }}
                                  onClick={() => deleteDeal(deal._id)}
                                ></i>
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
            <DealForAdd
              type="product"
              item={product}
              shopType={product?.type}
            />
          </div>
        </Modal>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default ProductDetails;
