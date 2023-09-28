/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CustomInputField } from './CustomInputField';
import StyledInputForRefundPercentage from './StyledInputForRefundPercentage';
import { getMaxForPartialPayment, getMaxLimit } from './helpers';

const initialData = {
  shop: 0,
  adminOrderRefund: 0,
  adminDeliveryRefund: 0,
};

function ByPercentage({ flaggData, setFlaggData, order }) {
  const [maxAmount, setMaxAmount] = useState(getMaxLimit(flaggData, order));

  const [byPercentage, setByPercentage] = useState(initialData);

  useEffect(() => {
    setMaxAmount(getMaxLimit(flaggData, order));
  }, [flaggData]);

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

  const onChangeHandlerForReplacement = (e) => {
    setByPercentage((prev) => {
      // check maxium value
      const maxValue = Number(maxAmount[e.target.name]);
      console.log('maxValue ==>', maxValue);
      const newValue = Number(e.target.value);
      const updatedNewValue = newValue > maxValue ? maxValue : newValue > 0 ? newValue : 0;

      const remaingPercentage = 100 - updatedNewValue;

      const baseCurrency_shopCutForReplacement = (
        flaggData?.totalSelectedAmount *
        (Number(updatedNewValue) / 100)
      ).toFixed(2);
      const baseCurrency_adminCutForReplacement = (
        flaggData?.totalSelectedAmount *
        (Number(remaingPercentage) / 100)
      ).toFixed(2);

      const updatedValue = { ...prev, adminOrderRefund: remaingPercentage, [e.target.name]: updatedNewValue };

      setFlaggData((prev) => ({
        ...prev,
        replacementOrderCut: {
          ...prev?.replacementOrderCut,
          baseCurrency_shopCutForReplacement,
          baseCurrency_adminCutForReplacement,
        },
      }));

      return { ...updatedValue };
    });
  };

  return (
    <Stack direction="row" gap={2.5}>
      <StyledInputForRefundPercentage title={flaggData?.replacement === 'with' ? 'Shop' : 'Shop profit'}>
        <Stack direction="row" alignItems="center" gap={2.5}>
          <CustomInputField
            endAdornment="%"
            inputProps={{
              type: 'number',
              name: 'shop',
              value: byPercentage?.shop,
              onChange: flaggData?.replacement === 'with' ? onChangeHandlerForReplacement : onChangeHandler,
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
      <StyledInputForRefundPercentage title={flaggData?.replacement === 'with' ? 'Lyxa' : 'Lyxa Profit'}>
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
              onChange: flaggData?.replacement === 'with' ? onChangeHandlerForReplacement : onChangeHandler,
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
      {flaggData?.replacement !== 'with' && (
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
                onChange: flaggData?.replacement === 'with' ? onChangeHandlerForReplacement : onChangeHandler,
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
      )}
    </Stack>
  );
}

export default ByPercentage;
