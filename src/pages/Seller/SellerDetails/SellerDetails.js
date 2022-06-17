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
  Carousel,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import styled from "styled-components";
import Lightbox from "react-image-lightbox";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Tooltip from "@mui/material/Tooltip";
import AppPagination from "../../../components/AppPagination";
import { deleteShop, getAllShop } from "../../../store/Shop/shopAction";
import SweetAlert from "react-bootstrap-sweetalert";
import requestApi from "../../../network/httpRequest";
import { SINGLE_SELLER } from "../../../network/Api";
import Info from './../../../components/Info';

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
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState("");
  const [dynamic_description, setdynamic_description] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getAllShop(true, id));
      const findSeller = sellers.find((item) => item._id == id);
      if (findSeller) {
        console.log(findSeller);
        setSeller(findSeller);
      } else {
        console.log("call api");
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

  // DELETE SHOP

  const handleDelete = (shopId) => {
    dispatch(deleteShop(shopId));
  };

  //   ADD PRODUCT

  const addNewProduct = () => {
    history.push({
      pathname: "/shops/add",
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
                    <div className="d-flex justify-content-between">
                      <CardTitle>Seller Informations</CardTitle>
                      <Button
                        color="primary"
                        onClick={() => history.push(`/seller/edit/${id}`)}
                      >
                        Edit
                      </Button>
                    </div>
                    <hr className="my-2" />
                    <Row>
                      <Col
                        lg={5}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div>
                          <img
                            className="rounded-circle avatar-xl cursor-pointer"
                            alt="seller"
                            src={seller?.profile_photo}
                            onClick={() => {
                              setIsOpen(true);
                              setSelectedImg(seller?.profile_photo);
                            }}
                          />
                        </div>
                      </Col>
                      <Col
                        lg={7}
                        className="d-flex justify-content-between  align-items-center mt-5 mt-md-0"
                      >
                        <div className="ps-4">
                          <Info title='Name' value = {seller?.name}  />
                          <Info title='Email' value = {seller?.email}  />
                          <Info title='Gender' value = {seller?.gender}  />
                          <Info title='Birth Date' value = {new Date(seller?.dob).toLocaleDateString()}  />
                          <Info title='Company' value = {seller?.company_name}  />
                          <Info title='Bank' value = {seller?.bank_name}  />
                          <Info title='Account Name' value = {seller?.account_name}  />
                          <Info title='Account No' value = {seller?.account_number}  />
                          <Info title='Phone' value = {seller?.phone_number}  />
                          <Info title='Status' value = {seller?.status}  />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col xl={6}>
                {seller?.certificate_of_incorporation || seller?.national_id ? (
                  <Card>
                    <CardBody>
                      <div>
                        <CardTitle>Seller Photos</CardTitle>
                        <hr />
                      </div>
                      <Row>
                        <Col md={6}>
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
                        <Col md={6}>
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
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Logo</Th>
                      <Th>Name</Th>
                      <Th>Type</Th>
                      <Th>Open/Close</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {shops.map((item, index) => {
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
                                  setIsOpen(true);
                                  setSelectedImg(item?.shopLogo);
                                }}
                                className="img-fluid cursor-pointer"
                                alt=""
                                src={item.shopLogo}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                          </Th>

                          <Td>{item.shopName}</Td>
                          <Td>{item.shopType}</Td>
                          <Td>
                            <p>{item.shopStartTimeText}</p>
                            <p>{item.shopEndTimeText}</p>
                          </Td>
                          <Td>{item.shopStatus}</Td>
                          <Td>
                            <div>
                              <Tooltip title="Edit">
                                <button
                                  className="btn btn-success me-2 button"
                                  onClick={() =>
                                    history.push(`/shops/edit/${item._id}`)
                                  }
                                >
                                  <i className="fa fa-edit" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Details">
                                <button
                                  className="btn btn-info button me-2"
                                  onClick={() => {
                                    history.push(`/shops/details/${item._id}`);
                                  }}
                                >
                                  <i className="fa fa-eye" />
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
                                    handleDelete(item._id);
                                    setconfirm_alert(false);
                                    setsuccess_dlg(true);
                                    setdynamic_title("Deleted");
                                    setdynamic_description(
                                      "Your file has been deleted."
                                    );
                                  }}
                                  onCancel={() => setconfirm_alert(false)}
                                >
                                  You want to delete this Shop.
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
                {!loading && shops.length < 1 && (
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
                    lisener={(page) => dispatch(getAllShop(true, id, page))}
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
  color: #0321f3;
  font-style: italic;
  font-weight: 600;
  margin-left: 4px;
  /* padding-left: 5px; */
`;

export default SellerDetails;
