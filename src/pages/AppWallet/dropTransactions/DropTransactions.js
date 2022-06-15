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
import  Flatpickr  from 'react-flatpickr';
import { useDispatch, useSelector } from "react-redux";
import { getDeliveryTrx, getDropTrx, updateDeliveryTrxEndDate, updateDeliveryTrxStartDate } from "../../../store/appWallet/appWalletAction";
import AppPagination from "../../../components/AppPagination";


const DropTransactions = () => {

  const {
    loading,
    dropTrxs,
    dropTrxStartDate,
    dropTrxEndDate,
    paging,
    hasNextPage,
    currentPage,
    hasPreviousPage,
  } = useSelector((state) => state.appWalletReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    if (dropTrxStartDate || dropTrxEndDate) {
      callTransList(true);
    }
  }, [dropTrxStartDate, dropTrxEndDate]);

  const callTransList = (refresh = false) => {
    dispatch(getDropTrx(refresh));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem=" Drop Transactions"
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
                          value={dropTrxStartDate}
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
                          value={dropTrxEndDate}
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
                <CardTitle className="h4"> Drop Transactions List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Delivery Boy</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>admin Note</Th>
                      <Th>User Note</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {dropTrxs.map((item, index) => {
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
                          <Td>{item?.status}</Td>
                          <Td style={{ maxWidth: "150px" }}>
                            {item?.adminNote}
                          </Td>
                          <Td style={{ maxWidth: "150px" }}>
                            {item?.userNote}
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
                {!loading && dropTrxs.length < 1 && (
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
                    lisener={(page) => dispatch(getDropTrx(true, page))}
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

export default DropTransactions;
