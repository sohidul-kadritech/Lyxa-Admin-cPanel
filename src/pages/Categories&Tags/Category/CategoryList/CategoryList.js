import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../../components/GlobalWrapper";
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
import { useDispatch, useSelector } from "react-redux";
import Tooltip from '@mui/material/Tooltip';

import {
  getAllCategory,
  setCatStatusFalse,
} from "../../../../store/Category/categoryAction";
import AppPagination from "./../../../../components/AppPagination";
import Lightbox from "react-image-lightbox";
import { useHistory } from "react-router-dom";

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
  } = useSelector((state) => state.categoryReducer);

  const [isZoom, setIsZoom] = useState(false);
  const [catImg, setCatImg] = useState("");

  useEffect(() => {
    callCategoryList();
    dispatch(setCatStatusFalse());
  }, []);

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

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Category List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Image</Th>
                      <Th>Name</Th>
                      <Th>Slug</Th>
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
                          <Th style={{ height: "50px",maxWidth: '150px' }}>
                       
                              <img
                                onClick={() => {
                                  setIsZoom(true);
                                  setCatImg(item.image);
                                }}
                                className="img-fluid cursor-pointer"
                                alt=""
                                src={item.image}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                  
                          </Th>

                          <Td>{item.name}</Td>
                          <Td>{item.slug}</Td>
                          <Td>{item.type}</Td>
                          <Td>{item.status}</Td>
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
                              <Tooltip title="Details">
                              <button
                                className="btn btn-info button"
                                onClick={() =>history.push(`/category/details/${item._id}`) }
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
                    lisener={(page) => dispatch(getAllCategory(true, page))}
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

export default CategoryList;
