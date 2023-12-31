import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Card, CardBody, CardTitle, Col, Container, Row } from 'reactstrap';
import AppPagination from '../../../components/AppPagination';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import {
  getAllShop,
  setShopStatusFalse,
  updateShopLiveStatus,
  updateShopSearchKey,
  updateShopStatusKey,
  updateShopType,
  updateSortByKey,
} from '../../../store/Shop/shopAction';

import { liveStatusFilterOptions, shopStatusOptions, shopTypeOptions, sortByOptions } from '../../../assets/staticData';
import Search from '../../../components/Search';
import ShopTable from '../../../components/ShopTable';
import { callApi } from '../../../components/SingleApiCall';
import { SINGLE_SHOP } from '../../../network/Api';

function ShopList() {
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
  const { account_type, adminType, _id: Id } = useSelector((store) => store.Login.admin);

  const [myShop, setMyShop] = useState([]);

  useEffect(() => {
    dispatch(setShopStatusFalse());
    dispatch(updateShopType({ label: 'All', value: 'all' }));
    dispatch(updateShopSearchKey(''));
    dispatch(updateSortByKey({ label: 'Desc', value: 'desc' }));
    dispatch(updateShopStatusKey({ label: 'All', value: 'all' }));
  }, []);

  const callShopList = async (refresh = false) => {
    if (account_type === 'shop') {
      const data = await callApi(Id, SINGLE_SHOP, 'shop');
      if (data) {
        setMyShop([data]);
      }
    } else {
      dispatch(getAllShop(refresh, account_type === 'seller' ? Id : null));
    }
  };

  useEffect(() => {
    if (statusKey || typeKey || sortByKey || searchKey || liveStatus) {
      callShopList(true);
    }
  }, [statusKey, typeKey, sortByKey, searchKey, liveStatus]);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem="List"
            title="Shop"
            loading={loading}
            callList={callShopList}
            isRefresh={account_type !== 'shop'}
            isAddNew={account_type === 'admin' && adminType !== 'customerService'}
            addNewRoute="shops/add"
          />

          {account_type !== 'shop' && (
            <Card>
              <CardBody>
                <Row>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Sort By Order</label>
                      <Select
                        palceholder="Select Status"
                        options={sortByOptions}
                        classNamePrefix="select2-selection"
                        value={sortByKey}
                        onChange={(e) => dispatch(updateSortByKey(e))}
                      />
                    </div>
                  </Col>
                  {account_type !== 'seller' && (
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
                          defaultValue=""
                        />
                      </div>
                    </Col>
                  )}

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
                        defaultValue=""
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
                        defaultValue=""
                      />
                    </div>
                  </Col>
                  <Col lg={8}>
                    <Search
                      dispatchFunc={updateShopSearchKey}
                      placeholder="Search by name or id or phone number or email"
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardBody>
              <CardTitle className="h4"> {account_type !== 'shop' ? 'Shop List' : 'My Shop'}</CardTitle>
              <ShopTable shops={account_type === 'shop' ? myShop : shops} />
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
  );
}

export default ShopList;
