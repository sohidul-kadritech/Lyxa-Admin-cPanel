import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
import Select from "react-select";
import {
  productStatusOptions,
  productVisibility,
  shopTypeOptions,
  sortByOptions,
} from "../../../assets/staticData";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProduct,
  updateProductSearchKey,
  updateProductSortByKey,
  updateProductStatusKey,
  updateProductType,
  updateProductVisibilityByKey,
  deleteProduct,
} from "../../../store/Product/productAction";
import AppPagination from "../../../components/AppPagination";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { Tooltip } from "@mui/material";
import Lightbox from "react-image-lightbox";
import { useHistory } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import Search from './../../../components/Search';

const ProductList = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    searchKey,
    statusKey,
    typeKey,
    sortByKey,
    productVisibilityKey,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    loading,
    products,
  } = useSelector((state) => state.productReducer);

  const [isZoom, setIsZoom] = useState(false);
  const [proImg, setProImg] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState("");
  const [dynamic_description, setdynamic_description] = useState("");

  useEffect(() => {
    if (
      searchKey ||
      statusKey ||
      typeKey ||
      sortByKey ||
      productVisibilityKey
    ) {
      callProductList(true);
    }
  }, [searchKey, statusKey, typeKey, sortByKey, productVisibilityKey]);

  const callProductList = (refresh = false) => {
    dispatch(getAllProduct(refresh));
  };

  // DELETE PRODUCT

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"List"}
              title="Product"
              loading={loading}
              callList={callProductList}
              isAddNew={true}
              addNewRoute="products/add"
            />

            {isZoom ? (
              <Lightbox
                mainSrc={proImg}
                enableZoom={true}
                onCloseRequest={() => {
                  setIsZoom(!isZoom);
                }}
              />
            ) : null}

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

            <Card>
              <CardBody>
                <Row>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Sort By</label>
                      <Select
                        palceholder="Select Status"
                        options={sortByOptions}
                        classNamePrefix="select2-selection"
                        value={sortByKey}
                        onChange={(e) => dispatch(updateProductSortByKey(e))}
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Type</label>
                      <Select
                        palceholder="Select Status"
                        options={shopTypeOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={typeKey}
                        onChange={(e) => dispatch(updateProductType(e))}
                        defaultValue={""}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Status</label>
                      <Select
                        palceholder="Select Status"
                        options={productStatusOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={statusKey}
                        onChange={(e) => dispatch(updateProductStatusKey(e))}
                        defaultValue={""}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">
                        Product Visibility
                      </label>
                      <Select
                        palceholder="Select Status"
                        options={productVisibility}
                        classNamePrefix="select2-selection"
                        required
                        value={productVisibilityKey}
                        onChange={(e) =>
                          dispatch(updateProductVisibilityByKey(e))
                        }
                        defaultValue={""}
                      />
                    </div>
                  </Col>
                  <Col lg={8}>
                    {/* <div className="mb-4">
                      <label className="control-label">Search</label>

                      <SearchWrapper>
                        <div className="search__wrapper">
                          <i className="fa fa-search" />
                          <input
                            className="form-control"
                            type="search"
                            placeholder="Search Product..."
                            id="search"
                            onChange={searchKeyListener}
                          />
                        </div>
                      </SearchWrapper>
                    </div> */}

                    <Search dispatchFunc={updateProductSearchKey} />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Product List</CardTitle>
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
                            <Th style={{ height: "50px",maxWidth: '150px' }}>
               
                                <img
                                  onClick={() => {
                                    setIsZoom(true);
                                    setProImg(item?.images[0]);
                                  }}
                                  className="img-fluid cursor-pointer"
                                  alt=""
                                  src={item?.images[0]}
                                  style={{
                                    maxWidth: '150px',
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                        
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
                                    className="btn btn-success me-1 button"
                                    onClick={() =>
                                      history.push(
                                        `/products/edit/${item?._id}`
                                      )
                                    }
                                  >
                                    <i className="fa fa-edit" />
                                  </button>
                                </Tooltip>

                                <Tooltip title="Details">
                                  <button
                                    className="btn btn-success me-1 button"
                                    onClick={() =>
                                      history.push(
                                        `/products/details/${item?._id}`
                                      )
                                    }
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
                    lisener={(page) =>
                      dispatch(getAllProduct(true, null, page))
                    }
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

const SearchWrapper = styled.div`
  border: 1px solid lightgray;
  border-radius: 6px;
  width: 100%;
  padding: 2px 7px;

  .search__wrapper {
    /* padding: 7px 10px; */
    display: flex;
    align-items: center;
    i {
      font-size: 15px;
    }
    input {
      border: none;
      color: black !important;
    }

  }
`;

export default ProductList;
