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

const Chats = () => {
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

            {/* <Card>
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
            </Card> */}

            {/* LIST */}
            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Order Chat Requests</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table  table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Shop/Customer</Th>
                      {/* <Th>Reason</Th> */}
                      <Th>Inquery Date</Th>
                      <Th>Order Id</Th>

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
                                item?.shop?.shopLogo
                                  ? item?.shop?.shopLogo
                                  : noPhoto
                              }
                              name={item?.shop?.shopName}
                              id={item?.user?.name}
                              fromChat={true}
                            />
                          </Th>
                          <Td>
                            <p className="mb-0">
                              {new Date(
                                item?.admin_chat_request?.at(0).createdAt
                              ).toLocaleDateString()}
                            </p>
                            <p className="mb-0">
                              {new Date(
                                item?.admin_chat_request?.at(0).createdAt
                              ).toLocaleTimeString()}
                            </p>
                          </Td>

                          <Td>{item?.orderId}</Td>

                          <Td>
                            <div>
                              <Tooltip title="Details">
                                <button
                                  className="btn btn-info button me-2"
                                  onClick={() => {
                                    history.push(
                                      `/customer-support/chats-by-single-order/${item?._id}`
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

export default Chats;
