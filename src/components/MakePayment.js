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
import styled from "styled-components";

const MakePayment = ({ unSettleAmount = 0, id, userType }) => {
  const { loading } = useSelector((state) => state.appWalletReducer);

  const dispatch = useDispatch();

  const [settleAmount, setSettleAmount] = useState("");

  useEffect(() => {
    setSettleAmount(unSettleAmount);
  }, []);

  const submitSettleAmount = (e) => {
    e.preventDefault();
    //  if (settleAmount > unSettleAmount) {
    //   return successMsg(
    //     "Settle amount should be less than unsettled amount",
    //     "error"
    //   );
    // } else {

    // }
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
      dispatch(
        riderMakePayment({
          deliveryBoyId: id,
          amount: settleAmount,
        })
      );
      // if (receivedPayment) {
      //   dispatch(
      //     riderReceivedPayment({
      //       deliveryBoyId: id,
      //       amount: settleAmount,
      //     })
      //   );
      // } else {

      // }
    }
  };

  return (
    <div>
      <Form className="mb-4" onSubmit={submitSettleAmount}>
        <TextField
          style={{ width: "100%" }}
          id="outlined-basic"
          label="Settle Amount"
          type="number"
          variant="outlined"
          placeholder="Enter settle amount"
          value={settleAmount}
          onChange={(e) => setSettleAmount(e.target.value)}
          required
        />

        <SummaryWrapper>
          <div className="item">
            <span className="title">Total Unsettled Amount: </span>
            <span
              className="title"
              style={{ color: unSettleAmount < 0 ? "red" : "black" }}
            >
              {unSettleAmount} NGN
            </span>
          </div>
          <div className="item">
            <span className="title">Settle Amount: </span>
            <span
              className="title"
              style={{ color: settleAmount < 0 ? "red" : "black" }}
            >
              {settleAmount} NGN
            </span>
          </div>
          <div className="item remaining">
            <span className="title">Remaining Unsettled Amount: </span>
            <span
              className="title"
              style={{
                color: unSettleAmount - settleAmount < 0 ? "red" : "black",
              }}
            >
              {unSettleAmount - settleAmount} NGN
            </span>
          </div>
        </SummaryWrapper>

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

const SummaryWrapper = styled.div`
  padding: 20px 0px 0px 0px;
  margin-bottom: 15px;

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.remaining {
      border-top: 1px solid lightgray;
      margin-top: 10px;
    }
  }

  .title {
    font-size: 15px;
    font-weight: 400;
  }
`;

export default MakePayment;
