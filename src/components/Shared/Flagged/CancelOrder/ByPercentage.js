/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { CustomInputField } from '../Refund/CustomInputField';
import StyledInputForRefundPercentage from '../Refund/StyledInputForRefundPercentage';

const initialData = {
  shop: 0,
  adminOrderRefund: 0,
  adminDeliveryRefund: 0,
};
// baseCurrency_shopEarnings
// summary?.baseCurrency_riderFee
// adminCharge?.baseCurrency_adminChargeFromOrder
// delivery_fee
// selectedItems
function ByPercentage({ cancelOrderData, setCancelOrderData, order }) {
  // const [maxAmount, setMaxAmount] = useState(getMaxLimit(cancelOrderData, order));

  const [byPercentage, setByPercentage] = useState(initialData);

  const onChangeHandler = (e) => {
    setByPercentage((prev) => {
      const newValue = Number(e.target.value) < 0 ? 0 : Number(e.target.value) > 100 ? 100 : e.target.value;
      const adminOrderRefund = 100 - newValue;

      setCancelOrderData((prev) => {
        const totalSelectedAmount = prev?.totalSelectedAmount;
        const baseCurrency_adminLoss = (totalSelectedAmount * (adminOrderRefund / 100)).toFixed(2);
        const baseCurrency_shopLoss = (totalSelectedAmount * (newValue / 100)).toFixed(2);

        return { ...prev, endorseLoss: { ...prev?.endorseLoss, baseCurrency_shopLoss, baseCurrency_adminLoss } };
      });
      return {
        ...prev,
        adminOrderRefund,
        [e.target.name]: newValue,
      };
    });
  };

  return (
    <Stack direction="row" gap={2.5}>
      <StyledInputForRefundPercentage title="Shop" sx={{ flex: 1 }}>
        <Stack direction="row" alignItems="center" gap={2.5}>
          <CustomInputField
            endAdornment="%"
            sx={{ flex: 1 }}
            inputProps={{
              type: 'number',
              name: 'shop',
              value: byPercentage?.shop,
              onChange: onChangeHandler,
            }}
          />
        </Stack>
      </StyledInputForRefundPercentage>
      <StyledInputForRefundPercentage title="Lyxa" sx={{ flex: 1 }}>
        <Stack direction="row" alignItems="center" gap={2.5}>
          <CustomInputField
            endAdornment="%"
            sx={{
              flex: 1,
              '& .MuiInputBase-root': {
                background: '#E1E3E5 !important',
              },
            }}
            inputProps={{
              value: byPercentage?.adminOrderRefund,
              name: 'adminOrderRefund',
              onChange: onChangeHandler,
              type: 'number',
              readOnly: true,
            }}
          />
        </Stack>
      </StyledInputForRefundPercentage>
    </Stack>
  );
}

export default ByPercentage;
