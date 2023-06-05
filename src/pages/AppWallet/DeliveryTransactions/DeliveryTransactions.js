import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Button, Card, CardBody, CardTitle, Col, Container, Row } from 'reactstrap';
import { sortByOptions } from '../../../assets/staticData';
import AppPagination from '../../../components/AppPagination';
import CircularLoader from '../../../components/CircularLoader';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import Search from '../../../components/Search';
import TableImgItem from '../../../components/TableImgItem';
import { useGlobalContext } from '../../../context';
import {
  getDeliveryTrx,
  updateDeliverySearchKey,
  updateDeliverySortByKey,
  updateRidersTrxEndDate,
  updateRidersTrxStartDate,
} from '../../../store/appWallet/appWalletAction';

function DeliveryTransactions() {
  const {
    loading,
    deliveryTrxs,
    deliveryTrxStartDate,
    deliveryTrxEndDate,
    paging,
    hasNextPage,
    currentPage,
    hasPreviousPage,
    deliverySortByKey,
    deliverySearchKey,
  } = useSelector((state) => state.appWalletReducer);
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();

  const { general } = useGlobalContext();
  const currency = general?.currency?.code?.toUpperCase();

  const dispatch = useDispatch();
  const history = useHistory();

  const callTransList = (refresh = false) => {
    dispatch(getDeliveryTrx(refresh));
  };

  useEffect(() => {
    if (deliverySortByKey || deliverySearchKey || deliveryTrxStartDate || deliveryTrxEndDate) {
      callTransList(true);
    }
  }, [deliverySortByKey, deliverySearchKey, deliveryTrxStartDate, deliveryTrxEndDate]);

  // GENERATE PDF
  const downloadPdf = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape

    // eslint-disable-next-line new-cap
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = `Delivery Boys Transactions`;
    const headers = [
      [
        'Name',
        'Total Orders',
        'Delivery fee',
        'Lyxa earning',
        'Unsettled amount',
        'Delivery earning',
        'Cash in hand',
        'Settled cash',
      ],
    ];
    const marginLeft = 40;

    const data = deliveryTrxs.map((trx) => [
      trx?.name,
      trx?.summary?.orderValue?.count ?? 0,
      trx?.summary?.totalDeliveyFee,
      trx?.summary?.dropEarning,
      trx?.summary?.totalUnSettleAmount,
      trx?.summary?.riderEarning,
      trx?.summary.totalCashInHand,
      trx?.summary.settleAmount,
    ]);

    const content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(`DeliveryBoysTransactions.pdf`);
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem=" Delivery Transactions"
            title="App Wallet"
            loading={loading}
            callList={callTransList}
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
                      value={deliverySortByKey}
                      onChange={(e) => dispatch(updateDeliverySortByKey(e))}
                    />
                  </div>
                </Col>
                <Col lg={8}>
                  <div className="d-flex my-3 my-md-0 ">
                    <div className=" w-100">
                      <label>Start Date</label>
                      <div className="form-group mb-0 w-100">
                        <Flatpickr
                          className="form-control d-block"
                          id="startDate"
                          placeholder="Start Date"
                          value={deliveryTrxStartDate}
                          onChange={(selectedDates, dateStr) => dispatch(updateRidersTrxStartDate(dateStr))}
                          options={{
                            altInput: true,
                            altFormat: 'F j, Y',
                            dateFormat: 'Y-m-d',
                          }}
                        />
                      </div>
                    </div>
                    <div className="ms-2 w-100">
                      <label>End Date</label>
                      <div className="form-group mb-0">
                        <Flatpickr
                          className="form-control w-100"
                          id="endDate"
                          placeholder="Select End Date"
                          value={deliveryTrxEndDate}
                          onChange={(selectedDates, dateStr) => dispatch(updateRidersTrxEndDate(dateStr))}
                          options={{
                            altInput: true,
                            altFormat: 'F j, Y',
                            dateFormat: 'Y-m-d',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="d-flex justify-content-center">
                <Col lg={8}>
                  <Search
                    placeholder="Search by rider name or email or phone number"
                    dispatchFunc={updateDeliverySearchKey}
                  />
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
                <CardTitle className="h4">Delivery Transactions List</CardTitle>
                <Button outline color="success" onClick={() => downloadPdf()}>
                  Download PDF
                </Button>
              </div>
              <hr />
              <Table id="tech-companies-1" className="table table-hover text-center">
                <Thead>
                  <Tr>
                    <Th>ID/Name</Th>
                    <Th>Orders</Th>
                    <Th>Delivery fee ({currency})</Th>
                    <Th>Lyxa earning ({currency})</Th>
                    <Th>Unsettled amount ({currency})</Th>
                    <Th>Rider earning ({currency})</Th>
                    <Th>Cash in hand ({currency})</Th>
                    <Th>Settled cash ({currency})</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}>
                  {deliveryTrxs.length > 0 &&
                    deliveryTrxs.map((item) => (
                      <Tr
                        key={item?.autoGenId}
                        className="align-middle cursor-pointer"
                        style={{
                          fontSize: '15px',
                          fontWeight: '500',
                        }}
                        onClick={
                          () =>
                            history.push(`/riders/${item._id}?tabId=1`, {
                              rider: item,
                            })
                          // history.push(`/add-wallet/single-delivery-transactions/${item._id}`)
                        }
                      >
                        <Th title="Click to see details">
                          <TableImgItem name={item?.name} id={item?.autoGenId} />
                        </Th>

                        <Td>{item?.summary?.totalOrder}</Td>
                        <Td>{item?.summary?.totalDeliveyFee}</Td>
                        <Td>{item?.summary?.dropEarning}</Td>
                        <Td>{item?.summary?.totalUnSettleAmount}</Td>
                        <Td>{item?.summary?.riderEarning}</Td>
                        <Td>{item?.summary.totalCashInHand}</Td>
                        <Td>{item?.summary.totalCashReceived}</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
              {loading && (
                <div className="text-center">
                  <CircularLoader />
                </div>
              )}
              {!loading && deliveryTrxs.length < 1 && (
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
                  lisener={(page) => dispatch(getDeliveryTrx(true, page))}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default DeliveryTransactions;
