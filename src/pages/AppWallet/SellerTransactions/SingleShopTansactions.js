import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  Row,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Info from "../../../components/Info";
import TransactionsCard from "../../../components/TransactionsCard";

import { TextField, Tooltip } from "@mui/material";
import {
  adjustShopCash,
  getShopTrxs,
  shopMakePayment,
} from "../../../store/appWallet/appWalletAction";
import AppPagination from "../../../components/AppPagination";
import styled from "styled-components";
import { successMsg } from "../../../helpers/successMsg";
import MakePayment from "../../../components/MakePayment";
import AddRemoveCredit from "../../../components/AddRemoveCredit";
import TransactionsTable from "../../../components/TransactionsTable";
import SweetAlert from "react-bootstrap-sweetalert";

const SingleShopTransactions = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const {
    loading,
    shopTrxs,
    paging,
    hasNextPage,
    currentPage,
    hasPreviousPage,
    status,
  } = useSelector((state) => state.appWalletReducer);

  const [shopName, setShopName] = useState("");
  const [summary, setSummary] = useState([]);
  const [isMakePayment, setIsMakePayment] = useState(false);
  const [openCreditModal, setOpenCreditModal] = useState(false);
  const [shopId, setShopId] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState("");
  const [dynamic_description, setdynamic_description] = useState("");
  const [error_dlg, seterror_dlg] = useState(false);

  const { shopName: name, _id: accountId } = JSON.parse(
    localStorage.getItem("admin")
  );

  useEffect(() => {
    if (searchParams.get("shopId") || accountId) {
      console.log("call");
      searchParams.get("shopName")
        ? setShopName(searchParams.get("shopName"))
        : setShopName(name);
      let id = null;
      searchParams.get("shopId")
        ? (id = searchParams.get("shopId"))
        : (id = accountId);
      if (id) {
        callTransList(true, id);
        setShopId(id);
      }
    } else {
      history.push("/", { replace: true });
    }
  }, [searchParams, accountId]);

  // CALL API TO GET SELLER TRANSACTIONS

  const callTransList = (refresh = false, IdOfShop) => {
    dispatch(getShopTrxs(refresh, IdOfShop));
  };

  // SUMMARY

  useEffect(() => {
    const summaryList = [
      { title: "Drop Earning", value: shopTrxs?.shop?.dropGetFromShop ?? 0 },

      {
        title: "Unsetlled Amount",
        value: shopTrxs?.shop?.totalShopUnsettle,
      },
      {
        title: "Shop Earning",
        value: shopTrxs?.shop?.totalShopEarning,
      },
      {
        title: "Total Profit",
        value: Number.isNaN(
          parseInt(shopTrxs?.shop?.totalShopUnsettle) +
            parseInt(shopTrxs?.shop?.orderValue?.deliveryFee)
        )
          ? 0
          : parseInt(shopTrxs?.shop?.totalShopUnsettle) +
            parseInt(shopTrxs?.shop?.orderValue?.deliveryFee),
      },
      { title: "Cash In Hand", value: shopTrxs?.shop?.cashInHand },
    ];
    setSummary(summaryList);
  }, [shopTrxs]);

  useEffect(() => {
    if (status) {
      setIsMakePayment(false);
      setOpenCreditModal(false);
      callTransList(true, shopId);
    }
  }, [status]);

  const adjustCashInHandAmount = () => {
    if (shopTrxs?.shop?.cashInHand <= 0) {
      setconfirm_alert(false);
      seterror_dlg(true);
      setdynamic_title("Error");
      setdynamic_description("Cash in hand is 0");
    } else {
      dispatch(adjustShopCash(shopId));
      setconfirm_alert(false);
      setsuccess_dlg(true);
      setdynamic_title("Success");
      setdynamic_description("Successfully adjust hand cash");
    }
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            {success_dlg ? (
              <SweetAlert
                success
                title={dynamic_title}
                onConfirm={() => {
                  setsuccess_dlg(false);
                }}
              >
                {dynamic_description}
              </SweetAlert>
            ) : error_dlg ? (
              <SweetAlert
                error
                title={dynamic_title}
                onConfirm={() => {
                  seterror_dlg(false);
                }}
              >
                {dynamic_description}
              </SweetAlert>
            ) : null}

            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={shopName}
              title="App Wallet"
              callList={callTransList}
              loading={loading}
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
                  <CardTitle className="h4"> Shop Transactions List</CardTitle>
                  <div>
                    <Button
                      className="btn btn-success"
                      onClick={() => setOpenCreditModal(!openCreditModal)}
                    >
                      Add/Remove Credit
                    </Button>
                    <Button
                      className="btn btn-info ms-4"
                      onClick={() => setIsMakePayment(!isMakePayment)}
                    >
                      Make Payment
                    </Button>
                    <Button
                      className="btn btn-danger ms-4"
                      onClick={() => {
                        setconfirm_alert(true);
                      }}
                    >
                      Adjust Hand Cash
                    </Button>
                  </div>
                </div>

                <TransactionsTable trxs={shopTrxs?.trxs} loading={loading} />
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
                    lisener={(page) =>
                      dispatch(getShopTrxs(true, shopId, page))
                    }
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>

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
              unSettleAmount={shopTrxs?.shop?.totalShopUnsettle}
              id={shopTrxs?.shop?._id}
              userType="shop"
            />
          </div>
        </Modal>

        {/* ADD AND REMOVE CREDIT  */}

        <Modal
          isOpen={openCreditModal}
          toggle={() => {
            setOpenCreditModal(!openCreditModal);
          }}
          centered={true}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Add / Remove Credit</h5>
            <button
              type="button"
              onClick={() => {
                setOpenCreditModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <AddRemoveCredit
              userType="shop"
              id={shopTrxs?.shop?._id}
              dropAmount={shopTrxs?.shop?.dropGetFromShop}
              userAmount={shopTrxs?.shop?.totalShopEarning}
            />
          </div>
        </Modal>

        {confirm_alert ? (
          <SweetAlert
            title="Are you sure?"
            warning
            showCancel
            confirmButtonText="Yes, delete it!"
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            // onConfirm={() => {

            //   setconfirm_alert(false);
            //   setsuccess_dlg(true);
            //   setdynamic_title("Deleted");
            //   setdynamic_description("Your file has been deleted.");
            // }}
            onConfirm={() => adjustCashInHandAmount()}
            onCancel={() => setconfirm_alert(false)}
          ></SweetAlert>
        ) : null}
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default SingleShopTransactions;
