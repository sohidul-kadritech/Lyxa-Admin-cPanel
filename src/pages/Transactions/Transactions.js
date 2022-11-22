import React, { useEffect } from "react";
import GlobalWrapper from "../../components/GlobalWrapper";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { Tooltip } from "@mui/material";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
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

      updateTrxType(trx?.type),
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

  const updateTrxType = (type) => {
    return type.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
    // let newType = "";

    // if (type === "adminSettlebalanceShop") {
    //   newType = "Settle shop";
    // } else if (type === "adminAddBalanceShop") {
    //   newType = "Add shop credit";
    // } else if (type === "sellerCashInHandAdjust") {
    //   newType = "Adjust hand cash";
    // } else if (type === "adminRemoveBalanceShop") {
    //   newType = "Remove shop credit";
    // } else if (type === "deliveryBoyAmountSettle") {
    //   newType = "Settle rider";
    // } else if (type === "deliveryBoyAdminAmountReceivedCash") {
    //   newType = "Received rider cash";
    // } else if (
    //   type === "adminGetPercentageFromOrder" ||
    //   type === "deliveryBoyOrderDeliveredCash" ||
    //   type === "sellerGetPaymentFromOrder" ||
    //   type === "sellerGetPaymentFromOrderCash" ||
    //   type === "adminWillGetPaymentFromShop"
    // ) {
    //   newType = "Order";
    // } else if (type === "userTopUpBalance") {
    //   newType = "Drop pay";
    // } else if (type === "userBalanceAddAdmin") {
    //   newType = "User balance add by admin";
    // } else if (type === "userBalanceWithdrawAdmin") {
    //   newType = "User Balance Withraw By Admin";
    // } else if (type === "deliveryBoyOrderDelivered") {
    //   newType = "Delivery boy delivered order";
    // } else if (type === "DropGetFromOrder") {
    //   newType = "Drop get from order";
    // } else if (type === "userPayForOrder") {
    //   newType = "User pay for order";
    // } else if (type === "userPayBeforeReceivedOrderByWallet") {
    //   newType = "User pay before received order";
    // } else if (type === "unSettleAmountRemove") {
    //   newType = "Unsettle Amount Remove";
    // } else {
    //   newType = "";
    // }

    // return newType;
  };

  const goToDetails = (item) => {
    if (item?.order) {
      history.push(`/orders/details/${item?.order}`);
    } else if (item.user) {
      history.push(`/users/details/${item?.user?._id}`);
    } else {
      successMsg("No Details Found");
    }
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Transactions"
              loading={loading}
              callList={callTransList}
            />

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
                  <Button
                    outline={true}
                    color="success"
                    onClick={() => downloadPdf()}
                  >
                    Download PDF
                  </Button>
                </div>
                <hr />

                <Table
                  id="tech-companies-1"
                  className="table  table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Amount</Th>
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
                          onClick={() => goToDetails(item)}
                        >
                          <Th
                            style={{ textAlign: "left" }}
                            title="Click to see details"
                          >
                            {item?.autoGenId}
                          </Th>

                          <Td>{item?.amount}</Td>
                          {/*  */}
                          <Td>{updateTrxType(item?.type)}</Td>
                          <Td className="text-capitalize">
                            {item?.paymentMethod ?? "Admin"}
                          </Td>
                          <Td>
                            {new Date(item?.createdAt).toLocaleDateString()}
                          </Td>
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
