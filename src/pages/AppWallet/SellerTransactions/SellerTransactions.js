import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Button, Card, CardBody, CardTitle, Col, Container, Row } from 'reactstrap';
import AppPagination from '../../../components/AppPagination';
import CircularLoader from '../../../components/CircularLoader';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import Search from '../../../components/Search';
import TableImgItem from '../../../components/TableImgItem';
import {
  getSellersTrx,
  updateSellerTrxEndDate,
  updateSellerTrxStartDate,
  updateSellerWalletSearchKey,
} from '../../../store/appWallet/appWalletAction';

function SellerTransactions() {
  const dispatch = useDispatch();
  const history = useHistory();
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();

  const {
    loading,
    sellersTrxs,
    sellerTrxStartDate,
    sellerTrxEndDate,
    sellerSearchKey,
    paging,
    hasNextPage,
    currentPage,
    hasPreviousPage,
  } = useSelector((state) => state.appWalletReducer);

  const callTransList = (refresh = false) => {
    dispatch(getSellersTrx(refresh));
  };

  useEffect(() => {
    if (sellerTrxStartDate || sellerTrxEndDate || sellerSearchKey) {
      callTransList(true);
    }
  }, [sellerTrxStartDate, sellerTrxEndDate, sellerSearchKey]);

  const sellerShopsTrxs = (sellerId, companyName) => {
    history.push({
      pathname: `/app-wallet/seller/shops-transactions`,
      search: `?sellerId=${sellerId}&companyName=${companyName}`,
    });
  };

  // GENERATE PDF
  const downloadPdf = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape

    // eslint-disable-next-line new-cap
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = 'Seller Transactions';
    const headers = [
      ['Seller', 'Total Orders', 'Order amount', 'Delivery fee', 'Lyxa earning', 'Unsettled amount', 'Seller earning'],
    ];
    const marginLeft = 40;

    const data = sellersTrxs.map((trx) => [
      trx.company_name,
      trx?.summary.totalOrder,
      trx?.summary.orderValue?.productAmount.toFixed(2),
      trx?.summary.orderValue?.deliveryFee,
      trx?.summary.totalDropGet,
      trx?.summary.totalSellerUnsettle.toFixed(2),
      trx?.summary.totalSellerEarning,
    ]);

    const content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save('sellerTransactions.pdf');
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Sellers Wallet" loading={loading} callList={callTransList} />

          <Card>
            <CardBody>
              <Row>
                <Col lg={4}>
                  <div className=" w-100">
                    <label>Start Date</label>
                    <div className="form-group mb-0 w-100">
                      <Flatpickr
                        className="form-control d-block"
                        id="startDate"
                        placeholder="Select Start Date"
                        value={sellerTrxStartDate}
                        onChange={(selectedDates, dateStr) => dispatch(updateSellerTrxStartDate(dateStr))}
                        options={{
                          altInput: true,
                          altFormat: 'F j, Y',
                          dateFormat: 'Y-m-d',
                        }}
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className=" mt-3 mt-lg-0 w-100">
                    <label>End Date</label>
                    <div className="form-group mb-0">
                      <Flatpickr
                        className="form-control w-100"
                        id="endDate"
                        placeholder="Select End Date"
                        value={sellerTrxEndDate}
                        onChange={(selectedDates, dateStr) => dispatch(updateSellerTrxEndDate(dateStr))}
                        options={{
                          altInput: true,
                          altFormat: 'F j, Y',
                          dateFormat: 'Y-m-d',
                        }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className=" mt-4">
                <Col lg={8}>
                  <Search dispatchFunc={updateSellerWalletSearchKey} placeholder="Search by Company name or Id" />
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card className="table-data-hover">
            <CardBody>
              <Row className="mb-3">
                <Col md={3} className="text-end" />
              </Row>
              <div className="d-flex align-items-center justify-content-between">
                <CardTitle className="h4">Sellers Wallets List</CardTitle>
                <Button outline color="success" onClick={() => downloadPdf()}>
                  Download PDF
                </Button>
              </div>
              <hr />
              <Table id="tech-companies-1" className="table   table-hover text-center">
                <Thead>
                  <Tr>
                    <Th>ID/Company</Th>
                    <Th>Order</Th>
                    <Th>Order amount ({currency})</Th>
                    <Th>Delivery fee ({currency})</Th>
                    <Th>Lyxa earning ({currency})</Th>
                    <Th>Unsettled amount ({currency})</Th>
                    <Th>Seller earning ({currency})</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}>
                  {sellersTrxs.length > 0 &&
                    sellersTrxs.map((trx) => (
                      <Tr
                        key={Math.random()}
                        className="align-middle cursor-pointer"
                        style={{
                          fontSize: '15px',
                          fontWeight: '500',
                        }}
                        onClick={() => sellerShopsTrxs(trx._id, trx?.company_name)}
                      >
                        <Th title="Click to see details">
                          <TableImgItem name={trx?.company_name} id={trx?.autoGenId} />
                        </Th>

                        <Td>{trx?.summary?.orderValue?.count ?? 0}</Td>
                        <Td>{trx?.summary?.orderValue?.productAmount.toFixed(2) ?? 0}</Td>
                        <Td>{trx?.summary?.orderValue?.deliveryFee ?? 0}</Td>
                        <Td>{trx?.summary?.totalDropGet}</Td>
                        <Td>{trx?.summary?.totalSellerUnsettle.toFixed(2)}</Td>
                        <Td>{trx?.summary?.totalSellerEarning}</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
              {loading && (
                <div className="text-center">
                  <CircularLoader />
                </div>
              )}
              {!loading && sellersTrxs.length < 1 && (
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
                  lisener={(page) => dispatch(getSellersTrx(true, page))}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default SellerTransactions;
