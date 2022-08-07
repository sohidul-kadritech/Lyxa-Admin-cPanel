import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Info from "../../../components/Info";
import TransactionsCard from "../../../components/TransactionsCard";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { Tooltip } from "@mui/material";

const AdminLog = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Percentage Settings History"
              title="Admin"
              isRefresh={false}
            />

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4">Percentage History</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Amount</Th>
                      <Th>transaction Type</Th>
                      <Th>Date</Th>
                      <Th>Admin</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    <Tr
                      // key={index}
                      className="align-middle cursor-pointer"
                      style={{
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      <Th>1</Th>

                      <Td>20</Td>
                      <Td>20</Td>
                      <Td>Make Payment</Td>
                      <Td>Shuvo</Td>
                    </Tr>
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

export default AdminLog;
