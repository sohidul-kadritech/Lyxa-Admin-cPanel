import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from "reactstrap";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Flatpickr from "react-flatpickr";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import Select from "react-select";
import { sortByOptions } from "../../../assets/staticData";
import { useSelector, useDispatch } from "react-redux";
import {
  updateDropPaySortByKey,
  updateDropPayStartDate,
  updateDropPayEndDate,
  getAllDropPay,
  updateLyxaPaySearchKey,
} from "../../../store/DropPay/dropPayAction";

import UserCradit from "../../../components/UserCradit";
import AppPagination from "../../../components/AppPagination";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Search from "../../../components/Search";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TableImgItem from "../../../components/TableImgItem";


const DropPayList = () => {
  const dispatch = useDispatch();

  const {
    loading,
    credits,
    sortByKey,
    startDate,
    endDate,
    status,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    searchKey: dropPaySearchKey
  } = useSelector((state) => state.dropPayReducer);

  const [balAddModal, setBalAddModal] = useState(false);

  useEffect(() => {
    if (sortByKey || startDate || endDate || dropPaySearchKey) {
      callDropPayList(true);
    }
  }, [sortByKey, startDate, endDate, dropPaySearchKey]);



  const callDropPayList = (refresh = false) => {
    dispatch(getAllDropPay(refresh));
  };

  useEffect(() => {
    if (status) {
      setBalAddModal(false);
    }
  }, [status]);



  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Drop Pay"}
              loading={loading}
              callList={callDropPayList}
            />

            <Card>
              <CardBody>
                <Row>
                  <Col lg={4}>
                    <div className="mb-4">
                      <label className="control-label">Sort By</label>
                      <Select
                        palceholder="Select Status"
                        options={sortByOptions}
                        classNamePrefix="select2-selection"
                        value={sortByKey}
                        onChange={(e) => dispatch(updateDropPaySortByKey(e))}
                      />
                    </div>
                  </Col>

                  <Col lg={8}>
                    <div className="d-flex my-3 my-md-0 ">
                      <div className=" w-100">
                        <label>Start Date</label>
                        <div className="form-group mb-0 w-100">
                          <Flatpickr
                            className="form-control d-block"
                            id="startDate"
                            placeholder="Start Date"
                            value={startDate}
                            onChange={(selectedDates, dateStr, instance) =>
                              dispatch(updateDropPayStartDate(dateStr))
                            }
                            options={{
                              altInput: true,
                              altFormat: "F j, Y",
                              dateFormat: "Y-m-d",
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
                            onChange={(selectedDates, dateStr, instance) =>
                              dispatch(updateDropPayEndDate(dateStr))
                            }
                            options={{
                              altInput: true,
                              altFormat: "F j, Y",
                              dateFormat: "Y-m-d",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row className="d-flex justify-content-center">
                  <Col lg={8}>
                    <Search dispatchFunc={updateLyxaPaySearchKey} placeholder="Search by id or customer name or email" />
                  </Col>
                </Row>

              </CardBody>
            </Card>

            {/* TABLE */}

            <Card>
              <CardBody>
                <div className="d-flex justify-content-end">
                  <Button
                    outline={true}
                    color="success"
                    onClick={() => setBalAddModal(!balAddModal)}
                  >
                    Add/Remove Credit
                  </Button>
                </div>
                <hr />
                <Table
                  id="tech-companies-1"
                  className="table  table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Customer</Th>
                      <Th>Email</Th>
                      {/* <Th>Deposit ID</Th> */}
                      <Th>Amount</Th>
                      <Th>Deposit by</Th>
                      <Th>Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {credits.map((item, index) => {
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
                            <TableImgItem altImg={AccountBalanceIcon} name={item?.user?.name} id={item?.autoGenId} />
                          </Th>
                          <Td>{item?.user?.email}</Td>
                          <Td>{item?.amount}</Td>
                          <Td>
                            {item?.type === "userPayAfterReceivedOrderByCard"
                              ? "Card"
                              : "Admin"}
                          </Td>
                          <Td>
                            {new Date(item?.createdAt).toLocaleDateString()}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" color="info" />
                  </div>
                )}
                {!loading && credits?.length < 1 && (
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
                    lisener={(page) => dispatch(getAllDropPay(true, page))}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* ADD / REMOVE BALANCE */}

        <Modal
          isOpen={balAddModal}
          toggle={() => {
            setBalAddModal(!balAddModal);
          }}
          centered={true}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Add/Remove User Cradit</h5>
            <button
              type="button"
              onClick={() => {
                setBalAddModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <UserCradit />
          </div>
        </Modal>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default DropPayList;
