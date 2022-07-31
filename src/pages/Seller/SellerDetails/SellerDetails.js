import React, { useEffect, useState } from "react";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import styled from "styled-components";
import Lightbox from "react-image-lightbox";
import Tooltip from "@mui/material/Tooltip";
import AppPagination from "../../../components/AppPagination";
import { getAllShop } from "../../../store/Shop/shopAction";
import SweetAlert from "react-bootstrap-sweetalert";
import requestApi from "../../../network/httpRequest";
import { SINGLE_SELLER } from "../../../network/Api";
import Info from "./../../../components/Info";
import ShopTable from "../../../components/ShopTable";

const SellerDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.sellerReducer);
  const { loading, shops, paging, hasNextPage, hasPreviousPage, currentPage } =
    useSelector((state) => state.shopReducer);

  const [seller, setSeller] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const findSeller = sellers.find((item) => item._id == id);
      if (findSeller) {
        console.log(findSeller);
        setSeller(findSeller);
      } else {
        callApi();
      }
    }
  }, [id]);

  // CALL API

  const callApi = async () => {
    try {
      const { data } = await requestApi().request(SINGLE_SELLER, {
        params: {
          id,
        },
      });

      if (data.status) {
        const { seller } = data.data;
        setSeller(seller);
      } else {
        history.push("/seller/list", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   ADD PRODUCT

  const addNewProduct = () => {
    history.push({
      pathname: "/shops/add",
      search: `?sellerId=${id}`,
    });
  };

  const percentageSettings = () => {
    history.push({
      pathname: "/percentage-setting",
      search: `?sellerId=${id}`,
    });
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Details"}
              title="Seller"
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
                  <CardTitle>Seller Informations</CardTitle>
                  <div>
                    <Button
                      outline={true}
                      color="success"
                      className="me-3"
                      onClick={() => percentageSettings()}
                    >
                      Percentage setting
                    </Button>
                    <Button
                      color="primary"
                      outline={true}
                      onClick={() => history.push(`/seller/edit/${id}`)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <hr className="my-2" />
                <Row>
                  <Col lg={6}>
                    <Info title="Company" value={seller?.company_name} />
                    <Info title="Contact person" value={seller?.name} />
                    <Info title="Email" value={seller?.email} />
                    <Info title="Bank" value={seller?.bank_name} />
                    <Info title="Account Name" value={seller?.account_name} />
                  </Col>
                  <Col lg={6}>
                    <Info title="Account No" value={seller?.account_number} />
                    <Info title="Phone" value={seller?.phone_number} />
                    <Info title="Status" value={seller?.status} />
                    <Info title="Seller type" value={seller?.sellerType} />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Row>
              <Col lg={6}>
                {seller?.certificate_of_incorporation || seller?.national_id ? (
                  <Card>
                    <CardBody>
                      <div>
                        <CardTitle>Seller Photos</CardTitle>
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
                              onClick={() => {
                                setIsOpen(true);
                                setSelectedImg(seller?.profile_photo);
                              }}
                              className="img-fluid cursor-pointer"
                              alt="Veltrix"
                              src={seller?.profile_photo}
                              width="100%"
                            />
                            <small>Company image</small>
                          </ImageWrapper>
                        </Col>
                        <Col md={4}>
                          {seller?.certificate_of_incorporation ? (
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
                                  setSelectedImg(
                                    seller?.certificate_of_incorporation
                                  );
                                }}
                                className="img-fluid cursor-pointer"
                                alt="Veltrix"
                                src={seller?.certificate_of_incorporation}
                                width="100%"
                              />
                              <small>Certificate of incorporation</small>
                            </ImageWrapper>
                          ) : null}
                        </Col>
                        <Col md={4}>
                          {seller?.national_id ? (
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
                                  setSelectedImg(seller?.national_id);
                                }}
                                className="img-fluid cursor-pointer"
                                alt="Veltrix"
                                src={seller?.national_id}
                                width="100%"
                              />
                              <small>National Id</small>
                            </ImageWrapper>
                          ) : null}
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                ) : null}
              </Col>
              <Col lg={6}>
                {seller?.dropCharge && (
                  <Card>
                    <CardBody>
                      <CardTitle>Drop Charge</CardTitle>
                      <hr />
                      <div>
                        <h5>
                          Charge:{" "}
                          {`${seller?.dropCharge?.dropPercentage} ${
                            seller?.dropCharge?.dropPercentageType === "amount"
                              ? "NGN"
                              : "%"
                          }`}
                        </h5>

                        <div className="pt-2">
                          <h6>Delivery Charge</h6>
                          <hr />
                          {seller?.dropCharge?.deliveryRange?.length > 0 &&
                            seller?.dropCharge?.deliveryRange.map(
                              (item, index) => (
                                <ul
                                  key={index}
                                  style={{ listStyleType: "square" }}
                                >
                                  <li>
                                    <div className="d-flex justify-content-between flex-column">
                                      <span
                                        style={{
                                          fontSize: "15px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        Charge: {`${item?.charge} NGN`}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: "15px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        Delivery Person Cut:{" "}
                                        {`${item?.deliveryPersonCut} NGN`}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: "15px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        Range:{" "}
                                        {`${item?.from} km - ${item?.to} km`}
                                      </span>
                                    </div>
                                  </li>
                                </ul>
                              )
                            )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </Col>
            </Row>

            <Card>
              <CardBody>
                <div className="d-flex justify-content-between">
                  <CardTitle className="h4"> Shop List</CardTitle>
                  <Button color="success" onClick={addNewProduct}>
                    Add Shop
                  </Button>
                </div>
                <hr className="my-3" />

                <ShopTable shops={seller?.shops} />
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
                    lisener={(page) => dispatch(getAllShop(true, id, page))}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
      {/* SELLER PERCENTAGE SETTINGS */}

      {/* <Modal
          isOpen={track}
          toggle={() => {
            setTrack(!track);
          }}
          centered={true}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Tracking Delivery Boy</h5>
            <button
              type="button"
              onClick={() => {
                setTrack(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <TrackingDeliveryBoy />
          </div>
        </Modal> */}
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
  color: #0321f3;
  font-style: italic;
  font-weight: 600;
  margin-left: 4px;
  /* padding-left: 5px; */
`;

export default SellerDetails;
