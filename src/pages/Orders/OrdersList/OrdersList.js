import React from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { orderTypesOptions, sortByOptions } from "../../../assets/staticData";
import { Tooltip } from '@mui/material';
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

const OrdersList = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"List"}
              title="Orders"
              // loading={loading}
              // callList={callShopList}
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
                        // value={sortByKey}
                        // onChange={(e) => dispatch(updateDropPaySortByKey(e))}
                      />
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="d-flex my-3 my-md-0 ">
                      <div className=" w-100">
                        <label>Start Date</label>
                        <div className="form-group mb-0 w-100">
                          <Flatpickr
                            className="form-control d-block"
                            id="startDate"
                            placeholder="Start Date"
                            // value={startDate}
                            // onChange={(selectedDates, dateStr, instance) =>
                            //   dispatch(updateDropPayStartDate(dateStr))
                            // }
                            options={{
                              altInput: true,
                              altFormat: "F j, Y",
                              dateFormat: "Y-m-d",
                            }}
                          />
                        </div>
                      </div>
                      <div className="ms-2 w-100">
                        <label>End Date</label>
                        <div className="form-group mb-0">
                          <Flatpickr
                            className="form-control w-100"
                            id="endDate"
                            placeholder="Select End Date"
                            // value={endDate}
                            // onChange={(selectedDates, dateStr, instance) =>
                            //   dispatch(updateDropPayEndDate(dateStr))
                            // }
                            options={{
                              altInput: true,
                              altFormat: "F j, Y",
                              dateFormat: "Y-m-d",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="mb-4">
                      <label className="control-label">Type</label>
                      <Select
                        palceholder="Select Status"
                        options={orderTypesOptions}
                        classNamePrefix="select2-selection"
                        // value={sortByKey}
                        // onChange={(e) => dispatch(updateDropPaySortByKey(e))}
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
                <CardTitle className="h4"> Order List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Serial</Th>
                      <Th>Address</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {/* {shops.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th style={{ height: "50px", maxWidth: "150px" }}>
                            <img
                              onClick={() => {
                                setIsZoom(true);
                                setShopImg(item.shopLogo);
                              }}
                              className="img-fluid cursor-pointer"
                              alt=""
                              src={item.shopLogo}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </Th>

                          <Td>{item.shopName}</Td>
                          <Td>{item.shopType}</Td>
                          <Td>
                            <p>{item.shopStartTimeText}</p>
                            <p>{item.shopEndTimeText}</p>
                          </Td>
                          <Td>{item.shopStatus}</Td>
                          <Td>
                            <div>
                              <Tooltip title="Edit">
                                <button
                                  className="btn btn-success me-2 button"
                                  // onClick={() =>
                                  //   history.push(`/shops/edit/${item._id}`)
                                  // }
                                >
                                  <i className="fa fa-edit" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Details">
                                <button
                                  className="btn btn-info button me-2"
                                  // onClick={() => {
                                  //   history.push(`/shops/details/${item._id}`);
                                  // }}
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
                {!loading && shops.length < 1 && (
                  <div className="text-center">
                    <h4>No Data</h4>
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
                    lisener={(page) => dispatch(getAllShop(true, null, page))}
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

export default OrdersList;
