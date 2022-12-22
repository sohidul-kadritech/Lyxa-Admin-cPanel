import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import Select from "react-select";
import {
  productStatusOptions,
  shopTypeOptions,
  sortByOptions,
} from "../../../assets/staticData";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProduct,
  updateProductCategory,
  updateProductSearchKey,
  updateProductSortByKey,
  updateProductStatusKey,
  updateProductType,
} from "../../../store/Product/productAction";
import AppPagination from "../../../components/AppPagination";
import Search from "./../../../components/Search";
import ProductTable from "../../../components/ProductTable";
import {
  updateShopSearchKey,
  updateShopType,
} from "../../../store/Shop/shopAction";
import { useLocation } from "react-router-dom";
import { Autocomplete, Box, TextField } from "@mui/material";
import {
  getAllCategory,
  updateCategoryShopType,
} from "../../../store/Category/categoryAction";

const ProductList = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const {
    searchKey,
    statusKey,
    typeKey,
    sortByKey,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    loading,
    products,
    status,
    category,
  } = useSelector((state) => state.productReducer);
  const { shops } = useSelector((state) => state.shopReducer);
  const { categories } = useSelector((state) => state.categoryReducer);

  const { account_type, _id: Id } = JSON.parse(localStorage.getItem("admin"));

  const [shop, setShop] = useState(null);
  const [categorySearchKey, setCategorySearchKey] = useState("");

  useEffect(() => {
    dispatch(updateCategoryShopType("all"));
    dispatch(getAllCategory(true, account_type));
  }, []);

  useEffect(() => {
    if (account_type === "admin") {
      dispatch(updateShopType({ label: "All", value: "all" }));
      dispatch(updateShopSearchKey(""));
    }

    return;
  }, [account_type]);

  const callProductList = (refresh = false) => {
    // console.log({ shopId }, { sellerId });
    dispatch(
      getAllProduct(
        refresh,
        searchParams.get("shopId")
          ? searchParams.get("shopId")
          : account_type === "shop"
          ? Id
          : null,
        account_type === "seller" ? Id : null
      )
    );
  };

  useEffect(() => {
    if (
      searchKey ||
      statusKey ||
      typeKey ||
      sortByKey ||
      searchParams ||
      status ||
      category
    ) {
      callProductList(true);
    }
  }, [
    searchKey,
    statusKey,
    typeKey,
    sortByKey,
    searchParams,
    status,
    category,
  ]);

  useEffect(() => {
    if (searchParams.get("shopId")) {
      const findShop = shops.find(
        (item) => item._id === searchParams.get("shopId")
      );
      setShop(findShop);
    }
  }, [searchParams.get("shopId")]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Lyxa"
              breadcrumbItem={shop ? "Products" : "List"}
              title={shop ? shop?.shopName : "Product"}
              loading={loading}
              callList={callProductList}
              isAddNew={true}
              addNewRoute="products/add"
              params={shop?._id ? `shopId=${shop?._id}` : null}
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

                  {account_type !== "seller" && account_type !== "shop" && (
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
                  )}
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
                <Row>
                  <Col lg={8}>
                    <Search
                      dispatchFunc={updateProductSearchKey}
                      placeholder="Search by id or name"
                    />
                  </Col>
                  <Col lg={4}>
                    <label className="control-label">Category</label>
                    <Autocomplete
                      className="cursor-pointer"
                      value={category}
                      onChange={(event, newValue) =>
                        dispatch(updateProductCategory(newValue))
                      }
                      getOptionLabel={(option, index) =>
                        option.name ? option.name : ""
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?._id == value?._id
                      }
                      inputValue={categorySearchKey}
                      onInputChange={(event, newInputValue) => {
                        setCategorySearchKey(newInputValue);
                      }}
                      id="controllable-states-demo"
                      options={categories?.length > 0 ? categories : []}
                      sx={{ width: "100%" }}
                      renderInput={(params, index) => (
                        <TextField {...params} label="Select cateogory" />
                      )}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                          {...props}
                          key={option?._id}
                        >
                          {option?.name}
                        </Box>
                      )}
                    />
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
                      dispatch(
                        getAllProduct(
                          true,
                          searchParams.get("shopId")
                            ? searchParams.get("shopId")
                            : account_type === "shop"
                            ? Id
                            : null,
                          account_type === "seller" ? Id : null,
                          page
                        )
                      )
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

export default ProductList;
