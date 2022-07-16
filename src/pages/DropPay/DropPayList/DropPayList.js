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

const DropPayList = () => {
  const dispatch = useDispatch();

  const { loading, pays, sortByKey, startDate, endDate, status } = useSelector(
    (state) => state.dropPayReducer
  );
  const { users, searchKey } = useSelector((state) => state.usersReducer);

  const [balAddModal, setBalAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [userNote, setUserNote] = useState("");
  const [amount, setAmount] = useState(0);

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

  // ADD/ REMOVE BALANCE

  const submitBalance = (type) => {
    if (!selectedUser) {
      return successMsg("Please select user", "error");
    }
    if (!amount) {
      return successMsg("Please enter amount", "error");
    }
    if (!userNote) {
      return successMsg("Please enter user note", "error");
    }
    if (amount > 20000) {
      return successMsg("Amount can't be more than 20000", "error");
    }

    submitData(type);
  };

  const submitData = (type) => {
    const data = {
      userId: selectedUser._id,
      amount,
      userNote,
      adminNote,
    };

    if (type === "add") {
      dispatch(addUserAmount(data));
    } else {
      dispatch(withdrawUserAmount(data));
    }
  };

  useEffect(() => {
    if (status) {
      setBalAddModal(false);
      setAdminNote("");
      setUserNote("");
      setAmount(0);
      setSelectedUser(null);
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
            <div className="mb-4">
              <Autocomplete
                className="cursor-pointer"
                onChange={(event, newValue) => {
                  // console.log(newValue);
                  setSelectedUser(newValue);
                }}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option._id == value._id
                }
                inputValue={searchKey}
                onInputChange={(event, newInputValue) => {
                  // setUserSearchKey(newInputValue);
                  dispatch(updateSearchKey(newInputValue));
                  // console.log("input value", newInputValue);
                }}
                id="controllable-states-demo"
                options={users.length > 0 ? users : []}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Select a User" />
                )}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                    key={option._id}
                  >
                    {option.name}
                  </Box>
                )}
              />
            </div>
            <div className="mb-4">
              <TextField
                id="name"
                label="Amount"
                variant="outlined"
                style={{ width: "100%" }}
                autoComplete="off"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
                type="number"
              />
            </div>
            <div className="mb-4">
              <TextField
                id="note"
                label="Admin Note"
                variant="outlined"
                style={{ width: "100%" }}
                autoComplete="off"
                value={adminNote}
                onChange={(event) => setAdminNote(event.target.value)}
                required
                type="text"
              />
            </div>
            <div className="mb-4">
              <TextField
                id="note"
                label="user Note"
                variant="outlined"
                style={{ width: "100%" }}
                autoComplete="off"
                value={userNote}
                onChange={(event) => setUserNote(event.target.value)}
                required
                type="text"
              />
            </div>
            <div className="d-flex justify-content-center mt-3">
              <Button
                color="primary"
                disabled={loading}
                className="px-4"
                onClick={() => submitBalance("add")}
              >
                Add
              </Button>
              <Button
                color="primary"
                disabled={loading}
                className="px-4 ms-3"
                onClick={() => submitBalance("remove")}
              >
                Remove
              </Button>
            </div>
          </div>
        </Modal>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default DropPayList;
