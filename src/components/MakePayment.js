import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { Button, Form } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { successMsg } from "../helpers/successMsg";
import {
  riderMakePayment,
  riderReceivedPayment,
  shopMakePayment,
} from "../store/appWallet/appWalletAction";

const MakePayment = ({
  unSettleAmount = 0,
  id,
  userType,
  receivedPayment = false,
}) => {
  const { loading } = useSelector((state) => state.appWalletReducer);

  const dispatch = useDispatch();

  const [settleAmount, setSettleAmount] = useState("");

  useEffect(() => {
    setSettleAmount(unSettleAmount);
  }, []);

  const submitSettleAmount = (e) => {
    e.preventDefault();
    if (settleAmount <= 0) {
      return successMsg(
        "Please enter a valid amount to settle the transaction",
        "error"
      );
    } else if (settleAmount > unSettleAmount) {
      return successMsg(
        "Settle amount should be less than unsettled amount",
        "error"
      );
    } else {
      submitData();
    }

    submitData();
  };

  const submitData = () => {
    if (userType === "shop") {
      dispatch(
        shopMakePayment({
          shopId: id,
          amount: settleAmount,
        })
      );
    } else {
      if (receivedPayment) {
        dispatch(
          riderReceivedPayment({
            deliveryBoyId: id,
            amount: settleAmount,
          })
        );
      } else {
        dispatch(
          riderMakePayment({
            deliveryBoyId: id,
            amount: settleAmount,
          })
        );
      }
    }
  };

  return (
    <div>
      <Form className="mb-4" onSubmit={submitSettleAmount}>
        <TextField
          style={{ width: "100%" }}
          id="outlined-basic"
          label="Amount"
          type="number"
          variant="outlined"
          placeholder="Enter settle amount"
          value={settleAmount}
          onChange={(e) => setSettleAmount(e.target.value)}
          required
        />

        <div className="mt-3 d-flex justify-content-end">
          <Button
            type="submit"
            color="success"
            value={settleAmount}
            disabled={loading}
          >
            {loading ? "Paying.." : "Pay"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default MakePayment;
