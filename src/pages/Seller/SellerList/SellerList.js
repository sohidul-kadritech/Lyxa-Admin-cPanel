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
  updateSellerSearchKey,
  updateSellerSortByKey,
  updateSellerStatusKey,
  updateSellerSubTypeKey,
  updateSellerType,
} from "../../../store/Seller/sellerAction";
import AppPagination from "../../../components/AppPagination";
import Lightbox from "react-image-lightbox";
import { useHistory } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import styled from "styled-components";
import {
  sellerStatusOptions,
  sellerSubTypeOptions,
  sellerTypeOptions,
  shopTypeOptions,
  sortByOptions,
} from "../../../assets/staticData";
import Select from "react-select";

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
    sortByKey,
    searchKey,
    statusKey,
    typeKey,
    subTypeKey,
  } = useSelector((state) => state.sellerReducer);

  useEffect(() => {
    dispatch(setSellerStatusFalse());
  }, []);

  useEffect(() => {
    if(sortByKey || searchKey || statusKey || typeKey || subTypeKey){
      
    callSellerList(true);
    }else{
      callSellerList()
    }
  },[sortByKey, searchKey, statusKey, typeKey, subTypeKey]);

  const callSellerList = (refresh = false) => {
    dispatch(getAllSeller(refresh));
  };

  // DEBOUNCE SEARCH

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      // const context = this;
      timer = setTimeout(() => {
        func(args[0]);
      }, delay);
    };
    // console.log("yes....");
  };

  const handleSearchChange = (event) => {
    // console.log("event", event.target.value)
    // setOpen(true);
    dispatch(updateSellerSearchKey(event.target.value));
  };

  const searchKeyListener = debounce(handleSearchChange, 300);



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
                        options={sellerTypeOptions}
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
                        options={sellerStatusOptions}
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
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Sub Type</label>
                      <Select
                        palceholder="Select Status"
                        options={sellerSubTypeOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={subTypeKey}
                        onChange={(e) => dispatch(updateSellerSubTypeKey(e))}
                        defaultValue={""}
                      />
                    </div>
                  </Col>
                  <Col lg={8}>
                    <label className="control-label">Search</label>
                    <SearchWrapper>
                      <div className="search__wrapper">
                        <i className="fa fa-search" />
                        <input
                          className="form-control"
                          type="search"
                          placeholder="Search Seller..."
                          id="search"
                          onChange={searchKeyListener}
                        />
                      </div>
                    </SearchWrapper>
                  </Col>
                </Row>
              </CardBody>
            </Card>

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
                          <Th style={{ height: "50px",maxWidth: '150px' }}>
                   
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
