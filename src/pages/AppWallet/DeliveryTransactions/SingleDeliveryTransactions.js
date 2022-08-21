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
          value: Number.isNaN(
            parseInt(trxs?.deliveryBoy?.orderValue?.deliveryFee) -
              parseInt(trxs?.deliveryBoy?.deliveyBoyEarning)
          )
            ? 0
            : parseInt(trxs?.deliveryBoy?.orderValue?.deliveryFee) -
              parseInt(trxs?.deliveryBoy?.deliveyBoyEarning),
        },

        {
          title: "Unsetlled Amount",
          value: trxs?.deliveryBoy?.totalUnSettleAmount,
        },
        {
          title: "Rider Earning",
          value: trxs?.deliveryBoy?.deliveyBoyEarning,
        },
        {
          title: "Total Profit",
          value:
            parseInt(trxs?.deliveryBoy?.totalUnSettleAmount) +
            parseInt(trxs?.deliveryBoy?.deliveyBoyEarning),
        },
        { title: "Cash In Hand", value: trxs?.deliveryBoy?.cashInHand },
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

            <Card>
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
                      Received Payment
                    </Button>
                    <Button
                      className="btn btn-info ms-4"
                      onClick={() => setIsMakePayment(!isMakePayment)}
                    >
                      {" "}
                      Make Payment{" "}
                    </Button>
                  </div>
                </div>

                <TransactionsTable
                  trxs={trxs?.transections}
                  loading={loading}
                />
              </CardBody>
            </Card>
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
