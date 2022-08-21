import React, { useEffect, useState } from "react";
import { Button, Form } from "reactstrap";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { successMsg } from "../helpers/successMsg";
import { shopAddRemoveCredit } from "../store/appWallet/appWalletAction";

const AddRemoveCredit = ({ userType, id, dropAmount, userAmount }) => {
  const { loading } = useSelector((state) => state.appWalletReducer);

  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [typeOfCredit, setTypeOfCredit] = useState("");

  const submitCredit = (e) => {
    e.preventDefault();
    if (amount <= 0) {
      return successMsg("Please enter a valid amount", "error");
    } else if (typeOfCredit === "") {
      return successMsg("Please select a type of credit", "error");
    } else if (typeOfCredit === "") {
      return successMsg("Please select a type of credit", "error");
    } else if (
      (typeOfCredit === "add" && amount > dropAmount) ||
      (typeOfCredit === "remove" && amount > userAmount)
    ) {
      return successMsg("You don't have enough credit", "error");
    } else {
      submitData();
    }
  };

  const submitData = () => {
    if (userType === "shop") {
      dispatch(shopAddRemoveCredit({ shopId: id, amount, type: typeOfCredit }));
    }
  };

  return (
    <div>
      <Form className="mb-4" onSubmit={submitCredit}>
        <TextField
          style={{ width: "100%" }}
          id="outlined-basic"
          label="Amount"
          type="number"
          variant="outlined"
          placeholder="Enter settle amount"
          className="mb-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <FormControl fullWidth required className="mb-2">
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            required
            id="demo-simple-select"
            value={typeOfCredit}
            onChange={(e) => setTypeOfCredit(e.target.value)}
            label="Status"
          >
            <MenuItem value="add">Add</MenuItem>
            <MenuItem value="remove">Remove</MenuItem>
          </Select>
        </FormControl>

        <div className="mt-3 d-flex justify-content-end">
          <Button type="submit" color="success" disabled={loading}>
            {loading ? "Paying.." : "Pay"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddRemoveCredit;
