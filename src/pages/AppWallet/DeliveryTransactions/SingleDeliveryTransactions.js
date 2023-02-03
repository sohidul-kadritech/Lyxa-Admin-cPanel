import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Button, Card, CardBody, CardTitle, Col, Container, Row, Spinner, Modal } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Flatpickr from "react-flatpickr";
import TransactionsCard from "../../../components/TransactionsCard";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import requestApi from "../../../network/httpRequest";
import { DELIVERY_TRX, SINGLE_DELIVERY_TRX } from "../../../network/Api";
import AppPagination from "../../../components/AppPagination";
import TransactionsTable from "../../../components/TransactionsTable";
import MakePayment from "../../../components/MakePayment";
import PropTypes from "prop-types";
import { Box, Tab, Typography } from "@mui/material";
import { Tabs } from "@material-ui/core";
import styled from "styled-components";
import { TrxType } from "../../../components/updateTrxsType";
import { successMsg } from "../../../helpers/successMsg";
import {
  riderReceivedPayment,
  updateRiderCashTrxEndDate,
  updateRiderCashTrxStartDate,
  updateRiderTrxEndDate,
  updateRiderTrxStartDate,
} from "../../../store/appWallet/appWalletAction";
import earningFlowIcon from "../../../assets/images/dashboard/earning-flow.png";
import moneyExchangeIcon from "../../../assets/images/dashboard/money-exchange.png";
import deliveryIcon from "../../../assets/images/dashboard/delivery.png";
import orderAmountIcon from "../../../assets/images/dashboard/order-amount.png";
import profitFlowIcon from "../../../assets/images/dashboard/profit-flow.png";
import TopSummery from "../../../components/TopSummery";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const SingleDeliveryTransactions = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [trxs, setTrxs] = useState(null);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMakePayment, setIsMakePayment] = useState(false);
  const [riderId, setRiderId] = useState(false);
  const [selectedCash, setSelectedCash] = useState([]);
  const [totalSelectedAmount, setTotalSelectdAmount] = useState(0);
  const [cashOrders, setCashOrders] = useState([]);
  const [tabItem, setTabItem] = useState(0);

  const currency = useSelector(store => store.settingsReducer.appSettingsOptions.currency).toUpperCase();


  const {
    status,
    riderTrxEndDate,
    riderTrxStartDate,
    riderCashTrxStartDate,
    riderCashTrxEndDate,
    loading: isLoading,
  } = useSelector((state) => state.appWalletReducer);
  const { shopName: name, _id: accountId, account_type } = useSelector((store) => store.Login.admin);

  useEffect(() => {
    if (id) {
      if (riderTrxEndDate || riderTrxStartDate || riderCashTrxStartDate || riderCashTrxEndDate) {
        callApi(id);
      }
      setRiderId(id);
    } else {
      history.push("/add-wallet/delivery-transactions", { replace: true });
    }
  }, [id, riderTrxEndDate, riderTrxStartDate, riderCashTrxStartDate, riderCashTrxEndDate]);

  const callApi = async (deiveryId, page = 1) => {
    setLoading(true);
    try {
      const { data } = await requestApi().request(SINGLE_DELIVERY_TRX, {
        params: {
          deliveryBoyId: deiveryId,
          page,
          pageSize: 50,
          tstartDate: riderTrxStartDate,
          tendDate: riderTrxEndDate,
          cstartDate: riderCashTrxStartDate,
          cendDate: riderCashTrxEndDate,
        },
      });

      if (data.status) {
        setLoading(false);
        setTrxs(data.data);
        console.log(data.data);
        const { cashOrderList } = data.data;
        const list = cashOrderList.map((item) => ({
          ...item,
          selected: false,
        }));
        setCashOrders(list);
      } else {
        history.push("/add-wallet/delivery-transactions", { replace: true });
      }
    } catch (error) {
      history.push("/add-wallet/delivery-transactions", { replace: true });
    }
  };

  // SUMMARY LST
  useEffect(() => {
    if (trxs) {
      const summaryList = [
        {
          title: "Lyxa Earning",
          value: `${trxs?.summary?.dropEarning} ${currency}`,
          icon: earningFlowIcon,
          iconBg: "red",
        },

        {
          title: "Unsetlled Amount",
          value: `${trxs?.summary?.totalUnSettleAmount} ${currency}`,
          icon: moneyExchangeIcon,
          iconBg: "#0c9da4",
        },
        {
          title: "Rider Earning",
          value: `${trxs?.summary?.riderEarning} ${currency}`,
          icon: deliveryIcon,
          iconBg: "#00dcff",
        },
        {
          title: "Total Profit",
          value: `${trxs?.summary?.totalProfitRider} ${currency}`,
          icon: profitFlowIcon,
          iconBg: "#ff5ca7",
        },
        {
          title: "Cash In Hand",
          value: `${trxs?.summary?.totalCashInHand} ${currency}`,
          icon: orderAmountIcon,
          iconBg: "#56ca00",
        },
      ];

      setSummary(summaryList);
    }

    return () => {
      setSummary([]);
    };
  }, [trxs]);

  //  TAB CHANGE

  const handleChange = (event, newValue) => {
    setTabItem(newValue);
  };

  // SELECT CASH AMOUNT

  const handleSelectCash = (checked, trx) => {
    cashOrders?.map((item) => {
      if (item?._id === trx?._id) {
        item.selected = checked;
      }
      return item;
    });
    if (checked) {
      // setSelected(checked);
      setSelectedCash([...selectedCash, trx]);
      setTotalSelectdAmount((prev) => prev + trx.receivedAmount);
    } else {
      let newList = selectedCash.filter((item) => item._id !== trx._id);
      setSelectedCash(newList);
      setTotalSelectdAmount((prev) => prev - trx.receivedAmount);
    }
  };

  //  RECEIVED CASH

  const receivedCashFromRider = () => {
    if (selectedCash.length === 0) {
      return successMsg("Select at least one transactions");
    } else {
      const trxIds = selectedCash.map((item) => item._id);
      dispatch(
        riderReceivedPayment({
          deliveryBoyId: trxs?.deliveryBoy?._id,
          idList: trxIds,
        })
      );
    }
  };

  // SELECT ALL CASH FOR RECEIVED

  const selectAllReceivedCash = (checked) => {
    const list = cashOrders?.map((item) => ({
      ...item,
      selected: checked,
      disabled: checked,
    }));
    setCashOrders(list);
    setSelectedCash(checked ? cashOrders : []);
    const totalAmount = checked ? cashOrders.reduce((total, item) => item?.receivedAmount + total, 0) : 0;
    setTotalSelectdAmount(totalAmount);
  };

  useEffect(() => {
    if (status) {
      setIsMakePayment(false);
      callApi(riderId);
      setSelectedCash([]);
      setTotalSelectdAmount(0);
    }
    return;
  }, [status]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Lyxa"
              breadcrumbItem={trxs?.deliveryBoy?.name}
              title="App Wallet"
              isRefresh={false}
            />

            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabItem} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Transactions List" {...a11yProps(0)} />
                  <Tab label="Cash order List" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={tabItem} index={0}>
                <Card>
                  <CardBody>
                    <Col md={6}>
                      <div className="d-flex my-3 my-md-0 ">
                        <div className=" w-100">
                          <label>Start Date</label>
                          <div className="form-group mb-0 w-100">
                            <Flatpickr
                              className="form-control d-block"
                              id="startDate"
                              placeholder="Start Date"
                              value={riderTrxStartDate}
                              onChange={(selectedDates, dateStr, instance) =>
                                dispatch(updateRiderTrxStartDate(dateStr))
                              }
                              options={{
                                altInput: true,
                                altFormat: "F j, Y",
                                dateFormat: "Y-m-d",
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
                              value={riderTrxEndDate}
                              onChange={(selectedDates, dateStr, instance) => dispatch(updateRiderTrxEndDate(dateStr))}
                              options={{
                                altInput: true,
                                altFormat: "F j, Y",
                                dateFormat: "Y-m-d",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </CardBody>
                </Card>
                <div>
                  <TopSummery fromWallet={true} data={summary} />
                </div>
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-center pb-3">
                      <CardTitle className="h4"> Transactions List</CardTitle>

                      {account_type === "admin" && (
                        <div className="d-flex justify-content-end">
                          <Button
                            className="btn btn-info ms-4"
                            onClick={() => setIsMakePayment(!isMakePayment)}
                            // disabled={trxs?.summary?.totalUnSettleAmount === 0}
                          >
                            Make Payment
                          </Button>
                        </div>
                      )}
                    </div>

                    <TransactionsTable trxs={trxs?.transections} loading={loading} />
                  </CardBody>
                </Card>
              </TabPanel>
              <TabPanel value={tabItem} index={1}>
                <Card>
                  <CardBody>
                    <Col md={6}>
                      <div className="d-flex my-3 my-md-0 ">
                        <div className=" w-100">
                          <label>Start Date</label>
                          <div className="form-group mb-0 w-100">
                            <Flatpickr
                              className="form-control d-block"
                              id="startDate"
                              placeholder="Start Date"
                              value={riderCashTrxStartDate}
                              onChange={(selectedDates, dateStr, instance) =>
                                dispatch(updateRiderCashTrxStartDate(dateStr))
                              }
                              options={{
                                altInput: true,
                                altFormat: "F j, Y",
                                dateFormat: "Y-m-d",
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
                              value={riderCashTrxEndDate}
                              onChange={(selectedDates, dateStr, instance) =>
                                dispatch(updateRiderCashTrxEndDate(dateStr))
                              }
                              options={{
                                altInput: true,
                                altFormat: "F j, Y",
                                dateFormat: "Y-m-d",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-end pb-3 align-items-center">
                      {account_type === "admin" && (
                        <>
                          {totalSelectedAmount > 0 && (
                            <SummaryWrapper>
                              <span className="title">Total Amount: </span>
                              <span className="title">{`${totalSelectedAmount} ${currency}`}</span>
                            </SummaryWrapper>
                          )}
                          <div>
                            <Button
                              className="btn btn-success "
                              onClick={receivedCashFromRider}
                              disabled={isLoading || cashOrders.length < 1 || selectedCash.length < 1}
                            >
                              {isLoading ? "Receiving..." : "Receive Cash"}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>

                    <Table id="tech-companies-1" className="table  table-hover text-center">
                      <Thead>
                        <Tr>
                          <Th>Order ID</Th>
                          <Th>Amount</Th>
                          <Th>Transaction Type</Th>
                          <Th>Date</Th>
                          <Th className="d-flex justify-content-center align-items-center">
                            <span>Select </span>
                            <input
                              className="form-check-input cursor-pointer  mt-0 ms-2"
                              type="checkbox"
                              // checked={item?.selected ? true : false}
                              id="flexCheckDefault"
                              onChange={(e) => {
                                selectAllReceivedCash(e.target.checked);
                              }}
                              disabled={cashOrders?.length < 1}
                            />
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody style={{ position: "relative" }}>
                        {cashOrders?.map((item, index) => (
                          <Tr
                            key={index}
                            className="align-middle table-data cursor-pointer"
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                            }}
                          >
                            <Th>{item?.order?.orderId}</Th>

                            <Td>{item?.receivedAmount}</Td>
                            <Td>{TrxType(item?.type)}</Td>
                            <Td>{new Date(item?.createdAt).toLocaleDateString()}</Td>
                            <Td>
                              <div className="form-check d-flex justify-content-center">
                                <input
                                  className="form-check-input cursor-pointer  "
                                  type="checkbox"
                                  checked={item?.selected}
                                  id="flexCheckDefault"
                                  disabled={item?.disabled}
                                  onChange={(e) => {
                                    handleSelectCash(e.target.checked, item);
                                  }}
                                />
                              </div>
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
                    {!loading && trxs?.cashOrderList.length < 1 && (
                      <div className="text-center">
                        <h4>No Tansactions!</h4>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </TabPanel>
            </Box>

            <Row>
              <Col xl={12}>
                <div className="d-flex justify-content-center">
                  <AppPagination
                    paging={trxs?.paginate?.metadata?.paging}
                    hasNextPage={trxs?.paginate?.metadata?.hasNextPage}
                    hasPreviousPage={trxs?.paginate?.metadata?.hasPreviousPage}
                    currentPage={trxs?.paginate?.metadata?.currentPage}
                    lisener={(page) => callApi(id, page)}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>

      {/* MAKE PAYMENT */}

      <Modal
        isOpen={isMakePayment}
        toggle={() => {
          setIsMakePayment(!isMakePayment);
        }}
        centered={true}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Make Payment</h5>
          <button
            type="button"
            onClick={() => {
              setIsMakePayment(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <MakePayment unSettleAmount={trxs?.summary?.totalUnSettleAmount} id={trxs?.deliveryBoy?._id} type="rider" />
        </div>
      </Modal>
    </React.Fragment>
  );
};

const SummaryWrapper = styled.div`
  padding: 10px 0px;
  margin-right: 30px;
  .title {
    font-size: 15px;
    font-weight: 500;
    color: black;
  }
`;

export default SingleDeliveryTransactions;
