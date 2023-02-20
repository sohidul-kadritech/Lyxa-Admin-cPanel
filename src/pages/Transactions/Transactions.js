/* eslint-disable no-undef */
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Button, Card, CardBody, CardTitle, Col, Container, Row, Spinner } from 'reactstrap';
import { accountsOptions, sortByOptions } from '../../assets/staticData';
import AppPagination from '../../components/AppPagination';
import Breadcrumb from '../../components/Common/Breadcrumb';
import GlobalWrapper from '../../components/GlobalWrapper';
import Search from '../../components/Search';
import {
  getAllTransctions,
  updateAllTrxAccountType,
  updateAllTrxSearchKey,
  updateAllTrxSortByKey,
} from '../../store/appWallet/appWalletAction';

function TypeInfo({ type, linkItem, route }) {
  const history = useHistory();
  return (
    <span className="link" onClick={() => history.push(route)}>
      {`${type} ${linkItem}`}
    </span>
  );
}

function Transactions() {
  const dispatch = useDispatch();
  const {
    loading,
    allTrxs,
    paging,
    hasNextPage,
    currentPage,
    hasPreviousPage,
    trxSortByKey,
    trxSearchKey,
    trxAccountType,
  } = useSelector((state) => state.appWalletReducer);

  const callTransList = (refresh = false) => {
    dispatch(getAllTransctions(refresh));
  };

  useEffect(() => {
    if (trxSortByKey || trxSearchKey || trxAccountType) {
      callTransList(true);
    }
  }, [trxSortByKey, trxSearchKey, trxAccountType]);
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();

  const updateTrxType = (trx) => {
    let newType = null;
    const orderRoute = trx?.order ? `/orders/details/${trx?.order}` : null;

    if (trx?.order) {
      newType = <TypeInfo type="Order" linkItem={trx?.order.autoGenId} route={orderRoute} />;
    } else {
      newType = 'on going';
    }

    return newType;
  };

  // GENERATE PDF
  const downloadPdf = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape

    // eslint-disable-next-line new-cap
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = `Transactions`;
    const headers = [['ID', 'Amount', 'Type', 'Payment Method', 'Date']];
    const marginLeft = 40;

    const data = allTrxs.map((trx) => [
      trx._id,
      trx.amount,

      updateTrxType(trx),
      trx?.paymentType,
      new Date(trx?.createdAt).toLocaleDateString(),
    ]);

    const content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(`Transactions.pdf`);
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Transactions" loading={loading} callList={callTransList} />

          <Card>
            <CardBody>
              <Row>
                <Col lg={3}>
                  <div className="mb-4">
                    <label className="control-label">Sort By</label>
                    <Select
                      palceholder="Select Status"
                      options={sortByOptions}
                      classNamePrefix="select2-selection"
                      value={trxSortByKey}
                      onChange={(e) => dispatch(updateAllTrxSortByKey(e))}
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <Search dispatchFunc={updateAllTrxSearchKey} />
                </Col>
                <Col lg={3}>
                  <div className="mb-4">
                    <label className="control-label">Account Type</label>
                    <Select
                      palceholder="Select Status"
                      options={accountsOptions}
                      classNamePrefix="select2-selection"
                      value={trxAccountType}
                      onChange={(e) => dispatch(updateAllTrxAccountType(e))}
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
              <div className="d-flex align-items-center justify-content-between">
                <CardTitle className="h4">Transactions</CardTitle>
                <Button outline color="success" onClick={() => downloadPdf()}>
                  Download PDF
                </Button>
              </div>
              <hr />

              <Table id="tech-companies-1" className="table  table-hover text-center">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Amount ({currency})</Th>
                    <Th>Type</Th>
                    <Th>Payment Method/By</Th>
                    <Th>Date</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}>
                  {allTrxs?.map((item, index) => (
                    <Tr
                      key={index}
                      className="align-middle cursor-pointer"
                      style={{
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      <Th style={{ textAlign: 'left' }} title="Click to see details">
                        {item?.autoGenId}
                      </Th>
                      <Td
                        className={
                          item?.type === 'userBalanceWithdrawAdmin' ||
                          item?.type === 'adminAddBalanceShop' ||
                          item?.type === 'userPayAfterReceivedOrder' ||
                          item?.type === 'userPayBeforeReceivedOrderByWallet' ||
                          item?.type === 'userPayForOrder' ||
                          item?.type === 'deliveryBoyAdminAmountReceivedCash' ||
                          item?.type === 'sellerGetPaymentFromOrderCash'
                            ? 'active-status'
                            : item?.type === 'userBalanceAddAdmin' ||
                              item?.type === 'adminRemoveBalanceShop' ||
                              item?.type === 'userCancelOrderGetWallet' ||
                              item?.type === 'sellerOrderCancel' ||
                              item?.type === 'shopProfileRemoveCash'
                            ? 'inactive-status'
                            : ''
                        }
                      >{`${
                        item?.type === 'userBalanceWithdrawAdmin' ||
                        item?.type === 'adminAddBalanceShop' ||
                        item?.type === 'userPayAfterReceivedOrder' ||
                        item?.type === 'userPayBeforeReceivedOrderByWallet' ||
                        item?.type === 'userPayForOrder' ||
                        item?.type === 'deliveryBoyAdminAmountReceivedCash' ||
                        item?.type === 'sellerGetPaymentFromOrderCash'
                          ? '+'
                          : item?.type === 'userBalanceAddAdmin' ||
                            item?.type === 'adminRemoveBalanceShop' ||
                            item?.type === 'userCancelOrderGetWallet' ||
                            item?.type === 'sellerOrderCancel' ||
                            item?.type === 'shopProfileRemoveCash'
                          ? '-'
                          : ''
                      }${item?.amount}`}</Td>
                      <Td>{updateTrxType(item)}</Td>
                      <Td className="text-capitalize">{item?.paymentMethod ?? 'Admin'}</Td>
                      <Td>{new Date(item?.createdAt).toLocaleDateString()}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {loading && (
                <div className="text-center">
                  <Spinner animation="border" color="success" />
                </div>
              )}
              {!loading && allTrxs.length < 1 && (
                <div className="text-center">
                  <h4>No Transactions!</h4>
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
                  lisener={(page) => dispatch(getAllTransctions(true, page))}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default Transactions;
