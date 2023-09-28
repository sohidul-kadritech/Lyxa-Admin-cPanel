/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { CustomInputField } from '../Refund/CustomInputField';
import StyledInputForRefundPercentage from '../Refund/StyledInputForRefundPercentage';

export const initialData = {
  shop: 0,
  adminOrderRefund: 0,
  adminDeliveryRefund: 0,
};

function ByPrice({ cancelOrderData, setCancelOrderData, order }) {
  const [maxAmount, setMaxAmount] = useState();

  const [byPrice, setByPrice] = useState(initialData);

  const onChangeHandler = (e) => {
    setCancelOrderData((prev) => {
      const totalSelectedAmount = prev?.totalSelectedAmount;

      const newValue =
        Number(e.target.value) < 0
          ? 0
          : Number(e.target.value) > totalSelectedAmount
          ? totalSelectedAmount
          : e.target.value;

      const baseCurrency_adminLoss = totalSelectedAmount - newValue;
      return {
        ...prev,
        endorseLoss: { ...prev?.endorseLoss, baseCurrency_adminLoss, [e.target.name]: newValue },
      };
    });
  };

  return (
    <Stack direction="row" gap={2.5}>
      <StyledInputForRefundPercentage title="Shop" sx={{ flex: 1 }}>
        <CustomInputField
          endAdornment="$"
          inputProps={{
            value: cancelOrderData?.endorseloss?.baseCurrency_shopLoss,
            name: 'baseCurrency_shopLoss',
            type: 'number',
            onChange: onChangeHandler,
          }}
        />
      </StyledInputForRefundPercentage>
      <StyledInputForRefundPercentage title="Lyxa" sx={{ flex: 1 }}>
        <CustomInputField
          endAdornment="$"
          sx={{
            '& .MuiInputBase-root': {
              background: '#E1E3E5 !important',
            },
          }}
          inputProps={{
            value: cancelOrderData?.endorseLoss?.baseCurrency_adminLoss,
            name: 'baseCurrency_adminLoss',
            type: 'number',
            onChange: onChangeHandler,
            readOnly: true,
          }}
        />
      </StyledInputForRefundPercentage>
    </Stack>
  );
}

export default ByPrice;
