import React, { useEffect } from "react";
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
import Tooltip from "@mui/material/Tooltip";
import AppPagination from "../../../components/AppPagination";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import styled from "styled-components";
import Select from "react-select";
import {
  productStatusOptions,
  sortByOptions,
} from "../../../assets/staticData";
import {
  allDeliveryMan,
  updateDeliveryManSearchKey,
  updateDeliveryManSortByKey,
  updateDeliveryManStatusKey,
} from "../../../store/DeliveryMan/DeliveryManAction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import Search from './../../../components/Search';

const DeliverymanList = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    loading,
    sortByKey,
    statusKey,
    searchKey,
    deliveryMans,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
  } = useSelector((state) => state.deliveryManReducer);

  useEffect(() => {
    if (sortByKey || statusKey || searchKey) {
      callDeliveryManList(true);
    }
  }, [sortByKey, statusKey, searchKey]);

  const callDeliveryManList = (refresh = false) => {
    dispatch(allDeliveryMan(refresh));
  };


  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"List"}
              title="Deliveryman"
              loading={loading}
              callList={callDeliveryManList}
              isAddNew={true}
              addNewRoute="deliveryman/add"
            />

            <Card>
              <CardBody>
                <Row className="d-flex justify-content-between">
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Sort By</label>
                      <Select
                        palceholder="Select Status"
                        options={sortByOptions}
                        classNamePrefix="select2-selection"
                        value={sortByKey}
                        onChange={(e) =>
                          dispatch(updateDeliveryManSortByKey(e))
                        }
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Status</label>
                      <Select
                        palceholder="Select Status"
                        options={productStatusOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={statusKey}
                        onChange={(e) =>
                          dispatch(updateDeliveryManStatusKey(e))
                        }
                        defaultValue={""}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                  <Col lg={8}>
                    <Search dispatchFunc={updateDeliveryManSearchKey} />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <CardTitle className="h4"> Deliveryman List</CardTitle>
                <hr />
                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Phone</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {deliveryMans.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th>{item?.name}</Th>
                          <Td>{item.number}</Td>
                          <Td>{item.status}</Td>
                          <Td>
                            <div>
                              <Tooltip title="Edit">
                                <button
                                  className="btn btn-success me-0 me-lg-2 button"
                                  onClick={() =>
                                    history.push(`/deliveryman/edit/${item._id}`)
                                  }
                                >
                                  <i className="fa fa-edit" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Details">
                                <button
                                  className="btn btn-info button me-0 me-lg-2"
                                  onClick={() =>
                                    history.push(`/deliveryman/details/${item._id}`)
                                  }
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
                    <Spinner animation="border" variant="info" />
                  </div>
                )}
                {!loading && deliveryMans.length < 1 && (
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
                    lisener={(page) => dispatch(allDeliveryMan(true, page))}
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
  border: 1px solid lightgray;
  border-radius: 6px;
  width: 100%;
  padding: 2px 7px;
  @media (max-width: 1200px) {
    width: 100%;
  }
  .search__wrapper {
    /* padding: 7px 10px; */
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

export default DeliverymanList;
