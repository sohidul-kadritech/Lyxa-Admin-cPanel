/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    setMaxAmount(getMaxLimit(flaggData, order, false));
  }, [flaggData]);

  const onChangeHandler = (e) => {
    setFlaggData((prev) => {
      const maxValue = Number(maxAmount[e.target.name]);
      console.log({ maxAmount });
      const newValue = Number(e.target.value);
      const updatedNewValue = newValue > maxValue ? maxValue : newValue >= 0 ? newValue : '';

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

  const onChangeHandlerForReplacement = (e) => {
    setFlaggData((prev) => {
      const updatedNewValue =
        Number(e.target.value) <= flaggData?.deliveryfee
          ? Number(e.target.value) < 0
            ? ''
            : Number(e.target.value)
          : flaggData?.deliveryfee;

      const baseCurrency_adminCutForReplacement = flaggData?.totalSelectedAmount - Number(updatedNewValue);

      return {
        ...prev,
        replacementOrderCut: {
          ...prev?.replacementOrderCut,
          baseCurrency_adminCutForReplacement,
          [e.target.name]: updatedNewValue,
        },
      };
    });
  };

  return (
    <Stack direction="row" gap={2.5}>
      <StyledInputForRefundPercentage
        title={flaggData?.replacement === 'with' ? 'Shop' : 'Shop profit'}
        sx={{ flex: 1 }}
      >
        <CustomInputField
          endAdornment="$"
          inputProps={{
            value:
              flaggData?.replacement === 'with'
                ? flaggData?.replacementOrderCut?.baseCurrency_shopCutForReplacement
                : flaggData?.partialPayment?.shop,
            name: flaggData?.replacement === 'with' ? 'baseCurrency_shopCutForReplacement' : 'shop',
            type: 'number',
            onChange: flaggData?.replacement === 'with' ? onChangeHandlerForReplacement : onChangeHandler,
          }}
        />
      </StyledInputForRefundPercentage>
      <StyledInputForRefundPercentage
        title={flaggData?.replacement === 'with' ? 'Lyxa' : 'Lyxa Profit'}
        sx={{ flex: 1 }}
      >
        <CustomInputField
          endAdornment="$"
          sx={{
            '& .MuiInputBase-root': {
              background: '#E1E3E5 !important',
            },
          }}
          inputProps={{
            value:
              flaggData?.replacement === 'with'
                ? flaggData?.replacementOrderCut?.baseCurrency_adminCutForReplacement
                : flaggData?.partialPayment?.adminOrderRefund,
            name: flaggData?.replacement === 'with' ? 'baseCurrency_shopCutForReplacement' : 'adminOrderRefund',

            type: 'number',
            onChange: flaggData?.replacement === 'with' ? onChangeHandlerForReplacement : onChangeHandler,
            readOnly: true,
          }}
        />
      </StyledInputForRefundPercentage>
      {/* Lyxa delivery profit */}
      {flaggData?.replacement !== 'with' && order?.orderFor !== 'specific' && (
        <StyledInputForRefundPercentage title="Lyxa Delivery Profit" sx={{ flex: 1 }}>
          <CustomInputField
            endAdornment="$"
            inputProps={{
              value: flaggData?.partialPayment?.adminDeliveryRefund,
              name: 'adminDeliveryRefund',
              type: 'number',
              onChange: flaggData?.replacement === 'with' ? onChangeHandlerForReplacement : onChangeHandler,
            }}
          />
        </StyledInputForRefundPercentage>
      )}
    </Stack>
  );
}

export default ByPrice;
