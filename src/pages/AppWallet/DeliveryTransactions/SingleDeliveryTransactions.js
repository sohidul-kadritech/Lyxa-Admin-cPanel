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
import Info from "../../../components/Info";
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
  const [openReceivedModal, setOpenReceivedModal] = useState(false);
  const [riderId, setRiderId] = useState(false);

  const { status } = useSelector((state) => state.appWalletReducer);

  useEffect(() => {
    if (id) {
      callApi(id);
      setRiderId(id);
    } else {
      history.push("/add-wallet/delivery-transactions", { replace: true });
    }
  }, [id]);

  const callApi = async (deiveryId, page = 1) => {
    setLoading(true);
    try {
      const { data } = await requestApi().request(SINGLE_DELIVERY_TRX, {
        params: {
          deliveryBoyId: deiveryId,
          page,
          pageSize: 50,
        },
      });

      if (data.status) {
        setLoading(false);
        setTrxs(data.data);
        console.log(data.data);
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

  useEffect(() => {
    if (status) {
      setIsMakePayment(false);
      setOpenReceivedModal(false);
      callApi(riderId);
    }
  }, [status]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Transactions List" {...a11yProps(0)} />
                  <Tab label="Cash order List" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <Card>
                  <CardBody>
                    <Row className="mb-3">
                      <Col md={3} className="text-end" />
                    </Row>
                    <div className="d-flex justify-content-between pb-3">
                      <CardTitle className="h4"> Transactions List</CardTitle>
                      <div>
                        {/* <Button
                          className="btn btn-success"
                          onClick={() =>
                            setOpenReceivedModal(!openReceivedModal)
                          }
                        >
                          Received Cash
                        </Button> */}
                        <Button
                          className="btn btn-info ms-4"
                          onClick={() => setIsMakePayment(!isMakePayment)}
                        >
                          {" "}
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
              <TabPanel value={value} index={1}>
                <Card>
                  <CardBody>
                    <Row className="mb-3">
                      <Col md={3} className="text-end" />
                    </Row>
                    <div className="d-flex justify-content-between pb-3">
                      <CardTitle className="h4"> Cash order list</CardTitle>
                      <div>
                        <Button
                          className="btn btn-success"
                          onClick={() =>
                            setOpenReceivedModal(!openReceivedModal)
                          }
                        >
                          Received Cash
                        </Button>
                        {/* <Button
                          className="btn btn-info ms-4"
                          onClick={() => setIsMakePayment(!isMakePayment)}
                        >
                          {" "}
                          Make Payment
                        </Button> */}
                      </div>
                    </div>

                    <TransactionsTable
                      trxs={trxs?.cashOrderList}
                      loading={loading}
                    />
                  </CardBody>
                </Card>
              </TabPanel>
            </Box>

            {/* <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <div className="d-flex justify-content-between pb-3">
                  <CardTitle className="h4">
                    {" "}
                    Delivery boy Transactions List
                  </CardTitle>
                  <div>
                    <Button
                      className="btn btn-success"
                      onClick={() => setOpenReceivedModal(!openReceivedModal)}
                    >
                      Received Cash
                    </Button>
                    <Button
                      className="btn btn-info ms-4"
                      onClick={() => setIsMakePayment(!isMakePayment)}
                    >
                      {" "}
                      Make Payment
                    </Button>
                  </div>
                </div>

                <TransactionsTable
                  trxs={trxs?.transections}
                  loading={loading}
                />
              </CardBody>
            </Card> */}
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
            unSettleAmount={trxs?.deliveryBoy?.totalUnSettleAmount}
            id={trxs?.deliveryBoy?._id}
            type="rider"
          />
        </div>
      </Modal>

      {/* RECEIVED PAYMENT */}

      <Modal
        isOpen={openReceivedModal}
        toggle={() => {
          setOpenReceivedModal(!openReceivedModal);
        }}
        centered={true}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Make Payment</h5>
          <button
            type="button"
            onClick={() => {
              setOpenReceivedModal(false);
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
            unSettleAmount={trxs?.deliveryBoy?.cashInHand}
            id={trxs?.deliveryBoy?._id}
            type="rider"
            receivedPayment={true}
          />
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default SingleDeliveryTransactions;
