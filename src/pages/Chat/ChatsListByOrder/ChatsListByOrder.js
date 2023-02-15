import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Col, Container, Row, Spinner } from 'reactstrap';

import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import ThreeDotsMenu from '../../../components/ThreeDotsMenu';
import { CHAT_REQUESTS_FOR_SINGLE_ORDER } from '../../../network/Api';
import requestApi from '../../../network/httpRequest';
import { acceptChatReq } from '../../../store/chat/chatAction';

function ChatsListByOrder() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const { status } = useSelector((state) => state.chatReducer);

  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log(list);

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

  useEffect(() => {
    if (id) {
      callOrderQueryList(true);
    } else {
      history.push('/customer-support', { replace: true });
    }
  }, [id]);

  // Go to detail
  const goToDetailPage = (item) => {
    history.push({
      pathname: `/customer-support/details/${item?.order}`,
      search: `?status=${item?.status}`,
      state: {
        user: item?.user,
      },
    });
  };

  // HANDLE MANU ITEM
  const handleMenu = (menu, item) => {
    if (menu === 'Accept') {
      dispatch(acceptChatReq(item?._id));
    }
  };

  useEffect(() => {
    if (status) {
      callOrderQueryList(true);
    }
  }, [status]);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem="Single Order Query"
            title="Customer Support"
            loading={isLoading}
            callList={callOrderQueryList}
          />
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
                <Tbody style={{ position: 'relative' }}>
                  {list?.map((item) => (
                    <Tr
                      key={Math.random()}
                      className="align-middle cursor-pointer text-capitalize"
                      style={{
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      <Th
                        style={{ textAlign: 'left' }}
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
                        <ThreeDotsMenu
                          handleMenuClick={(menu) => handleMenu(menu, item)}
                          menuItems={[
                            item?.status === 'pending' && 'Accept',
                            // item?.status === "pending" && "Reject",
                            item?.status !== 'pending' && 'No Action',
                          ]}
                        />
                      </Td>
                    </Tr>
                  ))}
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
  );
}

export default ChatsListByOrder;
