import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, Container, Input, Row, Spinner } from "reactstrap";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

import { useDispatch, useSelector } from "react-redux";
import { getAllChat, updateChatSortByKey, updateChatType, acceptChatReq } from "../../../store/chat/chatAction";
import { Tooltip } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import TableImgItem from "../../../components/TableImgItem";
import noPhoto from "../../../assets/images/noPhoto.jpg";
import requestApi from "../../../network/httpRequest";
import { CHAT_REQUESTS_FOR_SINGLE_ORDER } from "../../../network/Api";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import ThreeDotsMenu from "../../../components/ThreeDotsMenu";

const ChatsListByOrder = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const { socket } = useSelector((state) => state.socketReducer);
  const { status, loading, selectedMsg, chatRequests, isSendingMsg } = useSelector((state) => state.chatReducer);

  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      callOrderQueryList(true);
    } else {
      history.push("/customer-support", { replace: true });
    }
  }, [id]);

  const callApi = async (refresh, orderId) => {
    if (refresh) {
      setIsLoading(true);
      try {
        const { data } = await requestApi().request(CHAT_REQUESTS_FOR_SINGLE_ORDER, {
          params: {
            orderId,
          },
        });

        if (data?.status) {
          setIsLoading(false);
          setList(data?.data?.list);
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  const callOrderQueryList = (refresh = false) => {
    console.log();
    callApi(refresh, id);
  };

  // Go to detail
  const goToDetailPage = (item) => {
    history.push({
      pathname: `/customer-support/details/${item?.order}`,
      search: `?status=${item?.status}`,
    });
  };

  // HANDLE MANU ITEM
  const handleMenu = (menu, item) => {
    if (menu === "Accept") {
      dispatch(acceptChatReq(item?._id));
    }
    // else if (menu === "Details") {
    //   history.push({
    //     pathname: `/customer-support/details/${item?.order}`,
    //     search: `?status=${item?.status}`,
    //   });
    // }
  };

  useEffect(() => {
    if (status) {
      callOrderQueryList(true);
    }
  }, [status]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Lyxa"
              breadcrumbItem="Single Order Query"
              title="Customer Support"
              loading={isLoading}
              callList={callOrderQueryList}
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
                <CardTitle className="h4"> Chat List</CardTitle>
                <Table id="tech-companies-1" className="table  table-hover text-center">
                  <Thead>
                    <Tr>
                      <Th>Inquery ID</Th>
                      <Th>Status</Th>
                      <Th>Inquery Date</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {list?.map((item, index) => {
                      console.log(item.status)
                      return (
                        <Tr
                          key={index}
                          className="align-middle cursor-pointer text-capitalize"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th
                            style={{ textAlign: "left" }}
                            onClick={() => {
                              goToDetailPage(item);
                            }}
                          >
                            {item?.shortId}
                          </Th>
                          <Td
                            onClick={() => {
                              goToDetailPage(item);
                            }}
                          >
                            {item?.status}
                          </Td>

                          <Td
                            onClick={() => {
                              goToDetailPage(item);
                            }}
                          >
                            <p className="mb-0">{new Date(item?.createdAt).toLocaleDateString()}</p>
                            <p className="mb-0">{new Date(item?.createdAt).toLocaleTimeString()}</p>
                          </Td>

                          <Td>
                            {/* <div>
                              <Tooltip title="Details">
                                <button
                                  className="btn btn-info button me-2"
                                  onClick={() => {
                                    history.push(
                                      `/customer-support/details/${item?.order}`
                                    );
                                  }}
                                >
                                  <i className="fa fa-eye" />
                                </button>
                              </Tooltip>
                            </div> */}
                            <ThreeDotsMenu
                              handleMenuClick={(menu) => handleMenu(menu, item)}
                              menuItems={[
                                item?.status === "pending" && "Accept",
                                item?.status === "pending" && "Reject",
                                item?.status !== "pending" && "No Action",
                              ]}
                            />
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                {isLoading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="success" />
                  </div>
                )}
                {!isLoading && list?.length < 1 && (
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

export default ChatsListByOrder;
