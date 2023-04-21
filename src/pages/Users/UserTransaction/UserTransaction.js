/* eslint-disable no-use-before-define */
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Card, CardBody, Col, Container, Row, Spinner } from 'reactstrap';
import { sortByOptions } from '../../../assets/staticData';
import AppPagination from '../../../components/AppPagination';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import {
  updateSortByKey,
  updateTransEndDate,
  updateTransStartDate,
  userTransactions,
} from '../../../store/Users/UsersAction';

function UserTransaction() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const {
    sortBy,
    startDate,
    endDate,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    transactionList,
    loading,
    users,
  } = useSelector((state) => state.usersReducer);

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (id) {
      const findUser = users.find((user) => user._id === id);
      setUser(findUser);
      if (sortBy || startDate || endDate) {
        callTransList(true);
      }
    } else {
      history.push('/users/list', { replace: true });
    }
  }, [id, sortBy, startDate, endDate]);

  const callTransList = (refresh = false) => {
    dispatch(userTransactions(refresh, id));
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem={user?.name}
            title="User Transaction"
            loading={loading}
            callList={callTransList}
          />

          <Card>
            <CardBody>
              <div className="d-flex align-items-center justify-content-end h-100 mb-3"></div>
              <Row>
                <Col md={4}>
                  <div>
                    <label className="control-label">Sort By</label>
                    <Select
                      palceholder="Select Status"
                      options={sortByOptions}
                      classNamePrefix="select2-selection"
                      value={sortBy}
                      onChange={(event) => dispatch(updateSortByKey(event))}
                    />
                  </div>
                </Col>

                <Col md={8}>
                  <div className="d-flex my-3 my-md-0 ">
                    <div className=" w-100">
                      <label>Start Date</label>
                      <div className="form-group mb-0 w-100">
                        <Flatpickr
                          className="form-control d-block"
                          id="startDate"
                          placeholder="Start Date"
                          value={startDate}
                          onChange={(selectedDates, dateStr) => dispatch(updateTransStartDate(dateStr))}
                          options={{
                            altInput: true,
                            altFormat: 'F j, Y',
                            dateFormat: 'Y-m-d',
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
                          value={endDate}
                          onChange={(selectedDates, dateStr) => dispatch(updateTransEndDate(dateStr))}
                          options={{
                            altInput: true,
                            altFormat: 'F j, Y',
                            dateFormat: 'Y-m-d',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div>
                <h4 className="ms-3 mt-2">User Transactions</h4>
                <hr className="my-2" />
                <Table id="tech-companies-1" className="table  table-hover text-center">
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th>Notes</Th>
                      {/* <Th>Admin Note</Th> */}
                      <Th>Amount</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: 'relative' }}>
                    {transactionList.length > 0 &&
                      transactionList.map((item) => (
                        <Tr
                          key={Math.round()}
                          className="align-middle"
                          style={{
                            fontSize: '15px',
                            fontWeight: '500',
                          }}
                        >
                          <Th>{moment(item?.createdAt).format('YYYY-MM-DD')}</Th>
                          <Td style={{ textAlign: 'left' }}>
                            {item?.adminNote === item?.userNote ? (
                              `${item?.adminNote || item?.userNote ? `Note: ${item?.adminNote}` : 'No note added'}`
                            ) : (
                              // eslint-disable-next-line react/jsx-no-useless-fragment
                              <>
                                {item?.adminNote ? (
                                  <>
                                    <span>{`${`Admin Note: ${item?.adminNote}`}`}</span>
                                    <br />
                                    <span>{`${`User Note: ${item?.userNote}`}`}</span>
                                  </>
                                ) : (
                                  <span>{`${item?.userNote}`}</span>
                                )}
                              </>
                            )}
                          </Td>
                          <Td
                            style={{
                              color: item?.type === 'userBalanceWithdrawAdmin' ? 'red' : 'green',
                            }}
                          >
                            {`${
                              item?.type === 'userBalanceWithdrawAdmin'
                                ? '-'
                                : item?.type === 'userBalanceAddAdmin'
                                ? '+'
                                : ''
                            } ${item?.amount}`}
                          </Td>
                        </Tr>
                      ))}
                    {loading && (
                      <Tr>
                        <Td>
                          <Spinner
                            style={{
                              position: 'fixed',
                              left: '50%',
                              top: '50%',
                            }}
                            animation="border"
                            color="success"
                          />
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </div>

              {transactionList.length < 1 && !loading && (
                <div className="text-center">
                  <h3>No Data Found!</h3>
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
                  lisener={(page) => dispatch(userTransactions(true, id, page))}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default UserTransaction;
