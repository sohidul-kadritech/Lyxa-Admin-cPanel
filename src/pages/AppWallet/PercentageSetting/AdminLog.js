import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Card, CardBody, CardTitle, Col, Container, Row } from 'reactstrap';
import { adminLogTypeOptions, sortByOptions } from '../../../assets/staticData';
import AppPagination from '../../../components/AppPagination';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import { useGlobalContext } from '../../../context';
import {
  getAdminLogHistory,
  updateAdminLogSortKey,
  updateAdminLogTypeKey,
} from '../../../store/Settings/settingsAction';

function AdminLog() {
  const dispatch = useDispatch();
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const { loading, adminLogType, logSortBy, adminLogs, paging, hasNextPage, hasPreviousPage, currentPage } =
    useSelector((state) => state.settingsReducer);

  const callLogList = (refresh = false) => {
    dispatch(getAdminLogHistory(refresh));
  };

  useEffect(() => {
    if (adminLogType || logSortBy) {
      callLogList(true);
    }
  }, [adminLogType, logSortBy]);

  // HISTORY TYPE
  const historyType = (type) => {
    let newType = '';
    if (type) {
      newType = type.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    } else {
      newType = 'N/A';
    }

    return newType;
  };

  // GET  VALUE
  const getValue = (type, value) => {
    // const state = store.getState();
    // const currency = state.settingsReducer.appSettingsOptions.currency.code.toUpperCase();

    console.log(type);

    let newValue = null;
    if (!value || value.length <= 0) {
      newValue = 0;
    } else if (type === 'maxDiscount' || type === 'maxCustomerServiceValue' || type === 'nearByShopKm') {
      newValue = value;
    } else if (type === 'searchDeliveryBoyKm') {
      newValue = value.map((item) => <p key={item}>{item}</p>);
    } else if (type === 'globalDropCharge' || type === 'specificSellerDropCharge' || type === 'sellerDropChargeReset') {
      newValue = (
        <span>{`${value?.dropPercentage ?? 0} ${value?.dropPercentageType === 'parcentage' ? '%' : currency}`}</span>
      );
    } else if (
      type === 'globalDeliveryCut' ||
      type === 'specificSellerDeliveryCut' ||
      type === 'globalDeliveryCutForButler'
    ) {
      newValue = value.map((item) => (
        <p
          key={`${item?.from}_${item?.to}`}
        >{`(${item?.from} - ${item?.to} km)- charge:${item?.charge} rider:${item?.deliveryPersonCut}`}</p>
      ));
    } else {
      newValue = 0;
    }
    return newValue;
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Admin Log" loading={loading} callList={callLogList} />
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
                      value={logSortBy}
                      onChange={(e) => dispatch(updateAdminLogSortKey(e))}
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-4">
                    <label className="control-label">Type</label>
                    <Select
                      palceholder="Select Status"
                      options={adminLogTypeOptions}
                      classNamePrefix="select2-selection"
                      value={adminLogType}
                      onChange={(e) => dispatch(updateAdminLogTypeKey(e))}
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Row className="mb-3">
                <Col md={3} className="text-end" />
              </Row>
              <CardTitle className="h4">Admin Logs History</CardTitle>
              <Table id="tech-companies-1" className="table  table-hover text-center">
                <Thead>
                  <Tr>
                    <Th>Type</Th>
                    <Th>Old Value</Th>
                    <Th>New Value</Th>
                    <Th>Admin</Th>
                    <Th>Created Date</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}>
                  {adminLogs?.map((item, index) => (
                    <Tr
                      key={index}
                      className="align-middle"
                      style={{
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      <Th className="text-capitalize">{historyType(item?.type)}</Th>

                      <Td className="text-danger">{getValue(item?.type, item?.oldValue)}</Td>
                      <Td className="text-success">{getValue(item?.type, item?.newValue)}</Td>
                      <Td>{item?.admin?.name}</Td>
                      <Td>{moment(item?.date).format('MMMM Do YYYY')}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              {!loading && adminLogs.length < 1 && (
                <div className="text-center">
                  <h4>No History!</h4>
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
                  lisener={(page) => dispatch(getAdminLogHistory(true, page))}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default AdminLog;
