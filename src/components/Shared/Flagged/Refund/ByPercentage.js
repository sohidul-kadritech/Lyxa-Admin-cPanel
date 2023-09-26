/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { CustomInputField } from './CustomInputField';
import StyledInputForRefundPercentage from './StyledInputForRefundPercentage';
import { getMaxForPartialPayment, getMaxLimit } from './helpers';

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
function ByPercentage({ flaggData, setFlaggData, order }) {
  const [maxAmount, setMaxAmount] = useState(getMaxLimit(flaggData, order));

  const [byPercentage, setByPercentage] = useState(initialData);

  const onChangeHandler = (e) => {
    setByPercentage((prev) => {
      // check maxium value
      const maxValue = Number(maxAmount[e.target.name]);
      const newValue = Number(e.target.value);
      const updatedNewValue = newValue > maxValue ? maxValue : newValue > 0 ? newValue : 0;

      const updatedValue = { ...prev, [e.target.name]: updatedNewValue };

      const distributedPayment = getMaxForPartialPayment(flaggData, order, updatedValue, e.target.name);
      //  updated flagged data
      setFlaggData((prev) => ({ ...prev, partialPayment: distributedPayment.initialMax }));

      return {
        ...distributedPayment.percentage,
        [e.target.name]: updatedNewValue,
      };
    });
  };

  return (
    <Stack direction="row" gap={2.5}>
      <StyledInputForRefundPercentage title="Shop Profit">
        <Stack direction="row" alignItems="center" gap={2.5}>
          <CustomInputField
            endAdornment="%"
            inputProps={{
              type: 'number',
              name: 'shop',
              value: byPercentage?.shop,
              onChange: onChangeHandler,
            }}
          />
          <span>=</span>
          <CustomInputField
            sx={{
              '& .MuiInputBase-root': {
                background: '#E1E3E5 !important',
              },
            }}
            endAdornment="$"
            inputProps={{
              value: flaggData?.partialPayment?.shop,
              type: 'number',
              readOnly: true,
            }}
          />
        </Stack>
      </StyledInputForRefundPercentage>
      <StyledInputForRefundPercentage title="Lyxa Profit">
        <Stack direction="row" alignItems="center" gap={2.5}>
          <CustomInputField
            endAdornment="%"
            sx={{
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
          <span>=</span>
          <CustomInputField
            sx={{
              '& .MuiInputBase-root': {
                background: '#E1E3E5 !important',
              },
            }}
            endAdornment="$"
            inputProps={{
              value: flaggData?.partialPayment?.adminOrderRefund,
              type: 'number',
              readOnly: true,
            }}
          />
        </Stack>
      </StyledInputForRefundPercentage>
      <StyledInputForRefundPercentage title="Lyxa Delivery Profit">
        <Stack direction="row" alignItems="center" gap={2.5}>
          <CustomInputField
            endAdornment="%"
            sx={{
              '& .MuiInputBase-root': {
                background: flaggData?.selectedItems?.find((item) => item?.id === 'delivery_fee')
                  ? '#F6F8FA !important'
                  : '#E1E3E5 !important',
              },
            }}
            inputProps={{
              value: byPercentage?.adminDeliveryRefund,
              name: 'adminDeliveryRefund',
              type: 'number',
              onChange: onChangeHandler,
              readOnly: !flaggData?.selectedItems?.find((item) => item?.id === 'delivery_fee'),
            }}
          />
          <span>=</span>
          <CustomInputField
            sx={{
              '& .MuiInputBase-root': {
                background: '#E1E3E5 !important',
              },
            }}
            endAdornment="$"
            inputProps={{
              value: flaggData?.partialPayment?.adminDeliveryRefund,
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
