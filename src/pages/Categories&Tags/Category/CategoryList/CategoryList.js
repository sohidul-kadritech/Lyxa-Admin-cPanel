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
import TableImgItem from "../../../../components/TableImgItem";
import ThreeDotsMenu from "../../../../components/ThreeDotsMenu";
import noPhoto from "../../../../assets/images/noPhoto.jpg";

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

  const {
    account_type,
    _id: Id,
    shopType: adminShopType,
    sellerType,
  } = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    if (account_type === "shop" || account_type === "seller") {
      dispatch(
        updateCategoryShopType(adminShopType ? adminShopType : sellerType)
      );
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
    dispatch(getAllCategory(refresh, account_type));
  };

  // HANDLE MENU

  const handleMenu = (menu, item) => {
    if (menu === "Edit") {
      history.push(`/categories/edit/${item?._id}`);
    } else {
      history.push(`/category/details/${item._id}`);
    }
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Lyxa"
              breadcrumbItem={"List"}
              title="Category"
              loading={loading}
              callList={callCategoryList}
              isAddNew={account_type === "shop"}
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
                        disabled={
                          account_type === "shop" || account_type === "seller"
                        }
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
                  className="table table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Image/Name</Th>
                      <Th>Type</Th>
                      <Th>Shop</Th>
                      <Th>Status</Th>
                      {account_type === "shop" && <Th>Action</Th>}
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
                          <Th>
                            <TableImgItem
                              img={`${
                                item?.category?.image
                                  ? item?.category?.image
                                  : noPhoto
                              }`}
                              name={item?.category?.name}
                            />
                          </Th>

                          <Td>{item?.category?.type}</Td>
                          <Td>
                            {!item?.shop?.shopName
                              ? "N/A"
                              : item?.shop?.shopName}
                          </Td>
                          <Td>
                            <div
                              className={`${
                                item?.category?.status === "active"
                                  ? "active-status"
                                  : "inactive-status"
                              }`}
                            >
                              {item?.category?.status}
                            </div>
                          </Td>
                          {account_type === "shop" && (
                            <Td>
                              <ThreeDotsMenu
                                handleMenuClick={(menu) =>
                                  handleMenu(menu, item)
                                }
                                menuItems={["Edit", "Details"]}
                              />
                            </Td>
                          )}
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
                    lisener={(page) =>
                      dispatch(getAllCategory(true, account_type, page))
                    }
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
