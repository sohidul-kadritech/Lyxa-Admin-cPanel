import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import TransactionsCard from "../../../components/TransactionsCard";
import Flatpickr from "react-flatpickr";
import { useDispatch, useSelector } from "react-redux";
import {
  getSellersTrx,
  updateSellerTrxEndDate,
  updateSellerTrxStartDate,
} from "../../../store/appWallet/appWalletAction";
import AppPagination from "../../../components/AppPagination";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Lightbox from "react-image-lightbox";
import { useHistory } from "react-router-dom";
import { Tooltip } from "@mui/material";

const SellerTransactions = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    loading,
    sellersTrxs,
    sellerTrxStartDate,
    sellerTrxEndDate,
    paging,
    hasNextPage,
    currentPage,
    hasPreviousPage,
  } = useSelector((state) => state.appWalletReducer);

  useEffect(() => {
    callTransList(true);
  }, []);

  const callTransList = (refresh = false) => {
    dispatch(getSellersTrx(refresh));
  };

  const sellerShopsTrxs = (sellerId, companyName) => {
    history.push({
      pathname: `/app-wallet/seller/shops-transactions/${sellerId}`,
      search: `?seller=${companyName}`,
    });
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Sellers Transactions"
              title="App Wallet"
              loading={loading}
              callList={callTransList}
            />

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
                          value={sellerTrxStartDate}
                          onChange={(selectedDates, dateStr, instance) =>
                            dispatch(updateSellerTrxStartDate(dateStr))
                          }
                          options={{
                            altInput: true,
                            altFormat: "F j, Y",
                            dateFormat: "Y-m-d",
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
                          value={sellerTrxEndDate}
                          onChange={(selectedDates, dateStr, instance) =>
                            dispatch(updateSellerTrxEndDate(dateStr))
                          }
                          options={{
                            altInput: true,
                            altFormat: "F j, Y",
                            dateFormat: "Y-m-d",
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
                <CardTitle className="h4"> Sellers Transactions List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Company</Th>
                      <Th>Order</Th>
                      <Th>Oder amount</Th>
                      <Th>Delivery fee</Th>
                      <Th>Drop earning</Th>
                      <Th>Unsettled amount</Th>
                      <Th>Seller earning</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {sellersTrxs.length > 0 &&
                      sellersTrxs.map((trx, index) => (
                        <Tr
                          key={index}
                          className="align-middle cursor-pointer"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                          onClick={() =>
                            sellerShopsTrxs(trx._id, trx?.company_name)
                          }
                        >
                          <Th>{trx?.company_name}</Th>

                          <Td>{trx?.totalOrder}</Td>
                          <Td>{trx?.orderValue?.productAmount.toFixed(2)}</Td>
                          <Td>{trx?.orderValue?.deliveryFee}</Td>
                          <Td>{trx?.earning?.dropGet}</Td>
                          <Td>{trx?.earning?.unSettleAmount}</Td>
                          <Td>{trx?.earning?.settleAmount}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="success" />
                  </div>
                )}
                {!loading && sellersTrxs.length < 1 && (
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
                    lisener={(page) => dispatch(getSellersTrx(true, page))}
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

export default SellerTransactions;
