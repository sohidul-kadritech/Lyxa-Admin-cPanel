import { Tooltip } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import {

    Card,
    CardBody,
    CardTitle,
    Col,

    Row,
    Spinner,

  } from "reactstrap";

const OrderTable = ({orders, loading}) => {


    const history = useHistory();

    return (
        <div>
            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Order List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Order Id</Th>
                      <Th>Delivery Address</Th>
                      <Th>Status</Th>
                      <Th>Payment Status</Th>
                      <Th>Total Amount</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {orders.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th>{item?.orderId}</Th>

                          <Td style={{ maxWidth: "120px" }}>
                            {item?.orderDeliveryAddress?.address}
                          </Td>
                          <Td>{item?.orderStatus}</Td>
                          <Td>{item?.paymentStatus}</Td>
                          <Td>{item.summery?.total}</Td>
                          <Td>
                            <div>
                              <Tooltip title="Details">
                                <button
                                  className="btn btn-info button me-2"
                                  onClick={() => {
                                    history.push(`/orders/details/${item._id}`);
                                  }}
                                >
                                  <i className="fa fa-eye" />
                                </button>
                              </Tooltip>
                            </div>
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
                {!loading && orders.length < 1 && (
                  <div className="text-center">
                    <h4>No Order!</h4>
                  </div>
                )}
              </CardBody>
            </Card>
        </div>
    );
};

export default OrderTable;