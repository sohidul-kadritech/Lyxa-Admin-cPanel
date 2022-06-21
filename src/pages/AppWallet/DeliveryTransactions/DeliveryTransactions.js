import React, { useEffect } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import TransactionsCard from "../../../components/TransactionsCard";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Flatpickr from "react-flatpickr";
import { useDispatch, useSelector } from "react-redux";
import {
  getDeliveryTrx,
  updateDeliveryTrxEndDate,
  updateDeliveryTrxStartDate,
} from "../../../store/appWallet/appWalletAction";
import AppPagination from "../../../components/AppPagination";
import { Tooltip } from "@mui/material";
import { useHistory } from "react-router-dom";

const DeliveryTransactions = () => {
  const history = useHistory();
  const {
    loading,
    deliveryTrxs,
    deliveryTrxStartDate,
    deliveryTrxEndDate,
    paging,
    hasNextPage,
    currentPage,
    hasPreviousPage,
  } = useSelector((state) => state.appWalletReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    if (deliveryTrxStartDate || deliveryTrxEndDate) {
      callTransList(true);
    }
  }, [deliveryTrxStartDate, deliveryTrxEndDate]);

  const callTransList = (refresh = false) => {
    dispatch(getDeliveryTrx(refresh));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem=" Delivery Transactions"
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
                          value={deliveryTrxStartDate}
                          onChange={(selectedDates, dateStr, instance) =>
                            dispatch(updateDeliveryTrxStartDate(dateStr))
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
                          value={deliveryTrxEndDate}
                          onChange={(selectedDates, dateStr, instance) =>
                            dispatch(updateDeliveryTrxEndDate(dateStr))
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
                <CardTitle className="h4">
                  {" "}
                  Delivery Transactions List
                </CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Amount</Th>
                      <Th>Payment Method</Th>
                      <Th>admin Note</Th>
                      <Th>User Note</Th>
                      <Th>User Note</Th>

                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {deliveryTrxs.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th>{item?.deliveryBoy?.name}</Th>

                          <Td>{item?.amount}</Td>
                          <Td>{item?.paymentMethod}</Td>
                          <Td style={{ maxWidth: "150px" }}>
                            {item?.adminNote}
                          </Td>
                          <Td style={{ maxWidth: "150px" }}>
                            {item?.userNote}
                          </Td>
                          <Td>
                            <Tooltip title="Details">
                              <button
                                className="btn btn-info button"
                                onClick={() =>
                                  history.push(
                                    `/add-wallet/delivery-transactions/details/${item._id}`
                                  )
                                }
                              >
                                <i className="fa fa-eye" />
                              </button>
                            </Tooltip>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="success" />
                  </div>
                )}
                {!loading && deliveryTrxs.length < 1 && (
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
                    lisener={(page) => dispatch(getDeliveryTrx(true, page))}
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

export default DeliveryTransactions;
