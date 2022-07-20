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
  addUserAmount,
  withdrawUserAmount,
} from "../../../store/DropPay/dropPayAction";
import { Autocomplete, Box, TextField } from "@mui/material";
import { updateSearchKey, userList } from "../../../store/Users/UsersAction";
import { successMsg } from "../../../helpers/successMsg";
import UserCradit from "../../../components/UserCradit";

const DropPayList = () => {
  const dispatch = useDispatch();

  const { loading, pays, sortByKey, startDate, endDate, status } = useSelector(
    (state) => state.dropPayReducer
  );
  const { searchKey } = useSelector((state) => state.usersReducer);

  const [balAddModal, setBalAddModal] = useState(false);

  useEffect(() => {
    if (sortByKey || startDate || endDate) {
      callDropPayList(true);
    }
  }, [sortByKey, startDate, endDate]);

  useEffect(() => {
    if (searchKey) {
      dispatch(userList(true));
    }
  }, [searchKey]);

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
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="d-flex justify-content-between">
                  <CardTitle>Drop Pay List</CardTitle>

                  <Button
                    outline={true}
                    color="success"
                    onClick={() => setBalAddModal(!balAddModal)}
                  >
                    Add/Remove Credit
                  </Button>
                </div>
              </CardBody>
            </Card>
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
