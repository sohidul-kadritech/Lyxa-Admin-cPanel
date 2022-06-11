import React, { useEffect, useState } from "react";

import styled from "styled-components";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import Lightbox from "react-image-lightbox";
import InputLabel from "@mui/material/InputLabel";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSearchKey,
  updateSortKey,
  updateStatusKey,
  userList,
} from "../../../store/Users/UsersAction";
import { useHistory } from "react-router-dom";
import AppPagination from "../../../components/AppPagination";
import { Tooltip } from "@mui/material";
import Search from "./../../../components/Search";
import { sortByOptions, userStatusOptions } from "./../../../assets/staticData";
import Select from "react-select";

const UsersList = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    loading,
    users,
    sortByKey,
    searchKey,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    statusKey,
  } = useSelector((state) => state.usersReducer);

  useEffect(() => {
    if (sortByKey || searchKey || statusKey) {
      callUsersList(true);
    }
  }, [sortByKey, searchKey]);

  // CALL USERS LIST

  const callUsersList = (refresh = false) => {
    dispatch(userList(refresh));
  };



  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              maintitle="Users"
              breadcrumbItem="List"
              hideSettingBtn={true}
              loading={loading}
              callList={callUsersList}
              // isAddNew={true}
              // addNewRoute="users/add"
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
                    <Search dispatchFunc={updateSearchKey} />
                  </Col>

                  <Col md={3}>
                    <div className="mb-4">
                      <label className="control-label">Status</label>
                      <Select
                        palceholder="Select Status"
                        options={userStatusOptions}
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
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Users List</CardTitle>
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Gender</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {users &&
                      users.map((user, index) => {
                        return (
                          <Tr
                            key={index}
                            className="align-middle"
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                            }}
                          >
                            <Th>{user.name}</Th>
                            <Td>{user.email}</Td>
                            <Td>{user.gender}</Td>
                            <Td>{user.status}</Td>
                            <Td>
                              <ButtonWrapper>
                                <Tooltip title="Transactions">
                                  <button
                                    className="btn btn-info me-xl-3"
                                    onClick={() =>
                                      history.push(
                                        `/users/transactions/${user._id}`
                                      )
                                    }
                                  >
                                    <i className="ti-money" />
                                  </button>
                                </Tooltip>
                                <Tooltip title="Details">
                                  <button
                                    className="btn btn-info me-xl-3"
                                    onClick={() =>
                                      history.push(`/users/details/${user._id}`)
                                    }
                                  >
                                    <i className="fa fa-eye" />
                                  </button>
                                </Tooltip>
                              </ButtonWrapper>
                            </Td>
                          </Tr>
                        );
                      })}
                    {loading && (
                      <Tr>
                        <Td>
                          <Spinner
                            style={{
                              position: "fixed",
                              left: "50%",
                              top: "50%",
                            }}
                            animation="border"
                            variant="success"
                          />
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>

                {users.length < 1 && !loading && (
                  <div className="text-center">
                    <h3>No Data Found</h3>
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
    </React.Fragment>
  );
};

const ButtonWrapper = styled.div`
  .btn {
    width: 30px;
    height: 30px;
    padding: 6px 0px;
    border-radius: 15px;
    text-align: center;
    font-size: 12px;
    line-height: 1.42857;
  }
`;

export default UsersList;
