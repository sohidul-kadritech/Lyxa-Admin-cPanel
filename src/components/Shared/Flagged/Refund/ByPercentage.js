/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import { isFinite } from 'lodash';
import React, { useEffect, useState } from 'react';
import { getSuccessMessage } from '../helpers';
import { CustomInputField } from './CustomInputField';
import StyledInputForRefundPercentage from './StyledInputForRefundPercentage';
import { getMaxForPartialPaymentModified, getMaxLimit } from './helpers';

const initialData = (flaggData) => {
  const template = {
    adminOrderRefund: '',
    adminDeliveryRefund: '',
    shop: '',
  };

  const { partialPayment, totalSelectedAmount, replacementOrderCut } = flaggData;

  if (isFinite(100 / totalSelectedAmount) && flaggData?.replacement === 'without') {
    template.adminOrderRefund = Number(
      ((100 / totalSelectedAmount) * Number(partialPayment.adminOrderRefund || 0)).toFixed(2),
    );
    template.adminDeliveryRefund = Number(
      ((100 / totalSelectedAmount) * Number(partialPayment.adminDeliveryRefund || 0)).toFixed(2),
    );
    template.shop = Number(((100 / totalSelectedAmount) * Number(partialPayment.shop || 0)).toFixed(2));
  }

  if (isFinite(100 / totalSelectedAmount) && flaggData?.replacement === 'with') {
    template.adminOrderRefund = Number(
      ((100 / totalSelectedAmount) * Number(replacementOrderCut.baseCurrency_adminCutForReplacement || 0)).toFixed(2),
    );
    template.adminDeliveryRefund = Number(
      ((100 / totalSelectedAmount) * partialPayment.adminDeliveryRefund).toFixed(2),
    );
    template.shop = Number(
      ((100 / totalSelectedAmount) * Number(replacementOrderCut.baseCurrency_shopCutForReplacement || 0)).toFixed(2),
    );
  }

  return template;
};

function ByPercentage({ flaggData, setFlaggData, order }) {
  const [maxAmount, setMaxAmount] = useState(getMaxLimit(flaggData, order));

  const [byPercentage, setByPercentage] = useState(initialData(flaggData));

  useEffect(() => {
    setMaxAmount(getMaxLimit(flaggData, order));
    setByPercentage({
      adminOrderRefund: '',
      adminDeliveryRefund: '',
      shop: '',
    });
  }, [flaggData?.selectedItems, flaggData?.totalSelectedAmount]);

  const onChangeHandler = (e) => {
    setByPercentage((prev) => {
      // check maxium value
      const maxValue = Number(maxAmount[e.target.name]);
      const newValue = Number(e.target.value);
      const updatedNewValue = newValue > maxValue ? maxValue : newValue >= 0 ? newValue : '';

      const updatedValue = { ...prev, [e.target.name]: updatedNewValue };

      getSuccessMessage(e.target.name, newValue, maxValue, 'refund');

      const distributedPayment = getMaxForPartialPaymentModified(flaggData, order, updatedValue, e.target.name);
      // const distributedPayment = getMaxForPartialPayment(flaggData, order, updatedValue, e.target.name);

      //  updated flagged data
      setFlaggData((prev) => ({
        ...prev,
        byPercentage: {
          ...distributedPayment.percentage,
          [e.target.name]: updatedNewValue,
        },
        partialPayment: distributedPayment.initialMax,
      }));

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
      const newValue = Number(e.target.value);
      const updatedNewValue = newValue > maxValue ? maxValue : newValue > 0 ? newValue : '';
      getSuccessMessage(e.target.name, newValue, maxValue, 'replacement');
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
        byPercentage: { ...updatedValue },
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
              value:
                flaggData?.replacement === 'with'
                  ? flaggData?.replacementOrderCut?.baseCurrency_shopCutForReplacement
                  : flaggData?.partialPayment?.shop,
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
              value:
                flaggData?.replacement === 'with'
                  ? flaggData?.replacementOrderCut?.baseCurrency_adminCutForReplacement
                  : flaggData?.partialPayment?.adminOrderRefund,
              type: 'number',
              readOnly: true,
            }}
          />
        </Stack>
      </StyledInputForRefundPercentage>
      {flaggData?.replacement !== 'with' && order?.orderFor !== 'specific' && (
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
