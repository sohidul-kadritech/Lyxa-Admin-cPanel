/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { CustomInputField } from './CustomInputField';
import StyledInputForRefundPercentage from './StyledInputForRefundPercentage';
import { getMaxForPartialPaymentByPrice, getMaxLimit } from './helpers';

export const initialData = {
  shop: 0,
  adminOrderRefund: 0,
  adminDeliveryRefund: 0,
};

function ByPrice({ flaggData, setFlaggData, order }) {
  const [maxAmount, setMaxAmount] = useState(getMaxLimit(flaggData, order, false));

  const [byPrice, setByPrice] = useState(initialData);

  const onChangeHandler = (e) => {
    setFlaggData((prev) => {
      const maxValue = Number(maxAmount[e.target.name]);
      const newValue = Number(e.target.value);
      const updatedNewValue = newValue > maxValue ? maxValue : newValue > 0 ? newValue : 0;

      const tempPartialPayment = {
        ...prev,
        partialPayment: { ...prev?.partialPayment, [e.target.name]: updatedNewValue },
      };

      const updatedParitalPayment = getMaxForPartialPaymentByPrice(tempPartialPayment, order, e.target.name);

      console.log('max amount', { updatedParitalPayment });

      return {
        ...tempPartialPayment,
        partialPayment: { ...updatedParitalPayment, [e.target.name]: updatedNewValue },
      };
    });
  };

  return (
    <Stack direction="row" gap={2.5}>
      <StyledInputForRefundPercentage title="Shop Profit" sx={{ flex: 1 }}>
        <CustomInputField
          endAdornment="$"
          inputProps={{
            value: flaggData?.partialPayment?.shop,
            name: 'shop',
            type: 'number',
            onChange: onChangeHandler,
          }}
        />
      </StyledInputForRefundPercentage>
      <StyledInputForRefundPercentage title="Lyxa Profit" sx={{ flex: 1 }}>
        <CustomInputField
          endAdornment="$"
          sx={{
            '& .MuiInputBase-root': {
              background: '#E1E3E5 !important',
            },
          }}
          inputProps={{
            value: flaggData?.partialPayment?.adminOrderRefund,
            name: 'adminOrderRefund',
            type: 'number',
            onChange: onChangeHandler,
            readOnly: true,
          }}
        />
      </StyledInputForRefundPercentage>
      {/* Lyxa delivery profit */}
      <StyledInputForRefundPercentage title="Lyxa Delivery Profit" sx={{ flex: 1 }}>
        <CustomInputField
          endAdornment="$"
          inputProps={{
            value: flaggData?.partialPayment?.adminDeliveryRefund,
            name: 'adminDeliveryRefund',
            type: 'number',
            onChange: onChangeHandler,
          }}
        />
      </StyledInputForRefundPercentage>
    </Stack>
  );
}

export default ByPrice;
