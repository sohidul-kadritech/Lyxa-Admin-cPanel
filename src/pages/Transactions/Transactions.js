import React, { useEffect } from "react";
import GlobalWrapper from "../../components/GlobalWrapper";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { Tooltip } from "@mui/material";
import { Button, Card, CardBody, CardTitle, Col, Container, Row, Spinner } from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { accountsOptions, sortByOptions } from "../../assets/staticData";
import Search from "../../components/Search";
import {
  getAllTransctions,
  updateAllTrxAccountType,
  updateAllTrxSearchKey,
  updateAllTrxSortByKey,
} from "../../store/appWallet/appWalletAction";
import { useDispatch, useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import AppPagination from "../../components/AppPagination";
import { useHistory } from "react-router-dom";
import { successMsg } from "../../helpers/successMsg";

const TypeInfo = ({ type, linkItem, route }) => {
  const history = useHistory();
  return (
    <span className="link" onClick={() => history.push(route)}>
      {`${type} ${linkItem}`}
    </span>
  );
};

const Transactions = () => {
  const dispatch = useDispatch();
  const history = useHistory();
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

  useEffect(() => {
    if (trxSortByKey || trxSearchKey || trxAccountType) {
      callTransList(true);
    }
    return;
  }, [trxSortByKey, trxSearchKey, trxAccountType]);
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();

  const callTransList = (refresh = false) => {
    dispatch(getAllTransctions(refresh));
  };

  // GENERATE PDF

  const downloadPdf = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = `Transactions`;
    const headers = [["ID", "Amount", "Type", "Payment Method", "Date"]];
    const marginLeft = 40;

    const data = allTrxs.map((trx) => [
      trx._id,
      trx.amount,

      updateTrxType(trx),
      trx?.paymentType,
      new Date(trx?.createdAt).toLocaleDateString(),
    ]);

    let content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(`Transactions.pdf`);
  };

  const updateTrxType = (trx) => {
    // return type.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
    let newType = null;

    let shopRoute = trx.shop ? `/shops/details/${trx?.shop?._id}` : null;
    let sellerRoute = trx?.seller ? `/seller/details/${trx?.seller?._id}` : null;
    let riderRoute = trx?.deliveryBoy ? `/deliveryman/details/${trx?.deliveryBoy?._id}` : null;
    let orderRoute = trx?.order ? `/orders/details/${trx?.order}` : null;
    let userRoute = trx?.user ? `/users/details/${trx?.user?._id}` : null;

    //  const Details = ({data}) =>{
    //     return(

    //     )
    //  }

    const { type } = trx;

    if (trx?.order) {
      newType = <TypeInfo type="Order" linkItem={trx?.order.autoGenId} route={orderRoute} />;
    } else {
      newType = "on going";
    }

    // if (
    //   type === "adminSettlebalanceShop" ||
    //   type === "adminAddBalanceShop" ||
    //   type === "adminRemoveBalanceShop" ||
    //   type === "shopCashInHand" ||
    //   type === "shopCashInHandRemove" ||
    //   type === "unSettleAmountRemove" ||
    //   type === "shopProfileRemoveCash"
    // ) {
    //   newType = (
    //     <p>
    //       Shop <User name={trx?.shop?.shopName} route={shopRoute} />
    //       {`${
    //         type === "adminSettlebalanceShop"
    //           ? "Settle"
    //           : type === "adminAddBalanceShop"
    //           ? "Add"
    //           : type === "adminRemoveBalanceShop"
    //           ? "Remove"
    //           : type === "shopCashInHandRemove"
    //           ? "Remove Cash In Hand"
    //           : type === "unSettleAmountRemove"
    //           ? "Remove Unsettle Amount"
    //           : type === "shopProfileRemoveCash"
    //           ? "Remove Cash"
    //           : ""
    //       }`}{" "}
    //       {trx?.amount}{" "}
    //       {trx?.order
    //         ? `- Order ${(<User name={`#${trx?.order}`} route={orderRoute} />)}`
    //         : ""}
    //     </p>
    //   );
    // } else if (type === "sellerCashInHandAdjust") {
    //   newType = (
    //     <p>
    //       Seller <User name={trx?.seller?.name} route={sellerRoute} />
    //       Adjust Hand Cash {trx?.amount} - By Lyxa
    //     </p>
    //   );
    // } else if (type === "sellerOrderCancel") {
    //   newType = (
    //     <p>
    //       Seller <User name={trx?.seller?.name} route={sellerRoute} /> - Cancel
    //       Order <User name={`#${trx?.order}`} route={orderRoute} />
    //     </p>
    //   );
    // } else if (
    //   type === "deliveryBoyAmountSettle" ||
    //   type === "deliveryBoyAdminAmountReceivedCash"
    // ) {
    //   newType = (
    //     <p>
    //       Rider <User name={trx?.deliveryBoy?.name} route={riderRoute} />
    //       {`${
    //         type === "deliveryBoyAdminAmountReceivedCash"
    //           ? "Received Cash"
    //           : "Settle"
    //       }`}{" "}
    //       {trx?.amount} - Order{" "}
    //       <User name={`#${trx?.order}`} route={orderRoute} />
    //     </p>
    //   );
    // } else if (
    //   type === "adminGetPercentageFromOrder" ||
    //   type === "DropGetFromOrder" ||
    //   type === "dropGetPercentage" ||
    //   type === "dropRemovePercentage"
    // ) {
    //   newType = (
    //     <p>
    //       Lyxa {`${type === "dropRemovePercentage" ? "Remove" : "Get"}`}{" "}
    //       {trx?.amount}{" "}
    //       {`${
    //         type === "dropGetPercentage" || type === "dropRemovePercentage"
    //           ? "%"
    //           : ""
    //       }`}{" "}
    //       - Order <User name={`#${trx?.order}`} route={orderRoute} />
    //     </p>
    //   );
    // } else if (
    //   type === "sellerGetPaymentFromOrder" ||
    //   type === "sellerGetPaymentFromOrderCash"
    // ) {
    //   newType = (
    //     <p>
    //       Seller <User name={trx?.seller?.name} route={sellerRoute} />
    //       Cut {trx?.amount} -{" "}
    //       {`${type === "sellerGetPaymentFromOrderCash" ? "Cash" : ""}`} Order{" "}
    //       <User name={`#${trx?.order}`} route={orderRoute} />
    //     </p>
    //   );
    // } else if (type === "adminWillGetPaymentFromShop") {
    //   newType = (
    //     <p>
    //       Lyxa Get {trx?.amount} - From
    //       <User name={trx?.shop?.shopName} route={shopRoute} />
    //     </p>
    //   );
    // } else if (
    //   type === "userTopUpBalance" ||
    //   type === "userBalanceAddAdmin" ||
    //   type === "userBalanceWithdrawAdmin"
    // ) {
    //   newType = (
    //     <p>
    //       User
    //       <User name={trx?.user?.name} route={userRoute} />
    //       {`${
    //         type === "userTopUpBalance"
    //           ? "Topup "
    //           : type === "userBalanceAddAdmin"
    //           ? "Add "
    //           : "Withdraw "
    //       }`}{" "}
    //       {trx?.amount}- By Lyxa{" "}
    //     </p>
    //   );
    // } else if (
    //   type === "deliveryBoyOrderDelivered" ||
    //   type === "deliveryBoyOrderDeliveredCash" ||
    //   type === "deliveryBoyOrderDeliveredCashPos"
    // ) {
    //   newType = (
    //     <p>
    //       Rider <User name={trx?.deliveryBoy?.name} route={riderRoute} />
    //       Cut {trx?.amount} -{" "}
    //       {`${
    //         type === "deliveryBoyOrderDeliveredCash"
    //           ? "Cash"
    //           : type === "deliveryBoyOrderDeliveredCashPos"
    //           ? "Cash(Pos)"
    //           : ""
    //       }`}{" "}
    //       Order <User name={`#${trx?.order}`} route={orderRoute} />
    //     </p>
    //   );
    // } else if (
    //   type === "userPayForOrder" ||
    //   type === "userPayBeforeReceivedOrderByWallet" ||
    //   type === "userCancelOrderGetWallet"
    // ) {
    //   newType = (
    //     <p>
    //       User <User name={trx?.user?.name} route={userRoute} />
    //       {`${
    //         type === "userPayBeforeReceivedOrderByWallet"
    //           ? "Pay By Wallet"
    //           : type === "userCancelOrderGetWallet"
    //           ? "Get"
    //           : "Pay"
    //       }`}{" "}
    //       {trx?.amount} -{" "}
    //       {`${type === "userCancelOrderGetWallet" ? "Cancel" : ""}`} Order{" "}
    //       <User name={`#${trx?.order}`} route={orderRoute} />
    //     </p>
    //   );
    // } else if (type === "deliveryBoyOrderCancel") {
    //   newType = (
    //     <p>
    //       Rider <User name={trx?.deliveryBoy?.name} route={riderRoute} /> -
    //       Cancel Order
    //       <User name={`#${trx?.order}`} route={orderRoute} />
    //     </p>
    //   );
    // } else {
    //   newType = "N/A";
    // }

    return newType;
    //   [

    //     'cashInHandRemoveCancel',

    // ],
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
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
                  <Button outline={true} color="success" onClick={() => downloadPdf()}>
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
                  <Tbody style={{ position: "relative" }}>
                    {allTrxs?.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle cursor-pointer"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th style={{ textAlign: "left" }} title="Click to see details">
                            {item?.autoGenId}
                          </Th>

                          {/* <Td >{item?.amount}</Td> */}
                          <Td
                            className={
                              item?.type === "userBalanceWithdrawAdmin" ||
                              item?.type === "adminAddBalanceShop" ||
                              item?.type === "userPayAfterReceivedOrder" ||
                              item?.type === "userPayBeforeReceivedOrderByWallet" ||
                              item?.type === "userPayForOrder" ||
                              item?.type === "deliveryBoyAdminAmountReceivedCash" ||
                              item?.type === "sellerGetPaymentFromOrderCash"
                                ? "active-status"
                                : item?.type === "userBalanceAddAdmin" ||
                                  item?.type === "adminRemoveBalanceShop" ||
                                  item?.type === "userCancelOrderGetWallet" ||
                                  item?.type === "sellerOrderCancel" ||
                                  item?.type === "shopProfileRemoveCash"
                                ? "inactive-status"
                                : ""
                            }
                          >{`${
                            item?.type === "userBalanceWithdrawAdmin" ||
                            item?.type === "adminAddBalanceShop" ||
                            item?.type === "userPayAfterReceivedOrder" ||
                            item?.type === "userPayBeforeReceivedOrderByWallet" ||
                            item?.type === "userPayForOrder" ||
                            item?.type === "deliveryBoyAdminAmountReceivedCash" ||
                            item?.type === "sellerGetPaymentFromOrderCash"
                              ? "+"
                              : item?.type === "userBalanceAddAdmin" ||
                                item?.type === "adminRemoveBalanceShop" ||
                                item?.type === "userCancelOrderGetWallet" ||
                                item?.type === "sellerOrderCancel" ||
                                item?.type === "shopProfileRemoveCash"
                              ? "-"
                              : ""
                          }${item?.amount}`}</Td>
                          {/*  */}
                          <Td>{updateTrxType(item)}</Td>
                          <Td className="text-capitalize">{item?.paymentMethod ?? "Admin"}</Td>
                          <Td>{new Date(item?.createdAt).toLocaleDateString()}</Td>
                        </Tr>
                      );
                    })}
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
    </React.Fragment>
  );
};

export default Transactions;
