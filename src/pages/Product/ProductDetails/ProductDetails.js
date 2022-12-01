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
import {
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import DealForAdd from "../../../components/DealForAdd";
import Info from "./../../../components/Info";
import { deleteDealOfProduct } from "../../../store/Product/productAction";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import noPhoto from "../../../assets/images/noPhoto.jpg";
import InfoTwo from "../../../components/InfoTwo";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import CategoryIcon from "@mui/icons-material/Category";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import SellIcon from "@mui/icons-material/Sell";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import BlockIcon from "@mui/icons-material/Block";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import Person3Icon from "@mui/icons-material/Person3";
import ShopIcon from "@mui/icons-material/Shop";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import DiscountIcon from "@mui/icons-material/Discount";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import AddCircleIcon from "@mui/icons-material/AddCircle";

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

            <Card className="">
              <CardBody>
                <div className="d-flex justify-content-between">
                  <CardTitle>Product Details</CardTitle>
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
                <Row className="py-4">
                  <Col xl={2} className="text-center text-capitalize">
                    <img
                      className="rounded-circle avatar-xl cursor-pointer"
                      alt="Product"
                      src={!product?.images[0] ? noPhoto : product?.images[0]}
                      onClick={() => {
                        setIsOpen(true);
                        setSelectedImg(product?.images[0]);
                      }}
                    />
                    <h5 className="text-center mt-3 text-success">
                      {product?.name}
                    </h5>
                  </Col>
                  <Col xl={3}>
                    <div className="ps-0 ps-xl-3">
                      <InfoTwo
                        Icon={Person3Icon}
                        value={`${product?.seller?.name} (Seller)`}
                        link={`/seller/details/${product?.seller?._id}`}
                      />
                      <InfoTwo
                        Icon={ShopIcon}
                        value={`${product?.shop?.shopName} (Shop)`}
                        link={`/shops/details/${product?.shop?._id}`}
                      />
                      <InfoTwo
                        Icon={PriceCheckIcon}
                        value={`${product?.price} NGN (Price)`}
                      />

                      <InfoTwo
                        Icon={AllInclusiveIcon}
                        value={`${product?.type} (Type)`}
                      />
                      {product?.type === "food" && (
                        <InfoTwo
                          Icon={FoodBankIcon}
                          value={`${product?.foodType} (Food Type)`}
                        />
                      )}
                    </div>
                  </Col>
                  <Col xl={3}>
                    <InfoTwo
                      Icon={ShoppingCartIcon}
                      value={`${product?.quantity ?? 1}(Quantity)`}
                    />
                    <InfoTwo
                      Icon={DiscountIcon}
                      value={`${product?.discountPrice} NGN (Discount)`}
                    />
                    <InfoTwo
                      Icon={AcUnitIcon}
                      value={`${product?.unit ?? "Unknown"} (Unit)`}
                    />

                    <InfoTwo
                      Icon={
                        product?.status === "active" ? CheckBoxIcon : BlockIcon
                      }
                      value={`${
                        product?.status === "active"
                          ? "available"
                          : "unavailable"
                      } (Status)`}
                    />
                  </Col>
                  <Col xl={3}>
                    <InfoTwo
                      Icon={CategoryIcon}
                      value={`${product?.category?.name} (Category)`}
                      link={`/category/details/${product?.category?._id}`}
                    />

                    <InfoTwo
                      Icon={CategoryIcon}
                      value={`${
                        product?.subCategory?.name ?? "Has't Any"
                      } (Sub-Category)`}
                      link={`/category/details/${product?.subCategory?._id}`}
                    />

                    <InfoTwo
                      Icon={DeliveryDiningIcon}
                      value={`${
                        product?.freeDelivery ? "Yes" : "No"
                      } (Free Delivery)`}
                    />

                    <InfoTwo
                      Icon={AddCircleIcon}
                      value={`${new Date(
                        product?.createdAt
                      ).toDateString()} (Added Date)`}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Row>
              <Col lg={6}>
                <div className="mb-4">
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Attributes</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        {product?.attributes?.length > 0 ? (
                          product?.attributes?.map((attribute, index) => (
                            <ul key={index} style={{ listStyleType: "square" }}>
                              <li>
                                <div className="d-flex justify-content-between">
                                  <span
                                    style={{
                                      fontSize: "15px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {attribute?.name}
                                    {attribute?.required ? "(Required)" : ""}
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
                          ))
                        ) : (
                          <h5 className="text-center">No Attributes!</h5>
                        )}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-4">
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Addons</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        {product?.addons?.length > 0 ? (
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
                          ))
                        ) : (
                          <h5 className="text-center">No Addons!</h5>
                        )}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-4">
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Deals</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        {product?.deals?.length > 0 ? (
                          product?.deals?.map((deal, index) => (
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
                                    onClick={() => deleteDeal(deal._id)}
                                  ></i>
                                </div>
                              </li>

                              <ul>
                                <li>
                                  <span>{deal?.type}-</span>
                                  <span className="ms-1">
                                    {deal?.option}
                                    {deal?.percentage &&
                                      `(${deal?.percentage}%)`}
                                  </span>
                                </li>
                              </ul>
                            </ul>
                          ))
                        ) : (
                          <h5 className="text-center">No Deals!</h5>
                        )}
                      </Typography>
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
