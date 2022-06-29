import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
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
} from "../../../store/Product/productAction";
import AppPagination from "../../../components/AppPagination";
import Search from "./../../../components/Search";
import ProductTable from "../../../components/ProductTable";
import {
  updateShopSearchKey,
  updateShopType,
} from "../../../store/Shop/shopAction";
import { KeyboardReturnRounded } from "@mui/icons-material";

const ProductList = () => {
  const dispatch = useDispatch();

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
    return;
  }, [searchKey, statusKey, typeKey, sortByKey, productVisibilityKey]);

  const callProductList = (refresh = false) => {
    dispatch(getAllProduct(refresh));
  };

  useEffect(() => {
    dispatch(updateShopType({ label: "All", value: "all" }));
    dispatch(updateShopSearchKey(""));
    return;
  }, []);

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
                    <Search dispatchFunc={updateProductSearchKey} />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <CardTitle className="h4"> Product List</CardTitle>
                <ProductTable products={products} loading={loading} />
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
