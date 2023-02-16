import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Button, Card, CardBody, CardTitle, Col, Container, Label, Modal, Row, Spinner } from 'reactstrap';
import earningFlowIcon from '../../assets/images/dashboard/earning-flow.png';
import moneyExchangeIcon from '../../assets/images/dashboard/money-exchange.png';
import { shopTrxsAmountFilterOptions, sortByOptions } from '../../assets/staticData';
import AppPagination from '../../components/AppPagination';
import Breadcrumb from '../../components/Common/Breadcrumb';
import GlobalWrapper from '../../components/GlobalWrapper';
import TopSummery from '../../components/TopSummery';
import { successMsg } from '../../helpers/successMsg';
import { getAllAdmin } from '../../store/AdminControl/Admin/adminAction';
import { getAllVatInfo, settleVat } from '../../store/vat/vatActions';

function SingleShopTransactions() {
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const { shopName: name, _id: accountId, account_type } = useSelector((store) => store.Login.admin);
  const {
    summary: vatSummary,
    transactions,
    pagination,
    currentPage,
    loading,
    status,
  } = useSelector((store) => store.vatReducer);
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();
  const { admins } = useSelector((state) => state.adminReducer);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'));
  const [sortingOrder, setSortingOrder] = useState({ label: 'Asc', value: 'asc' });
  const [amountRange, setAmountRange] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [allAdminOptions, setAllAdminOptions] = useState([]);
  const [adminBy, setAdminBy] = useState(accountId);
  const [amountRangeType, setAmountRangeType] = useState('');
  const [settleAmount, setSettleAmount] = useState(0);
  const [summary, setSummary] = useState({});

  // summary list
  const summaryList = [
    {
      title: 'Unsettled VAT',
      value: `${(summary?.totalUnsettleVat || 0).toFixed(2)} ${currency}`,
      icon: earningFlowIcon,
      iconBg: '#0008C1',
    },
    {
      title: 'Total VAT',
      value: `${(summary?.totalVat || 0).toFixed(2)} ${currency}`,
      icon: moneyExchangeIcon,
      iconBg: '#0c9da4',
    },
  ];

  // get all transations
  const callApi = async () => {
    const reqBody = {};
    reqBody.tnxFilter = {
      adminBy: adminBy.value,
      type: ['VatAmountSettleByAdmin'],
      searchKey,
      amountBy: sortingOrder.value,
      amountRange: amountRange || 0,
      amountRangeType: amountRangeType.value,
      startDate,
      endDate,
    };

    dispatch(getAllVatInfo(reqBody, account_type, accountId));
  };

  // open modal
  const openModal = () => {
    setIsModalOpen(true);
    setSettleAmount(summary?.totalUnsettleVat);
  };

  // pay vat
  const payVat = () => {
    if (settleAmount < 1) {
      successMsg('Please enter valid amount', 'error');
      return;
    }
    if (settleAmount > summary.totalUnsettleVat) {
      successMsg('Can not pay more than unsettled amount', 'error');
      return;
    }

    const reqBody = {
      amount: settleAmount,
      startDate,
      endDate,
    };

    dispatch(settleVat(reqBody, account_type));
  };

  // refetch data on filter
  useEffect(() => {
    callApi();
  }, [adminBy, searchKey, sortingOrder, amountRange, startDate, endDate, amountRangeType]);

  // format summary for shop
  useEffect(() => {
    if (account_type === 'shop') {
      setSummary({ totalUnsettleVat: vatSummary?.totalUnsettleVatForShop, totalVat: vatSummary?.totalVatForShop });
    } else {
      setSummary(vatSummary);
    }
  }, [vatSummary]);

  // get all admin
  useEffect(() => {
    if (admins?.length > 0) {
      setAllAdminOptions(admins.map((item) => ({ label: item.name, value: item._id })));
    }
  }, [admins]);

  // get all transactions
  useEffect(() => {
    if (status) {
      callApi();
      dispatch(getAllAdmin(true));
      setIsModalOpen(false);
    }
  }, [status]);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" title="Vat" callList={callApi} loading={loading} />
          <Card>
            <CardBody>
              <Row>
                <Col lg={4}>
                  <div className="w-100">
                    <label>Start Date</label>
                    <div className="form-group mb-0 w-100">
                      <Flatpickr
                        className="form-control d-block"
                        id="startDate"
                        placeholder="Select Start Date"
                        value={startDate}
                        onChange={(selectedDates, dateStr) => setStartDate(dateStr)}
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
                  <div className="w-100">
                    <label>End Date</label>
                    <div className="form-group mb-0">
                      <Flatpickr
                        className="form-control w-100"
                        id="endDate"
                        placeholder="Select End Date"
                        value={endDate}
                        onChange={(selectedDates, dateStr) => setEndDate(dateStr)}
                        options={{
                          altInput: true,
                          altFormat: 'F j, Y',
                          dateFormat: 'Y-m-d',
                        }}
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={4} className={`${account_type !== 'admin' ? 'd-none' : ''}`}>
                  <div>
                    <label className="control-label">Admin By</label>
                    <Select
                      palceholder="Select Type"
                      options={allAdminOptions}
                      classNamePrefix="select2-selection"
                      required
                      value={adminBy}
                      onChange={(e) => setAdminBy(e)}
                    />
                  </div>
                </Col>
                <Col lg={4} className="mt-3 mt-lg-0">
                  <div>
                    <label className="control-label">Amount Order By</label>
                    <Select
                      palceholder="Select Order By"
                      options={sortByOptions}
                      classNamePrefix="select2-selection"
                      required
                      value={sortingOrder}
                      onChange={(e) => setSortingOrder(e)}
                    />
                  </div>
                </Col>
                <Col lg={4} className="mt-3 ">
                  <div>
                    <Label>Search</Label>
                    <input
                      placeholder="Search by id"
                      className="form-control"
                      type="text"
                      value={searchKey}
                      onChange={(e) => setSearchKey(e.target.value)}
                    />
                  </div>
                </Col>
                <Col lg={4} className="mt-3 ">
                  <div>
                    <Label>Amount Range</Label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="Enter a amount "
                      value={amountRange}
                      onChange={(e) => setAmountRange(e.target.value)}
                    />
                  </div>
                </Col>
                <Col lg={4} className={`mt-3 ${amountRange > 0 ? '' : 'd-none'}`}>
                  <div>
                    <Label>Amount Filter Type</Label>
                    <Select
                      palceholder="Select Order By"
                      options={shopTrxsAmountFilterOptions}
                      classNamePrefix="select2-selection"
                      required
                      value={amountRangeType}
                      onChange={(e) => setAmountRangeType(e)}
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <TopSummery fromSingleShop fromWallet data={summaryList} />
          <Card>
            <CardBody>
              <Row className="mb-3">
                <Col md={3} className="text-end" />
              </Row>
              <div className="d-flex justify-content-between pb-3">
                <CardTitle className="h4"> Shop Transactions List</CardTitle>
                <div>
                  <Button className="btn btn-info ms-4" onClick={() => openModal()}>
                    Pay VAT
                  </Button>
                </div>
              </div>
              <Table id="tech-companies-1" className="table  table-hover text-center">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Amount ({currency})</Th>
                    <Th>Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions?.map((item) => (
                    <Tr key={item?._id}>
                      <Td>{item?._id}</Td>
                      <Td>{item?.amount}</Td>
                      <Td>{moment(item?.date).format('YYYY-MM-DD')}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {loading && (
                <div className="text-center">
                  <Spinner animation="border" color="success" />
                </div>
              )}
              {!loading && !transactions.length && (
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
                  paging={pagination.paging}
                  hasNextPage={pagination.hasNextPage}
                  hasPreviousPage={pagination.hasPreviousPage}
                  currentPage={currentPage}
                  lisener={() => {}}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {/* Vat  payment */}
      <Modal
        isOpen={isModalOpen}
        centered
        toggle={() => {
          setIsModalOpen(!isModalOpen);
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Pay Vat</h5>
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <Row>
            <Col lg={12}>
              <input
                placeholder="Amount to settle"
                className="form-control"
                type="number"
                value={settleAmount}
                onChange={(e) => setSettleAmount(e.target.value)}
                min={0}
                max={summary.totalUnsettleVat}
              />
            </Col>
            <Col lg={12}>
              <p className="d-flex items-center justify-content-between mt-4 mb-1">
                <span>Total Unsettled Amount</span>
                <span>
                  {summary.totalVat} {currency}
                </span>
              </p>
              <p className="d-flex items-center justify-content-between mb-1">
                <span>Vat to settle</span>
                <span>
                  - {settleAmount || 0} {currency}
                </span>
              </p>
              <hr />
              <p className="d-flex items-center justify-content-between mb-1">
                <span>Unsettled amount left</span>
                <span>
                  {summary.totalUnsettleVat - settleAmount} {currency}
                </span>
              </p>
            </Col>
          </Row>
          <div className="mt-3 d-flex justify-content-end">
            <Button type="submit" color="success" disabled={loading} onClick={payVat}>
              {loading ? 'Paying..' : 'Pay'}
            </Button>
          </div>
        </div>
      </Modal>
    </GlobalWrapper>
  );
}

export default SingleShopTransactions;
