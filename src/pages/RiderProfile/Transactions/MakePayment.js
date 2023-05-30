import { TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'reactstrap';
import styled from 'styled-components';
import { riderMakePayment, shopMakePayment } from '../../../store/appWallet/appWalletAction';

function MakePayment({ unSettleAmount = 0, id, userType }) {
  const dispatch = useDispatch();
  //   const [isFirst, setIsFirst] = useState(true);
  const { loading } = useSelector((state) => state.appWalletReducer);
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();
  const [settleAmount, setSettleAmount] = useState('');

  useEffect(() => {
    setSettleAmount(Math.abs(unSettleAmount));
  }, []);

  //   useEffect(() => {
  //     if (isFirst && !loading) {
  //       setIsFirst(false);
  //     } else {
  //       onClose();
  //     }
  //   }, [loading]);

  const submitData = () => {
    if (userType === 'shop') {
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
    }
  };

  const submitSettleAmount = (e) => {
    e.preventDefault();
    submitData();
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        minWidth: 'min(600px, 80vw)',
        padding: '30px 20px 0px 20px',
        borderRadius: '8px',
      }}
    >
      <Typography variant="h4" pb={10}>
        Make Payment
      </Typography>
      <Form className="mb-4" onSubmit={submitSettleAmount}>
        <TextField
          style={{ width: '100%' }}
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
            <span className="title" style={{ color: unSettleAmount < 0 ? 'red' : 'black' }}>
              {`${unSettleAmount} ${currency}`}
            </span>
          </div>
          <div className="item">
            <span className="title">Settle Amount: </span>
            <span className="title" style={{ color: settleAmount < 0 ? 'red' : 'black' }}>
              {`${settleAmount} ${currency}`}
            </span>
          </div>
          <div className="item remaining">
            <span className="title">Remaining Unsettled Amount: </span>
            <span
              className="title"
              style={{
                color: Math.abs(unSettleAmount) - Math.abs(settleAmount) < 0 ? 'red' : 'black',
              }}
            >
              {`${Math.abs(unSettleAmount) - Math.abs(settleAmount)} ${currency}`}
            </span>
          </div>
        </SummaryWrapper>

        <div className="mt-3 d-flex justify-content-end">
          <Button type="submit" color="success" value={settleAmount} disabled={loading}>
            {loading ? 'Paying..' : 'Pay'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

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
