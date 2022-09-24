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
  getAllShop,
  setShopStatusFalse,
  updateShopLiveStatus,
  updateShopSearchKey,
  updateShopStatusKey,
  updateShopType,
  updateSortByKey,
} from "../../../store/Shop/shopAction";
import AppPagination from "../../../components/AppPagination";
import { useHistory } from "react-router-dom";

import {
  liveStatusFilterOptions,
  shopStatusOptions,
  shopTypeOptions,
  sortByOptions,
} from "../../../assets/staticData";
import Search from "../../../components/Search";
import ShopTable from "../../../components/ShopTable";

const ShopList = () => {
  const dispatch = useDispatch();

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
    liveStatus,
  } = useSelector((state) => state.shopReducer);
  const { account_type, adminType, _id: Id } = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    dispatch(setShopStatusFalse());
    dispatch(updateShopType({ label: "All", value: "all" }));
    dispatch(updateShopSearchKey(""));
  }, []);

  useEffect(() => {
    if (statusKey || typeKey || sortByKey || searchKey || liveStatus) {
      callShopList(true);
    }
  }, [statusKey, typeKey, sortByKey, searchKey, liveStatus]);

  const callShopList = (refresh = false) => {
    dispatch(getAllShop(refresh, account_type === 'seller' ? Id : null));
  };

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
              isAddNew={account_type === 'admin' && adminType !== 'customerService'}
              addNewRoute="shops/add"
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
                        onChange={(e) => dispatch(updateSortByKey(e))}
                      />
                    </div>
                  </Col>
                  {account_type !== 'seller' && <Col lg={4}>
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
                  </Col>}

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
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Live Status</label>
                      <Select
                        palceholder="Select Status"
                        options={liveStatusFilterOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={liveStatus}
                        onChange={(e) => dispatch(updateShopLiveStatus(e))}
                        defaultValue={""}
                      />
                    </div>
                  </Col>
                  <Col lg={8}>
                    <Search dispatchFunc={updateShopSearchKey} />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>

                <CardTitle className="h4"> Shop List</CardTitle>

                <ShopTable shops={shops} />
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
                    lisener={(page) => dispatch(getAllShop(true, account_type === 'seller' ? Id : null, page))}
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

export default ShopList;
