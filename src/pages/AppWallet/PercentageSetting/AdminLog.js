import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Select from "react-select";
import { adminLogTypeOptions, sortByOptions } from "../../../assets/staticData";
import {
  getAdminLogHistory,
  updateAdminLogSortKey,
  updateAdminLogTypeKey,
} from "../../../store/Settings/settingsAction";
import moment from "moment";
import AppPagination from "./../../../components/AppPagination";

const AdminLog = () => {
  const dispatch = useDispatch();
  const {
    loading,
    adminLogType,
    logSortBy,
    adminLogs,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
  } = useSelector((state) => state.settingsReducer);

  useEffect(() => {
    if (adminLogType || logSortBy) {
      callLogList(true);
    }
  }, [adminLogType, logSortBy]);

  const callLogList = (refresh = false) => {
    dispatch(getAdminLogHistory(refresh));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Percentage Settings History"
              title="Admin"
              loading={loading}
              callList={callLogList}
            />

            <Card>
              <CardBody>
                <Row>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Sort By</label>
                      <Select
                        palceholder="Select Status"
                        options={sortByOptions}
                        classNamePrefix="select2-selection"
                        value={logSortBy}
                        onChange={(e) => dispatch(updateAdminLogSortKey(e))}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Type</label>
                      <Select
                        palceholder="Select Status"
                        options={adminLogTypeOptions}
                        classNamePrefix="select2-selection"
                        value={adminLogType}
                        onChange={(e) => dispatch(updateAdminLogTypeKey(e))}
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
                <CardTitle className="h4">Percentage History</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Admin Name</Th>
                      <Th>Role</Th>
                      <Th>Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {adminLogs?.map((item, index) => (
                      <Tr
                        key={index}
                        className="align-middle"
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                        }}
                      >
                        <Th>{item?.admin?.name}</Th>
                        <Td>{item?.admin?.adminType}</Td>
                        <Td>
                          {moment(item?.date).format("MMMM Do YYYY, h:mm:ss a")}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {!loading && adminLogs.length < 1 && (
                  <div className="text-center">
                    <h4>No History!</h4>
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
                    lisener={(page) => dispatch(getAdminLogHistory(true, page))}
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

export default AdminLog;
