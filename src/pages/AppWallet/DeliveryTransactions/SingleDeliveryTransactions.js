import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
  Modal,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Flatpickr from 'react-flatpickr';
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
import { riderReceivedPayment, updateRiderCashTrxEndDate, updateRiderCashTrxStartDate, updateRiderTrxEndDate, updateRiderTrxStartDate } from "../../../store/appWallet/appWalletAction";

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
  const [selected, setSelected] = useState(false);

  const { status, riderTrxEndDate, riderTrxStartDate, riderCashTrxStartDate, riderCashTrxEndDate } = useSelector((state) => state.appWalletReducer);

  useEffect(() => {
    if (id) {
      if (riderTrxEndDate || riderTrxStartDate || riderCashTrxStartDate || riderCashTrxEndDate) {
        callApi(id)
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

      } else {
        history.push("/add-wallet/delivery-transactions", { replace: true });
      }
    } catch (error) {
      history.push("/add-wallet/delivery-transactions", { replace: true });
    }
  };

  useEffect(() => {
    if (trxs) {
      const summaryList = [
        {
          title: "Drop Earning",
          value: trxs?.summary?.dropEarning,
        },

        {
          title: "Unsetlled Amount",
          value: trxs?.summary?.totalUnSettleAmount,
        },
        {
          title: "Rider Earning",
          value: trxs?.summary?.riderEarning,
        },
        {
          title: "Total Profit",
          value: trxs?.summary?.totalProfitRider,
        },
        { title: "Cash In Hand", value: trxs?.summary?.totalCashInHand },
      ];
      setSummary(summaryList);
    }
  }, [trxs]);

  const [tabItem, setTabItem] = useState(0);

  const handleChange = (event, newValue) => {
    setTabItem(newValue);
  };

  const cashReceived = (checked, trx) => {
    if (checked) {
      setSelected(checked);
      setSelectedCash([...selectedCash, trx]);
      setTotalSelectdAmount((prev) => prev + trx.amount);
    } else {
      let newList = selectedCash.filter((item) => item._id !== trx._id);
      setSelectedCash(newList);
      setTotalSelectdAmount((prev) => prev - trx.amount);
    }
  };

  //  RECEIVED CASH

  const receivedCashFromRider = () => {
    if (selectedCash.length === 0) {
      return successMsg("Select atleast one transactions");
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

  useEffect(() => {
    if (status) {
      setIsMakePayment(false);
      callApi(riderId);
      setSelectedCash([]);
      setTotalSelectdAmount(0);
      setSelected(false);
    }
  }, [status]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={trxs?.deliveryBoy?.name}
              title="App Wallet"
              isRefresh={false}
            />

            <div>
              <TransactionsCard summary={summary} />
            </div>

            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabItem}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
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
                              onChange={(selectedDates, dateStr, instance) =>
                                dispatch(updateRiderTrxEndDate(dateStr))
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

                    <div className="d-flex justify-content-between align-items-center pb-3">

                      <CardTitle className="h4"> Transactions List</CardTitle>



                      <div className="d-flex justify-content-end">
                        <Button
                          className="btn btn-info ms-4"
                          onClick={() => setIsMakePayment(!isMakePayment)}
                        >
                          Make Payment
                        </Button>
                      </div>

                    </div>

                    <TransactionsTable
                      trxs={trxs?.transections}
                      loading={loading}
                    />
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

                    <div className="d-flex justify-content-between pb-3 align-items-center">
                      <CardTitle className="h4"> Cash order list</CardTitle>
                      {totalSelectedAmount > 0 && (
                        <SummaryWrapper>
                          <div>
                            <span className="title">Total Amount: </span>
                            <span className="title">
                              {totalSelectedAmount} NGN
                            </span>
                          </div>
                        </SummaryWrapper>
                      )}
                      <div>
                        <Button
                          className="btn btn-success"
                          onClick={receivedCashFromRider}
                          disabled={loading || trxs?.cashOrderList.length < 1}
                        >
                          {loading ? "Receiving..." : "Received Cash"}
                        </Button>
                      </div>
                    </div>

                    <Table
                      id="tech-companies-1"
                      className="table table__wrapper table-striped table-bordered table-hover text-center"
                    >
                      <Thead>
                        <Tr>
                          <Th>ID</Th>
                          <Th>Amount</Th>
                          <Th>Transaction Type</Th>
                          <Th>Date</Th>
                          <Th>Select</Th>
                        </Tr>
                      </Thead>
                      <Tbody style={{ position: "relative" }}>
                        {trxs?.cashOrderList?.map((item, index) => (
                          <Tr
                            key={index}
                            className="align-middle table-data cursor-pointer"
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                            }}
                          >
                            <Th>{item?.autoTrxId}</Th>

                            <Td>{item?.amount}</Td>
                            <Td>{TrxType(item?.type)}</Td>
                            <Td>
                              {new Date(item?.createdAt).toLocaleDateString()}
                            </Td>
                            <Td>
                              <div className="form-check d-flex justify-content-center">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  // value={selected}
                                  // defaultValue={false}
                                  id="flexCheckDefault"
                                  onChange={(e) =>
                                    cashReceived(e.target.checked, item)
                                  }
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
          <MakePayment
            unSettleAmount={trxs?.summary?.totalUnSettleAmount}
            id={trxs?.deliveryBoy?._id}
            type="rider"
          />
        </div>
      </Modal>
    </React.Fragment>
  );
};

const SummaryWrapper = styled.div`
  padding: 10px 0px;

  .title {
    font-size: 15px;
    font-weight: 500;
    color: black;
  }
`;

export default SingleDeliveryTransactions;
