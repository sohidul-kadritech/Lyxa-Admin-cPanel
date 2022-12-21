import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Input,
  Row,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import GlobalWrapper from "../../components/GlobalWrapper";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Select from "react-select";
import { chatOPtions, sortByOptions } from "../../assets/staticData";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllChat,
  updateChatSortByKey,
  updateChatType,
  acceptChatReq,
} from "../../store/chat/chatAction";
import { Tooltip } from "@mui/material";
import { useHistory } from "react-router-dom";
import TableImgItem from "../../components/TableImgItem";
import noPhoto from "../../assets/images/noPhoto.jpg";

const Chat = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { socket } = useSelector((state) => state.socketReducer);
  const { loading, chatRequests, sortByKey, typeKey } = useSelector(
    (state) => state.chatReducer
  );

  useEffect(() => {
    if (sortByKey || typeKey) {
      callChatList(true);
    }
  }, [sortByKey, typeKey]);

  const callChatList = (refresh = false) => {
    dispatch(getAllChat(refresh));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Customer Support"
              loading={loading}
              callList={callChatList}
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
                        value={sortByKey}
                        onChange={(e) => dispatch(updateChatSortByKey(e))}
                      />
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="mb-4">
                      <label className="control-label">Type</label>
                      <Select
                        palceholder="Select Status"
                        options={chatOPtions}
                        classNamePrefix="select2-selection"
                        value={typeKey}
                        onChange={(e) => dispatch(updateChatType(e))}
                      />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* LIST */}
            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Chat List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table  table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Customer</Th>
                      {/* <Th>Reason</Th> */}
                      <Th>Status</Th>
                      <Th>Inquiry date</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {chatRequests?.map((item, index) => {
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
                            <TableImgItem
                              img={
                                item?.user?.profile_photo
                                  ? item?.user?.profile_photo
                                  : noPhoto
                              }
                              name={item?.user?.name}
                              // id={item?.user?.autoGenId}
                            />
                          </Th>
                          {/* <Td>{item?.reasonMessage ?? "N/A"}</Td> */}
                          <Td
                            style={{
                              color:
                                item?.status === "pending"
                                  ? "#eac300"
                                  : item?.status === "accepted"
                                  ? "#56ca00"
                                  : item?.status === "resolved"
                                  ? "#42f5aa"
                                  : "red",
                              fontSize: "15px",
                              textTransform: "uppercase",
                            }}
                          >
                            {item?.status}
                          </Td>
                          <Td>
                            {new Date(item?.createdAt).toLocaleDateString()}
                          </Td>

                          <Td>
                            <div>
                              <Tooltip title="Details">
                                <button
                                  className="btn btn-info button me-2"
                                  onClick={() => {
                                    history.push(
                                      `/customer-support/details/${item?._id}`
                                    );
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
                {!loading && chatRequests?.length < 1 && (
                  <div className="text-center">
                    <h4>No Chat!</h4>
                  </div>
                )}
              </CardBody>
            </Card>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default Chat;
