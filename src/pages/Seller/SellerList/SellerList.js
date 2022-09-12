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
  getAllSeller,
  setSellerStatusFalse,
  updateSellerSearchKey,
  updateSellerSortByKey,
  updateSellerStatusKey,
  updateSellerSubTypeKey,
  updateSellerType,
} from "../../../store/Seller/sellerAction";
import AppPagination from "../../../components/AppPagination";
import Lightbox from "react-image-lightbox";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import {
  sellerSubTypeOptions,
  shopTypeOptions,
  sortByOptions,
  statusOptions,
} from "../../../assets/staticData";
import Select from "react-select";
import Search from "../../../components/Search";

const SellerList = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isZoom, setIsZoom] = useState(false);
  const [sellerImg, setSellerImg] = useState("");

  const {
    loading,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    sellers,
    sortByKey,
    searchKey,
    statusKey,
    typeKey,
    subTypeKey,
  } = useSelector((state) => state.sellerReducer);
  const { account_type, adminType } = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    dispatch(setSellerStatusFalse());
  }, []);

  useEffect(() => {
    if (sortByKey || searchKey || statusKey || typeKey) {
      callSellerList(true);
    } else {
      callSellerList();
    }
  }, [sortByKey, searchKey, statusKey, typeKey]);

  const callSellerList = (refresh = false) => {
    dispatch(getAllSeller(refresh));
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
              isAddNew={adminType === 'admin' && account_type === 'admin' }
              addNewRoute="seller/add"
            />

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
                <Row>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Sort By</label>
                      <Select
                        palceholder="Select Status"
                        options={sortByOptions}
                        classNamePrefix="select2-selection"
                        value={sortByKey}
                        onChange={(e) => dispatch(updateSellerSortByKey(e))}
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
                        onChange={(e) => dispatch(updateSellerType(e))}
                        defaultValue={""}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Status</label>
                      <Select
                        palceholder="Select Status"
                        options={statusOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={statusKey}
                        onChange={(e) => dispatch(updateSellerStatusKey(e))}
                        defaultValue={""}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                  <Col lg={8}>
                    <Search dispatchFunc={updateSellerSearchKey} />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Sellers List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Company Name</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
                      <Th>Status</Th>
                      <Th>Created At</Th>
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
                            <div style={{ maxWidth: "120px" }}>
                              <span>{item?._id}</span>
                            </div>
                          </Th>
                          <Td>{item?.company_name}</Td>
                          <Td>{item?.email}</Td>
                          <Td>{item?.phone_number}</Td>
                          <Td>{item?.status}</Td>
                          <Td>
                            {new Date(item?.createdAt).toLocaleDateString()}
                          </Td>
                          <Td>
                            <div>
                              <Tooltip title="Edit">
                                <button
                                  className="btn btn-success me-0 me-xl-2 button"
                                  onClick={() =>
                                    history.push(`/seller/edit/${item._id}`)
                                  }
                                >
                                  <i className="fa fa-edit" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Details">
                                <button
                                  className="btn btn-info button me-0 me-xl-2"
                                  onClick={() =>
                                    history.push(`/seller/details/${item._id}`)
                                  }
                                >
                                  <i className="fa fa-eye" />
                                </button>
                              </Tooltip>
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
                {!loading && sellers.length < 1 && (
                  <div className="text-center">
                    <h4>No Data!</h4>
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

const SearchWrapper = styled.div`
  border: 1px solid lightgray;
  border-radius: 6px;
  width: 100%;
  padding: 2px 7px;
  @media (max-width: 1200px) {
    width: 100%;
  }
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

export default SellerList;
