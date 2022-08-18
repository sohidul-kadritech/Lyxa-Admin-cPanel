import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../../components/GlobalWrapper";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";

import {
  getAllCategory,
  setCatStatusFalse,
  updateCategoryShopType,
} from "../../../../store/Category/categoryAction";
import AppPagination from "./../../../../components/AppPagination";
import Lightbox from "react-image-lightbox";
import { useHistory } from "react-router-dom";
import { shopTypeOptions } from "../../../../assets/staticData";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const CategoryList = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    loading,
    categories,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    shopType,
  } = useSelector((state) => state.categoryReducer);

  const [isZoom, setIsZoom] = useState(false);
  const [catImg, setCatImg] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const {
    account_type,
    _id: Id,
    shopType: adminShopType,
  } = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    if (account_type === "shop") {
      dispatch(updateCategoryShopType(adminShopType));
    }

    return;
  }, [account_type]);

  useEffect(() => {
    if (shopType) {
      callCategoryList(true);
      dispatch(setCatStatusFalse());
    }
  }, [shopType]);

  const callCategoryList = (refresh = false) => {
    dispatch(getAllCategory(refresh));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"List"}
              title="Category"
              loading={loading}
              callList={callCategoryList}
              isAddNew={true}
              addNewRoute={"categories/add"}
            />

            {isZoom ? (
              <Lightbox
                mainSrc={catImg}
                enableZoom={true}
                onCloseRequest={() => {
                  setIsZoom(!isZoom);
                }}
              />
            ) : null}

            <Row>
              <Col lg={4}>
                <Card>
                  <CardBody>
                    <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-label">
                        Shop Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={shopType}
                        label="Shop Type"
                        disabled={account_type === "shop"}
                        onChange={(event) => {
                          dispatch(updateCategoryShopType(event.target.value));
                        }}
                      >
                        {shopTypeOptions.map((option, index) => (
                          <MenuItem key={index} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Card>
              <CardBody>
                <CardTitle className="h4"> Category List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Image</Th>
                      <Th>Name</Th>
                      <Th>Type</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {categories.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th className="d-flex justify-content-center">
                            <div className="image__wrapper">
                              {item?.image ? (
                                <img
                                  onClick={() => {
                                    setIsZoom(true);
                                    setCatImg(item.image);
                                  }}
                                  className="img-fluid avater avater-lg cursor-pointer"
                                  alt=""
                                  src={item.image}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                              ) : (
                                "N/A"
                              )}
                            </div>
                          </Th>
                          <Td>{item?.name}</Td>
                          <Td>{item?.type}</Td>
                          <Td>{item?.status}</Td>
                          <Td>
                            <div>
                              <Tooltip title="Edit">
                                <button
                                  className="btn btn-success me-3 button"
                                  onClick={() =>
                                    history.push(`/categories/edit/${item._id}`)
                                  }
                                >
                                  <i className="fa fa-edit" />
                                </button>
                              </Tooltip>
                              <Tooltip
                                title={`${"Details"} ${
                                  item?.type !== "food"
                                    ? "& add subcagegory"
                                    : ""
                                }`}
                              >
                                <button
                                  className="btn btn-info button"
                                  onClick={() =>
                                    history.push(
                                      `/category/details/${item._id}`
                                    )
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
                {!loading && categories.length < 1 && (
                  <div className="text-center">
                    <h4>No category add yet!</h4>
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
                    lisener={(page) => dispatch(getAllCategory(true, page))}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>

      {/* ADD SUB CATEGORY  */}

      {/* <Modal
        isOpen={openModal}
        toggle={() => {
          setOpenModal(!openModal);
        }}
        centered={true}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Add/Remove User Cradit</h5>
          <button
            type="button"
            onClick={() => {
              setOpenModal(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">

        </div>
      </Modal> */}
    </React.Fragment>
  );
};

export default CategoryList;
