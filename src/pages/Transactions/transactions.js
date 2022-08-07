import React from "react";
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
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";

const Transactions = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Transactions"
              isRefresh={false}
            />
            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Transactions </CardTitle>

                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Amount</Th>
                      <Th>Type</Th>
                      <Th>Payment Method</Th>
                      <Th>Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {/* {deliveryTrxs.map((item, index) => {
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
                    })} */}
                  </Tbody>
                </Table>
                {/* {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="success" />
                  </div>
                )}
                {!loading && deliveryTrxs.length < 1 && (
                  <div className="text-center">
                    <h4>No Order!</h4>
                  </div>
                )} */}
              </CardBody>
            </Card>
            {/* <Row>
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
            </Row> */}
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default Transactions;
