import { Tooltip } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { ReactComponent as InfoIcon } from '../../assets/icons/info.svg';
import StyledFormField from '../../components/Form/StyledFormField';

function CustomToolTip({ tooltip }) {
  return (
    <Tooltip arrow title={tooltip}>
      <InfoIcon />
    </Tooltip>
  );
}

function RefundOrder({ orderPayment, orderCancel, updateRefundAmount }) {
  const CancelOrderRefunds = styled.div`
    padding-bottom: 10px;
    .refund_item_wrapper {
      margin-bottom: 5px;
      display: flex;
      align-items: center;

      .refund_input {
        width: 180px;
        margin-right: 20px;
      }
    }
  `;
  return (
    <CancelOrderRefunds>
      {/* <input
        type="number"
        className="form-control refund_input"
        placeholder="Enter Admin Amount"
        min={0}
        max={orderPayment?.admin}
        onChange={updateRefundAmount}
        name="admin"
        value={orderCancel?.partialPayment?.admin}
      /> */}
      <StyledFormField
        label={
          <span>
            {' '}
            <CustomToolTip tooltip="hello" /> Lyxa Earning: {orderPayment?.admin}
          </span>
        }
        intputType="text"
        containerProps={{
          sx: {
            padding: '14px 0px 23px 0',
            flex: '1',
          },
        }}
        inputProps={{
          value: orderCancel?.partialPayment?.admin,
          min: 0,
          type: 'number',
          name: 'admin',
          placeholder: 'Enter Admin Amount',
          onChange: updateRefundAmount,
        }}
      />
      {/* <span>Lyxa Earning: {orderPayment?.admin}</span> */}

      {orderCancel?.shop?._id && (
        <div className="refund_item_wrapper">
          {/* <input
          type="number"
          className="form-control refund_input"
          placeholder="Enter Shop Amount"
          min={0}
          max={orderPayment?.shop}
          onChange={updateRefundAmount}
          name="shop"
          value={orderCancel?.partialPayment?.shop}
        />
        <span>Shop Earning: {orderPayment?.shop}</span> */}
          <StyledFormField
            label={
              <span>
                <CustomToolTip tooltip="hello" /> Shop Earning: {orderPayment?.shop}
              </span>
            }
            intputType="text"
            containerProps={{
              sx: {
                padding: '14px 0px 23px 0',
                flex: '1',
              },
            }}
            inputProps={{
              value: orderCancel?.partialPayment?.shop,
              type: 'number',
              min: 0,
              name: 'shop',
              placeholder: 'Enter Shop Amount',
              onChange: updateRefundAmount,
            }}
          />
        </div>
      )}
    </CancelOrderRefunds>
  );
}

export default RefundOrder;
