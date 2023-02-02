import { Autocomplete, Box, TextField } from "@mui/material";
import { isNull } from "lodash";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { successMsg } from "../helpers/successMsg";
import {
  addUserAmount,
  withdrawUserAmount,
} from "../store/DropPay/dropPayAction";
import { getAllAppSettings } from "../store/Settings/settingsAction";
import { updateSearchKey, userList } from "../store/Users/UsersAction";

const UserCradit = ({ user = null }) => {
  const { users, searchKey } = useSelector((state) => state.usersReducer);
  const { loading, status } = useSelector((state) => state.dropPayReducer);
  const { appSettingsOptions } = useSelector((state) => state.settingsReducer);

  const {
    account_type,
    adminType,
    _id: accountId,
  } = useSelector((store) => store.Login.admin);

  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [userNote, setUserNote] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (user) {
      setSelectedUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (account_type === "admin" && adminType === "customerService") {
      dispatch(getAllAppSettings());
    }
  }, []);

  useEffect(() => {
    // if (searchKey) {
    //   dispatch(userList(true));
    // }
    dispatch(userList(true));
  }, [searchKey]);

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
    if (
      amount > !appSettingsOptions?.maxCustomerServiceValue
        ? 0
        : appSettingsOptions?.maxCustomerServiceValue &&
          account_type === "admin" &&
          adminType === "customerService"
    ) {
      return successMsg(
        `Amount can't be more than ${
          !appSettingsOptions?.maxCustomerServiceValue
            ? 0
            : appSettingsOptions?.maxCustomerServiceValue
        }`,
        "error"
      );
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
      setAdminNote("");
      setUserNote("");
      setAmount(0);
    }
  }, [status]);

  return (
    <div>
      <div className="mb-4">
        <Autocomplete
          className="cursor-pointer"
          value={selectedUser}
          onChange={(event, newValue) => {
            // console.log(newValue);
            setSelectedUser(newValue);
          }}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option._id == value._id}
          inputValue={searchKey}
          onInputChange={(event, newInputValue) => {
            dispatch(updateSearchKey(newInputValue));
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
  );
};

export default UserCradit;
