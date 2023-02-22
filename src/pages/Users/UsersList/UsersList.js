/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import noPhoto from '../../../assets/images/noPhoto.jpg';
import { sortByOptions, statusOptions } from '../../../assets/staticData';
import AppPagination from '../../../components/AppPagination';
import CircularLoader from '../../../components/CircularLoader';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import Search from '../../../components/Search';
import TableImgItem from '../../../components/TableImgItem';
import ThreeDotsMenu from '../../../components/ThreeDotsMenu';
import { updateOrderChatSearchKey } from '../../../store/chat/chatAction';

import { updateSearchKey, updateSortKey, updateStatusKey, userList } from '../../../store/Users/UsersAction';

function UsersList() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { loading, users, sortByKey, searchKey, paging, hasNextPage, hasPreviousPage, currentPage, statusKey } =
    useSelector((state) => state.usersReducer);

  useEffect(() => {
    dispatch(updateSearchKey(''));
  }, []);

  useEffect(() => {
    if (sortByKey || searchKey || statusKey) {
      // eslint-disable-next-line no-use-before-define
      callUsersList(true);
    }
  }, [sortByKey, searchKey, statusKey]);

  // CALL USERS LIST

  const callUsersList = (refresh = false) => {
    dispatch(userList(refresh));
  };

  const handleMenu = (menu, user) => {
    if (menu === 'Transactions') {
      history.push(`/users/transactions/${user._id}`);
    }
  };

  const goToDetails = (id) => {
    history.push(`/users/details/${id}`);
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            maintitle="Lyxa"
            breadcrumbItem="List"
            title="User"
            hideSettingBtn
            loading={loading}
            callList={callUsersList}
          />

          {/* FILTER OPTIONS */}
          <Card>
            <CardBody>
              <Row>
                <Col md={3}>
                  <div className="mb-4">
                    <label className="control-label">Sort By</label>
                    <Select
                      palceholder="Select Status"
                      options={sortByOptions}
                      classNamePrefix="select2-selection"
                      value={sortByKey}
                      onChange={(e) => dispatch(updateSortKey(e))}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <Search dispatchFunc={updateOrderChatSearchKey} />
                </Col>

                <Col md={3}>
                  <div className="mb-4">
                    <label className="control-label">Status</label>
                    <Select
                      palceholder="Select Status"
                      options={statusOptions}
                      classNamePrefix="select2-selection"
                      value={statusKey}
                      onChange={(e) => dispatch(updateStatusKey(e))}
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* TABLE */}
          <Card>
            <CardBody>
              <Table id="tech-companies-1" className="table table__wrapper  table-hover text-center">
                <Thead className="bg-gray">
                  <Tr>
                    <Th>Customer</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Gender</Th>
                    <Th>DOB</Th>
                    <Th>Joined Date</Th>
                    <Th>Total Orders</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}>
                  {users.length > 0 &&
                    users.map((user) => (
                      <Tr
                        key={user?._id}
                        className="align-middle cursor-pointer"
                        style={{
                          fontSize: '15px',
                          fontWeight: '500',
                        }}
                      >
                        <Th onClick={() => goToDetails(user?._id)}>
                          <TableImgItem
                            img={user?.profile_photo ? user?.profile_photo : noPhoto}
                            name={user?.name}
                            id={user?.autoGenId}
                          />
                        </Th>
                        <Td onClick={() => goToDetails(user?._id)}>{user?.email}</Td>
                        <Td onClick={() => goToDetails(user?._id)}>
                          {user?.phone_number ? user?.phone_number : 'N/A'}
                        </Td>
                        <Td onClick={() => goToDetails(user?._id)}>{user?.gender}</Td>
                        <Td onClick={() => goToDetails(user?._id)}>{new Date(user?.dob).toLocaleDateString()}</Td>
                        <Td onClick={() => goToDetails(user?._id)}>{new Date(user?.createdAt).toLocaleDateString()}</Td>
                        <Td onClick={() => goToDetails(user?._id)}>{user?.totalOrder ?? 0}</Td>
                        <Td>
                          <ThreeDotsMenu
                            handleMenuClick={(menu) => handleMenu(menu, user)}
                            menuItems={['Transactions']}
                          />
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
              {loading && <CircularLoader />}
              {users.length < 1 && !loading && (
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
                  lisener={(page) => dispatch(userList(true, page))}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default UsersList;
