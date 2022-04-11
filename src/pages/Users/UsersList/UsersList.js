import React, { useEffect, useState } from "react";

import styled from "styled-components";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
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
  updateCreatedByKey,
  updateSearchKey,
  updateStatusKey,
  usersList,
} from "../../../store/Users/UsersAction";
import { useHistory } from "react-router-dom";
import AppPagination from "../../../components/AppPagination";

const BlankPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    loading,
    users,
    statusKey,
    searchKey,
    createdByKey,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
  } = useSelector((state) => state.usersReducer);

  useEffect(() => {
    if (statusKey || searchKey || createdByKey) {
      callUsersList(true);
    } else {
      callUsersList();
    }
  }, [statusKey, searchKey, createdByKey]);

  // CALL USERS LIST

  const callUsersList = (refresh = false) => {
    dispatch(usersList(refresh));
  };

  // UPDATE SEARCH KEY

  const searchKeyListener = (value) => {
    dispatch(updateSearchKey(value));
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
              isAddNew={true}
              addNewRoute="users/add"
            />

            {/* FILTER OPTIONS */}

            <Card>
              <CardBody>
                <Row>
                  <Col md={3}>
                    <div>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={statusKey}
                          label="Status"
                          onChange={(event) =>
                            dispatch(updateStatusKey(event.target.value))
                          }
                        >
                          <MenuItem value={"all"}>All</MenuItem>
                          <MenuItem value={"pending"}>Pending</MenuItem>
                          <MenuItem value={"block"}>Block</MenuItem>
                          <MenuItem value={"permanent-block"}>
                            Permanent Block
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </Col>
                  <Col md={6} className="d-flex align-items-center">
                    <SearchWrapper>
                      <div className="search__wrapper">
                        <i className="fa fa-search" />
                        <input
                          className="form-control"
                          type="search"
                          placeholder="Search here"
                          id="search"
                          value={searchKey}
                          onChange={(event) =>
                            searchKeyListener(event.target.value)
                          }
                        />
                      </div>
                    </SearchWrapper>
                  </Col>
                  <Col md={3}>
                    <div>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Created By
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={createdByKey}
                          label="CreatedBy"
                          onChange={(event) =>
                            dispatch(updateCreatedByKey(event.target.value))
                          }
                        >
                          <MenuItem value={"admin"}>Admin</MenuItem>
                          <MenuItem value={"self"}>Self</MenuItem>
                        </Select>
                      </FormControl>
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
                      <Th>Image</Th>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
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
                            <Th>
                              <div style={{ width: "50px", height: "50px" }}>
                                <img
                                  // onClick={() => {
                                  //   setIsZoom(true);
                                  //   setPartnerImage(partner.img);
                                  // }}
                                  className="img-fluid cursor-pointer"
                                  alt=""
                                  src={user.img}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                            </Th>

                            <Td>{user.name}</Td>
                            <Td>{user.email}</Td>
                            <Td>{user.phoneNumber}</Td>
                            <Td>
                              <ButtonWrapper>
                                <button
                                  className="btn btn-info me-xl-3"
                                  onClick={() =>
                                    history.push(`/users/edit/${user.id}`)
                                  }
                                >
                                  <i className="fa fa-edit" />
                                </button>
                                <button
                                  className="btn btn-success "
                                  onClick={() =>
                                    history.push(`/user/details/${user.id}`)
                                  }
                                >
                                  <i className="fa fa-eye" />
                                </button>
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
                    lisener={(page) => dispatch(usersList(true, page))}
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

const SearchWrapper = styled.div`
  width: 100%;
  border: 1px solid #cfcccc;
  border-radius: 6px;

  .search__wrapper {
    padding: 7px 10px;
    display: flex;
    align-items: center;

    i {
      font-size: 15px;
    }
    input {
      border: none;
      color: black !important;
    }
  }
`;

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

export default BlankPage;
