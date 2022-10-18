import React, { useEffect } from "react";
import GlobalWrapper from "../../components/GlobalWrapper";
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
import AppPagination from "../../components/AppPagination";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllNotifications,
  updateNotificationAccountType,
  updateNotificationActiveStatus,
  updateNotificationStatus,
  updateNotificationType,
} from "../../store/Notification/notificationAction";
import { Tooltip } from "@mui/material";
import Select from "react-select";
import {
  productStatusOptions,
  userTypesOptions,
  globalTypesOptions,
} from "./../../assets/staticData";

const NotificationsList = () => {
  const dispatch = useDispatch();

  const {
    notifications,
    loading,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    status,
    activeStatus,
    accountType,
    type,
    visibility,
  } = useSelector((state) => state.notificationReducer);

  useEffect(() => {
    if (activeStatus || accountType || type) {
      callNotificationsList(true);
    }
  }, [activeStatus, accountType, type]);

  const callNotificationsList = (refresh = false) => {
    dispatch(getAllNotifications(refresh));
  };

  // UPDATE STATUS

  const updateStatus = (id, status) => {
    dispatch(
      updateNotificationStatus({
        id,
        status: status === "active" ? "inactive" : "active",
      })
    );
  };

  useEffect(() => {
    if (status) {
      callNotificationsList(true);
    }
  }, [status]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              title="Notifications"
              breadcrumbItem="List"
              loading={loading}
              callList={callNotificationsList}
            />

            <Card>
              <CardBody>
                <Row>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Active Status</label>
                      <Select
                        palceholder="Select Status"
                        options={productStatusOptions}
                        classNamePrefix="select2-selection"
                        value={activeStatus}
                        onChange={(e) =>
                          dispatch(updateNotificationActiveStatus(e))
                        }
                      />
                    </div>
                  </Col>

                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Account Type</label>
                      <Select
                        palceholder="Select Status"
                        options={userTypesOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={accountType}
                        onChange={(e) =>
                          dispatch(updateNotificationAccountType(e))
                        }
                        defaultValue={""}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">type</label>
                      <Select
                        palceholder="Select Status"
                        options={globalTypesOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={type}
                        onChange={(e) => dispatch(updateNotificationType(e))}
                        defaultValue={""}
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
                <CardTitle className="h4"> Notifications List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Title</Th>
                      <Th>Account Type</Th>
                      <Th>Type</Th>
                      <Th>Sent</Th>
                      <Th>Status</Th>
                      <Th>Created At</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {notifications.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th style={{ maxWidth: "200px" }}>{item?.title}</Th>
                          <Td>{item?.accountType}</Td>
                          <Td>{item?.type}</Td>
                          <Td>{item?.status}</Td>
                          <Td style={{ color: item?.status === 'active' ? 'green' : 'red' }}>{item?.status}</Td>
                          <Td>
                            {new Date(item?.createdAt).toLocaleDateString()}
                          </Td>

                          <Td>
                            <div>
                              <Tooltip
                                title={
                                  item.status === "active"
                                    ? "Deactive"
                                    : "Active"
                                }
                              >
                                <button
                                  className={`btn ${item.status === "active"
                                    ? "btn-info"
                                    : "btn-danger"
                                    } button me-0 me-xl-2`}
                                  onClick={() =>
                                    updateStatus(item?._id, item?.status)
                                  }
                                >
                                  {!loading ? (
                                    <i className="fa fa-toggle-on" />
                                  ) : (
                                    <Spinner
                                      animation="border"
                                      variant="info"
                                      size="sm"
                                    />
                                  )}
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
                    <Spinner animation="border" variant="info" />
                  </div>
                )}
                {!loading && notifications.length < 1 && (
                  <div className="text-center">
                    <h4>No Data!</h4>
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
                    lisener={(page) =>
                      dispatch(getAllNotifications(true, page))
                    }
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

export default NotificationsList;
