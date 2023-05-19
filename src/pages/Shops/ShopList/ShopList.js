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
import { useGlobalContext } from '../../../context';
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
  // const { userType, adminType, _id: Id } = useSelector((store) => store.Login.admin);
  const { currentUser } = useGlobalContext();
  const { userType, seller, adminType } = currentUser;

  const [myShop, setMyShop] = useState([]);

  useEffect(() => {
    dispatch(setShopStatusFalse());
    dispatch(updateShopType({ label: 'All', value: 'all' }));
    dispatch(updateShopSearchKey(''));
    dispatch(updateSortByKey({ label: 'Desc', value: 'desc' }));
    dispatch(updateShopStatusKey({ label: 'All', value: 'all' }));
  }, []);

  const callShopList = async (refresh = false) => {
    if (userType === 'shop') {
      const data = await callApi(seller?._id, SINGLE_SHOP, 'shop');
      if (data) {
        setMyShop([data]);
      }
    } else {
      dispatch(getAllShop(refresh, userType === 'seller' ? seller?._id : null));
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
            isRefresh={userType !== 'shop'}
            isAddNew={userType === 'admin' && adminType !== 'customerService'}
            addNewRoute="shops/add"
          />

          {userType !== 'shop' && (
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
                  {userType !== 'seller' && (
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
              <CardTitle className="h4"> {userType !== 'shop' ? 'Shop List' : 'My Shop'}</CardTitle>
              <ShopTable shops={userType === 'shop' ? myShop : shops} />
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
                  lisener={(page) => dispatch(getAllShop(true, userType === 'seller' ? seller?._id : null, page))}
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
