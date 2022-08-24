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
import { getAllNotifications } from "../../store/Notification/notificationAction";
import { Tooltip } from "@mui/material";

const NotificationsList = () => {
  const dispatch = useDispatch();

  const {
    notifications,
    loading,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
  } = useSelector((state) => state.notificationReducer);

  useEffect(() => {
    callNotificationsList(true);
  }, []);

  const callNotificationsList = (refresh = false) => {
    dispatch(getAllNotifications(refresh));
  };

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
                      <Th>Image</Th>
                      <Th>Title</Th>
                      <Th>Account Type</Th>
                      <Th>Type</Th>
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
                          <Th>
                            <div className="image__wrapper">
                              <img
                                // onClick={() => {
                                //   setIsOpen(true);
                                //   setSelectedImg(item?.shopLogo);
                                // }}
                                className="img-fluid cursor-pointer"
                                alt=""
                                src={item.image}
                                style={{
                                  // width: "100%",
                                  height: "100%",
                                  // objectFit: "contain",
                                }}
                              />
                            </div>
                          </Th>
                          <Td>{item?.title}</Td>
                          <Td>{item?.accountType}</Td>
                          <Td>{item?.type}</Td>
                          <Td>{item?.status}</Td>
                          <Td>
                            {new Date(item?.createdAt).toLocaleDateString()}
                          </Td>

                          {/* <Td>
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
                          </Td> */}
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
