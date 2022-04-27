import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Select from "react-select";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteShop,
  getAllShop,
  setShopStatusFalse,
  updateShopSearchKey,
  updateShopStatusKey,
  updateShopType,
  updateSortByKey,
} from "../../../store/Shop/shopAction";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Tooltip from "@mui/material/Tooltip";
import AppPagination from "../../../components/AppPagination";
import { useHistory } from "react-router-dom";
import Lightbox from "react-image-lightbox";
import SweetAlert from "react-bootstrap-sweetalert";
import { shopStatusOptions, shopTypeOptions, sortByOptions } from "../../../assets/staticData";

const ShopList = () => {


  const dispatch = useDispatch();
  const history = useHistory();

  const {
    statusKey,
    typeKey,
    sortByKey,
    searchKey,
    loading,
    shops,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
  } = useSelector((state) => state.shopReducer);

  const [isZoom, setIsZoom] = useState(false);
  const [shopImg, setShopImg] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState("");
  const [dynamic_description, setdynamic_description] = useState("");

  useEffect(() => {
    dispatch(setShopStatusFalse());
  }, []);

  useEffect(() => {
    if (statusKey || typeKey || sortByKey || searchKey) {
      callShopList(true);
    } else {
      callShopList();
    }
  }, [statusKey, typeKey, sortByKey, searchKey]);

  const callShopList = (refresh = false) => {
    dispatch(getAllShop(refresh));
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
    dispatch(updateShopSearchKey(event.target.value));
  };

  const searchKeyListener = debounce(handleSearchChange, 300);

  // DELETE SHOP 

  const handleDelete = (id) =>{
    dispatch(deleteShop(id))
  }

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"List"}
              title="Shop"
              loading={loading}
              callList={callShopList}
              isAddNew={true}
              addNewRoute="shops/add"
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
                mainSrc={shopImg}
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
                        onChange={(e) => dispatch(updateSortByKey(e))}
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
                        onChange={(e) => dispatch(updateShopType(e))}
                        defaultValue={""}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Status</label>
                      <Select
                        palceholder="Select Status"
                        options={shopStatusOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={statusKey}
                        onChange={(e) => dispatch(updateShopStatusKey(e))}
                        defaultValue={""}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                  <SearchWrapper>
                    <div className="search__wrapper">
                      <i className="fa fa-search" />
                      <input
                        className="form-control"
                        type="search"
                        placeholder="Search Shop..."
                        id="search"
                        onChange={searchKeyListener}
                      />
                    </div>
                  </SearchWrapper>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Shop List</CardTitle>
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
                                  setIsZoom(true);
                                  setShopImg(item.shopLogo);
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
                                    history.push(`/shops/details/${item._id}`)
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
                    lisener={(page) => dispatch(getAllShop(true,null, page))}
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
  width: 50%;
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

export default ShopList;
