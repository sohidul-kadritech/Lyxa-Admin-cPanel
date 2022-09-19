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
  Modal,
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
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import DropCharge from "../../../components/DropCharge";

const SellerDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { sellers, status } = useSelector((state) => state.sellerReducer);

  const { loading, shops, paging, hasNextPage, hasPreviousPage, currentPage } =
    useSelector((state) => state.shopReducer);
  const { account_type, adminType } = JSON.parse(localStorage.getItem("admin"));

  const [seller, setSeller] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPercentage, setIsOpenPercentage] = useState(false);

  useEffect(() => {
    if (id) {
      const findSeller = sellers.find((item) => item._id == id);
      if (findSeller) {
        console.log({ findSeller });
        setSeller(findSeller);
      } else {
        callApi(id);
      }
    }
  }, [id]);

  // CALL API

  const callApi = async (sellerId) => {
    try {
      const { data } = await requestApi().request(SINGLE_SELLER, {
        params: {
          id: sellerId,
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

  useEffect(() => {
    if (status) {
      setIsOpenPercentage(false);
      callApi(id);
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

            <Card className="card-height">
              <CardBody>
                <div className="d-flex justify-content-between">
                  <CardTitle>Seller Informations</CardTitle>
                  <div>
                    <Button
                      outline={true}
                      color="success"
                      className="me-3"
                      onClick={() => setIsOpenPercentage(!isOpenPercentage)}
                    >
                      Update Drop Charge
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
                    {seller?.dropPercentage && (
                      <Info
                        title="Drop Charge"
                        value={`${seller?.dropPercentage} ${seller?.dropPercentageType === "amount" ? "NGN" : "%"
                          }`}
                      />
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>



            <Card>
              <CardBody>
                <div className="d-flex justify-content-between">
                  <CardTitle className="h4"> Shop List</CardTitle>
                  {(account_type === 'admin' && adminType === 'admin') && <Button color="success" onClick={addNewProduct}>
                    Add Shop
                  </Button>}
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

            <Row >
              <Col lg={6}>

                <Card className="card-height">
                  <CardBody>
                    <div>
                      <CardTitle>Seller Photos</CardTitle>
                      <hr />
                    </div>
                    {seller?.certificate_of_incorporation || seller?.national_id ? (<Row>
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
                    </Row>) : <h5 className="text-center">No Photos</h5>}
                  </CardBody>
                </Card>

              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>

      {/* SELLER PERCENTAGE SETTINGS */}

      <Modal
        isOpen={isOpenPercentage}
        toggle={() => {
          setIsOpenPercentage(!isOpenPercentage);
        }}
        centered={true}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Update Drop Charge</h5>
          <button
            type="button"
            onClick={() => {
              setIsOpenPercentage(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className="modal-body">
          <DropCharge
            chargeType={seller?.dropPercentageType}
            chargeValue={seller?.dropPercentage}
            type="seller"
            seller={seller?._id}
          />
        </div>
      </Modal>
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

export default SellerDetails;
