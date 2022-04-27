import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Tooltip from "@mui/material/Tooltip";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteSeller,
  getAllSeller,
  setSellerStatusFalse,
} from "../../../store/Seller/sellerAction";
import AppPagination from "../../../components/AppPagination";
import Lightbox from "react-image-lightbox";
import { useHistory } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";

const SellerList = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isZoom, setIsZoom] = useState(false);
  const [sellerImg, setSellerImg] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState("");
  const [dynamic_description, setdynamic_description] = useState("");

  const {
    loading,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    sellers,
  } = useSelector((state) => state.sellerReducer);

  useEffect(() => {
    callSellerList();
    dispatch(setSellerStatusFalse());
  }, []);

  const callSellerList = (refresh = false) => {
    dispatch(getAllSeller(refresh));
  };

  // DELETE

  const handleDelete = (id) => {
    dispatch(deleteSeller(id));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"List"}
              title="Seller"
              loading={loading}
              callList={callSellerList}
              isAddNew={true}
              addNewRoute="seller/add"
            />

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

            {isZoom ? (
              <Lightbox
                mainSrc={sellerImg}
                enableZoom={true}
                onCloseRequest={() => {
                  setIsZoom(!isZoom);
                }}
              />
            ) : null}

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Seller List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Image</Th>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
                      <Th>Company Name</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {sellers.map((item, index) => {
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
                                  setIsZoom(true);
                                  setSellerImg(item.profile_photo);
                                }}
                                className="img-fluid cursor-pointer"
                                alt=""
                                src={item?.profile_photo}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                          </Th>

                          <Td>{item?.name}</Td>
                          <Td>{item?.email}</Td>
                          <Td>{item.phone_number}</Td>
                          <Td>{item.company_name}</Td>
                          <Td>{item.status}</Td>
                          <Td>
                            <div>
                              <Tooltip title="Edit">
                                <button
                                  className="btn btn-success me-0 me-lg-2 button"
                                  onClick={() =>
                                    history.push(`/seller/edit/${item._id}`)
                                  }
                                >
                                  <i className="fa fa-edit" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Details">
                                <button
                                  className="btn btn-info button me-0 me-lg-2"
                                  onClick={() =>history.push(`/seller/details/${item._id}`) }
                                >
                                  <i className="fa fa-eye" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <button
                                  className="btn btn-danger button"
                                  onClick={() => setconfirm_alert(true)}
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
                                  Are You Sure! You want to delete this Seller.
                                </SweetAlert>
                              ) : null}
                            </div>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                {/* {loading && (
                    <Spinner
                      style={{ position: "fixed", left: "50%", top: "50%" }}
                      animation="border"
                      variant="info"
                    />
                  )} */}
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
                    lisener={(page) => dispatch(getAllSeller(true, page))}
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

export default SellerList;
