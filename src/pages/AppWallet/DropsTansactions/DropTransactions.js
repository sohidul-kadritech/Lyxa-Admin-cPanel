import { Tooltip } from '@mui/material';
import React, { useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Card, CardBody, CardTitle, Col, Container, Row, Spinner } from 'reactstrap';
import AppPagination from '../../../components/AppPagination';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import TransactionsCard from '../../../components/TransactionsCard';
import { useGlobalContext } from '../../../context';
import {
  getDropTrx,
  updateDeliveryTrxEndDate,
  updateDeliveryTrxStartDate,
} from '../../../store/appWallet/appWalletAction';

function DropTransactions() {
  const history = useHistory();
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();

  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const { loading, dropTrxs, dropTrxStartDate, dropTrxEndDate, paging, hasNextPage, currentPage, hasPreviousPage } =
    useSelector((state) => state.appWalletReducer);

  const dispatch = useDispatch();

  const callTransList = (refresh = false) => {
    dispatch(getDropTrx(refresh));
  };

  useEffect(() => {
    if (dropTrxStartDate || dropTrxEndDate) {
      callTransList(true);
    }
  }, [dropTrxStartDate, dropTrxEndDate]);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem=" Lyxa Transactions"
            title="App Wallet"
            loading={loading}
            callList={callTransList}
          />

          <div>
            <TransactionsCard />
          </div>

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
                        placeholder="Start Date"
                        value={dropTrxStartDate}
                        onChange={(selectedDates, dateStr) => dispatch(updateDeliveryTrxStartDate(dateStr))}
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
                        value={dropTrxEndDate}
                        onChange={(selectedDates, dateStr) => dispatch(updateDeliveryTrxEndDate(dateStr))}
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
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Row className="mb-3">
                <Col md={3} className="text-end" />
              </Row>
              <CardTitle className="h4"> Admin Transactions List</CardTitle>
              <Table
                id="tech-companies-1"
                className="table table__wrapper table-striped table-bordered table-hover text-center"
              >
                <Thead>
                  <Tr>
                    <Th>Payment status</Th>
                    <Th>Amount ({currency})</Th>
                    <Th>Status</Th>
                    <Th>admin Note</Th>
                    <Th>User Note</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}>
                  {dropTrxs.map((item) => (
                    <Tr
                      key={item._id}
                      className="align-middle"
                      style={{
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      <Th>{item?.paymentMethod}</Th>

                      <Td>{item?.amount}</Td>
                      <Td>{item?.status}</Td>
                      <Td style={{ maxWidth: '150px' }}>{item?.adminNote}</Td>
                      <Td style={{ maxWidth: '150px' }}>{item?.userNote}</Td>
                      <Td>
                        <Tooltip title="Details">
                          <button
                            type="button"
                            className="btn btn-info button"
                            onClick={() => history.push(`/add-wallet/drop-transactions/details/${item._id}`)}
                          >
                            <i className="fa fa-eye" />
                          </button>
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {loading && (
                <div className="text-center">
                  <Spinner animation="border" variant="success" />
                </div>
              )}
              {!loading && dropTrxs.length < 1 && (
                <div className="text-center">
                  <h4>No Order!</h4>
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
                  lisener={(page) => dispatch(getDropTrx(true, page))}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default DropTransactions;
