import React from 'react';
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

const TableForList = () => {
    return (
        <Card className='mt-4'>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4">  List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Image</Th>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
                      <Th>Company Name</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {/* {sellers.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th style={{ height: "50px",maxWidth: '150px' }}>
                   
                              <img
                                onClick={() => {
                                  setIsZoom(true);
                                  setSellerImg(item.profile_photo);
                                }}
                                className="img-fluid cursor-pointer"
                                alt=""
                                src={item?.profile_photo}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                  
                          </Th>

                          <Td>{item?.name}</Td>
                          <Td>{item?.email}</Td>
                          <Td>{item.phone_number}</Td>
                          <Td>{item.company_name}</Td>
                          <Td>{item.status}</Td>
                          <Td>
                            <div>
                              <Tooltip title="Edit">
                                <button
                                  className="btn btn-success me-0 me-xl-2 button"
                                  onClick={() =>
                                    history.push(`/seller/edit/${item._id}`)
                                  }
                                >
                                  <i className="fa fa-edit" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Details">
                                <button
                                  className="btn btn-info button me-0 me-xl-2"
                                  onClick={() =>
                                    history.push(`/seller/details/${item._id}`)
                                  }
                                >
                                  <i className="fa fa-eye" />
                                </button>
                              </Tooltip>
                            </div>
                          </Td>
                        </Tr>
                      );
                    })} */}
                  </Tbody>
                </Table>
                {/* {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="info" />
                  </div>
                )}
                {!loading && sellers.length < 1 && (
                  <div className="text-center">
                    <h4>No Data!</h4>
                  </div>
                )} */}
              </CardBody>
            </Card>
    );
};

export default TableForList;