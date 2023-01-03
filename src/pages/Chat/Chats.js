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
  updateOrderChatSearchKey,
} from "../../store/chat/chatAction";
import { Tooltip } from "@mui/material";
import { useHistory } from "react-router-dom";
import TableImgItem from "../../components/TableImgItem";
import noPhoto from "../../assets/images/noPhoto.jpg";
import AutocompletedInput from "../../components/AutocompletedInput";
import { getAllShop, updateShopSearchKey } from "../../store/Shop/shopAction";
import { updateSearchKey, userList } from "../../store/Users/UsersAction";
import Search from "../../components/Search";
import AppPagination from "../../components/AppPagination";

const Chats = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { socket } = useSelector((state) => state.socketReducer);
  const {
    loading,
    chatRequests,
    orderChatSearchKey,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    statusKey,
  } = useSelector((state) => state.chatReducer);
  const { shops, searchKey: shopSearchKey } = useSelector(
    (state) => state.shopReducer
  );
  const { users, searchKey: userSearchKey } = useSelector(
    (state) => state.usersReducer
  );

  const [shop, setShop] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    callChatList(true);
  }, [shop, user, orderChatSearchKey]);

  //  GET ALL SHOP

  useEffect(() => {
    if (shopSearchKey) {
      dispatch(getAllShop(true));
    }
  }, [shopSearchKey]);

  useEffect(() => {
    if (userSearchKey) {
      dispatch(userList(true));
    }
  }, [userSearchKey]);

  const callChatList = (refresh = false) => {
    dispatch(getAllChat(refresh, user?._id, shop?._id));
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
                <Row className="d-flex justify-content-center">
                  <Col lg={4}>
                    <label>Shop</label>
                    <AutocompletedInput
                      value={shop}
                      onChange={(event, newValue) => setShop(newValue)}
                      searchKey={shopSearchKey}
                      onInputChange={(event, newInputValue) =>
                        dispatch(updateShopSearchKey(newInputValue))
                      }
                      list={shops}
                      type="shop"
                      showImg={true}
                    />
                  </Col>
                  <Col lg={4}>
                    <label>User</label>
                    <AutocompletedInput
                      value={user}
                      onChange={(event, newValue) => setUser(newValue)}
                      searchKey={userSearchKey}
                      onInputChange={(event, newInputValue) =>
                        dispatch(updateSearchKey(newInputValue))
                      }
                      list={users}
                      type="user"
                    />
                  </Col>
                </Row>
                <div className="mt-3 d-flex justify-content-center">
                  <div style={{ width: "70%" }}>
                    <Search
                      dispatchFunc={updateOrderChatSearchKey}
                      placeholder="Search by order id"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

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

            <Row>
              <Col xl={12}>
                <div className="d-flex justify-content-center">
                  <AppPagination
                    paging={paging}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    currentPage={currentPage}
                    lisener={(page) =>
                      dispatch(userList(true, user?._id, shop?._id, page))
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

export default Chats;
