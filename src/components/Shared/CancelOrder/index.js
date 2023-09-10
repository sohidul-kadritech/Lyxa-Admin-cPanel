/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import socketServices from '../../../common/socketService';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { TitleWithToolTip, getRefundedVatForAdmin } from '../../../pages/NewOrder/helpers';
import CloseButton from '../../Common/CloseButton';
import StyledFormField from '../../Form/StyledFormField';
import StyledCheckbox from '../../Styled/StyledCheckbox';
import StyledRadioGroup from '../../Styled/StyledRadioGroup';
import {
  createCancelOrderPayload,
  getCancelOrderInit,
  getCancelRefundTypeOptions,
  getRefundMaxAmounts,
  getTotalRefundAmount,
  validateCancelData,
} from './helpers';

export default function CancelOrder({ onClose, currentOrder, onSuccess, refetchApiKey = Api.ORDER_LIST, order }) {
  const queryClient = useQueryClient();
  const { general } = useGlobalContext();
  const vatPercentage = general?.appSetting?.vat;

  const [cancelData, setCancelData] = useState(getCancelOrderInit(order));
  const [maxAmounts, setMaxAmounts] = useState(getRefundMaxAmounts(order));
  const [isOtherReason, setIsOtherReason] = useState(false);

  const cancelReasonQuery = useQuery([Api.ALL_ORDER_CANCEL_REASON], () => AXIOS.get(Api.ALL_ORDER_CANCEL_REASON));

  const butlerMutation = useMutation((data) => AXIOS.post(Api.BUTLER_CANCEL_ORDER, data), {
    onSuccess: (data) => {
      if (data.status) {
        if (onSuccess) onSuccess(data);
        socketServices?.emit('updateOrder', {
          orderId: data?.data?.order?._id,
        });
        onClose(false);
        queryClient.invalidateQueries(refetchApiKey);
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  const normalMutation = useMutation((data) => AXIOS.post(Api.CANCEL_ORDER, data, { params: { userType: 'admin' } }), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');

        socketServices?.emit('updateOrder', {
          orderId: data?.data?.order?._id,
        });

        if (onSuccess) onSuccess(data);
        queryClient.invalidateQueries(refetchApiKey);

        onClose();
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  const updateRefundAmount = (e) => {
    const { name, value } = e.target;

    if (value > maxAmounts[name]) {
      setCancelData((prev) => ({ ...prev, partialPayment: { ...prev.partialPayment, [name]: maxAmounts[name] } }));
    } else {
      setCancelData((prev) => ({ ...prev, partialPayment: { ...prev.partialPayment, [name]: value } }));
    }
  };

  const handleReasonTypeChange = (e) => {
    setIsOtherReason(e.target.checked);

    if (e.target.checked) {
      setCancelData((prev) => ({
        ...prev,
        cancelReasonId: null,
      }));
    } else {
      setCancelData((prev) => ({
        ...prev,
        otherReason: '',
      }));
    }
  };

  // secondary currency
  const shopExchangeRate = order?.shopExchangeRate;
  const secondaryCurrency = order?.secondaryCurrency?.code;
  const baseCurrency = order?.baseCurrency?.code;
  const adminExchangeRate = order?.adminExchangeRate;
  const isSecondaryCurrencyEnabled = order?.shopExchangeRate > 0;

  // data will update every time react re-renders
  const secondaryValues = {
    shop: Number(cancelData?.partialPayment?.shop) * shopExchangeRate,
    adminOrderProfit: Number(cancelData?.partialPayment?.adminOrderProfit) * shopExchangeRate,
    adminRiderProfit: Number(cancelData?.partialPayment?.adminRiderProfit) * adminExchangeRate,
    deliveryBoy: Number(cancelData?.partialPayment?.deliveryBoy) * adminExchangeRate,
    adminVat: Number(cancelData?.partialPayment?.adminVat) * shopExchangeRate,
  };

  const { base: totalRefundBase, secondary: totalRefundSecondary } = getTotalRefundAmount({
    maxAmounts,
    secondaryValues,
    cancelData,
    vatPercentage,
  });

  const submitCancel = () => {
    const validity = validateCancelData({ maxAmounts, cancelData, isOtherReason });

    if (validity.error) {
      successMsg(validity.msg);
      return;
    }

    const data = createCancelOrderPayload(cancelData);

    if (order?.isButler) {
      butlerMutation.mutate(data);
    } else {
      normalMutation.mutate(data);
    }
  };

  // calculate vat
  useEffect(() => {
    const adminVat = getRefundedVatForAdmin(
      maxAmounts?.adminVat,
      Number(cancelData?.partialPayment?.adminOrderProfit) +
        Number(cancelData?.partialPayment?.adminRiderProfit) +
        Number(cancelData?.partialPayment?.deliveryBoy),
      vatPercentage,
    );

    setCancelData((prev) => ({
      ...prev,
      partialPayment: {
        ...prev.partialPayment,
        adminVat,
      },
    }));
  }, [
    cancelData.partialPayment.adminOrderProfit,
    cancelData.partialPayment.adminRiderProfit,
    cancelData.partialPayment.deliveryBoy,
  ]);

  return (
    <Paper
      sx={{
        minWidth: 'max(38vw, 600px)',
        zIndex: '10 !important',
        maxHeight: '80vh',
        overflow: 'auto',
        borderRadius: '8px',
      }}
    >
      <Stack padding={5} gap={5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography fontSize="18px" variant="h4">
            Cancel Order
          </Typography>
          <CloseButton onClick={onClose} size="sm" />
        </Stack>

        {order?.paymentMethod !== 'cash' && (
          <StyledRadioGroup
            items={getCancelRefundTypeOptions(order)}
            value={cancelData.refundType}
            onChange={(e) => setCancelData((prev) => ({ ...prev, refundType: e.target.value }))}
            sx={{
              flexDirection: 'row',
              gap: '25px',
            }}
          />
        )}

        <Stack direction="row" alignItems="center">
          <StyledCheckbox
            disableRipple
            checked={isOtherReason}
            onChange={handleReasonTypeChange}
            sx={{
              '&.MuiCheckbox-root': {
                paddingLeft: 0,
              },
            }}
          />
          <Typography variant="body4" color="initial">
            Other Reason
          </Typography>
        </Stack>

        {!isOtherReason && (
          <StyledFormField
            label="Select Cancel Reason"
            intputType="autocomplete"
            containerProps={{
              sx: { padding: 0 },
            }}
            inputProps={{
              placeholder: 'Choose Reason',
              disabled: isOtherReason,
              fullWidth: true,
              getOptionLabel: (option) => option?.name || 'Choose',
              maxHeight: '300px',
              options: cancelReasonQuery?.data?.data?.cancelReason || [],
              value: cancelData.cancelReasonId,
              isOptionEqualToValue: (option, value) => option?._id === value?._id,
              onChange: (e, v) => {
                setCancelData((prev) => ({
                  ...prev,
                  cancelReasonId: v,
                }));
              },
              sx: {
                '&:has(.MuiInputBase-input:focus)': {
                  width: '100% !important',
                },
                flex: 1,
              },
            }}
          />
        )}

        {isOtherReason && (
          <StyledFormField
            label="Other Reason"
            intputType="text"
            containerProps={{
              sx: { padding: 0 },
            }}
            inputProps={{
              placeholder: 'Type Reason...',
              value: cancelData.otherReason,
              maxRows: 4,
              type: 'text',
              name: 'bank_name',
              onChange: (e) => {
                setCancelData((prev) => ({
                  ...prev,
                  otherReason: e.target.value,
                }));
              },
            }}
          />
        )}

        {cancelData?.refundType === 'partial' && (
          <Stack gap={7} pt={2} pb={2}>
            {maxAmounts?.adminOrderProfit > 0 && (
              <Box>
                <StyledFormField
                  labelComponent={
                    <TitleWithToolTip
                      title={`Lyxa Order Refund: ${maxAmounts?.adminOrderProfit}`}
                      tooltip="Lyxa Order Earning"
                    />
                  }
                  intputType="text"
                  containerProps={{
                    sx: {
                      padding: 0,
                    },
                  }}
                  inputProps={{
                    value: cancelData?.partialPayment?.adminOrderProfit,
                    type: 'number',
                    name: 'adminOrderProfit',
                    placeholder: 'Enter Amount',
                    onChange: updateRefundAmount,
                  }}
                />
                {isSecondaryCurrencyEnabled && (
                  <Typography variant="body3" display="block" pt={1}>
                    Equivalent Price: {secondaryCurrency} {secondaryValues.adminOrderProfit}
                  </Typography>
                )}
              </Box>
            )}

            {maxAmounts?.adminRiderProfit > 0 && (
              <Box>
                <StyledFormField
                  labelComponent={
                    <TitleWithToolTip
                      title={`Lyxa Rider Refund: ${maxAmounts?.adminRiderProfit}`}
                      tooltip="Lyxa Rider Earning"
                    />
                  }
                  intputType="text"
                  inputProps={{
                    value: cancelData?.partialPayment?.adminRiderProfit,
                    type: 'number',
                    name: 'adminRiderProfit',
                    placeholder: 'Enter Amount',
                    onChange: updateRefundAmount,
                  }}
                  containerProps={{
                    sx: {
                      padding: 0,
                    },
                  }}
                />
                {isSecondaryCurrencyEnabled && (
                  <Typography variant="body3" display="block" pt={1}>
                    Equivalent Price: {secondaryCurrency} {secondaryValues.adminRiderProfit}
                  </Typography>
                )}
              </Box>
            )}

            {!order?.isButler && (
              <Box>
                <StyledFormField
                  labelComponent={
                    <TitleWithToolTip title={`Shop Refund: ${maxAmounts?.shop}`} tooltip="Shop Earning + Shop VAT" />
                  }
                  intputType="text"
                  inputProps={{
                    value: cancelData?.partialPayment?.shop,
                    type: 'number',
                    name: 'shop',
                    placeholder: 'Enter Amount',
                    onChange: updateRefundAmount,
                  }}
                  containerProps={{
                    sx: {
                      padding: 0,
                    },
                  }}
                />
                {isSecondaryCurrencyEnabled && (
                  <Typography variant="body3" display="block" pt={1}>
                    Equivalent Price: {secondaryCurrency} {secondaryValues.shop}
                  </Typography>
                )}
              </Box>
            )}

            {order?.orderFor === 'global' && maxAmounts?.deliveryBoy > 0 && (
              <Box>
                <StyledFormField
                  labelComponent={
                    <TitleWithToolTip title={`Rider Earning: ${maxAmounts?.deliveryBoy}`} tooltip="Rider Profit" />
                  }
                  intputType="text"
                  inputProps={{
                    value: cancelData?.partialPayment?.deliveryBoy,
                    type: 'number',
                    name: 'deliveryBoy',
                    placeholder: 'Enter Amount',
                    onChange: updateRefundAmount,
                  }}
                  containerProps={{
                    sx: {
                      padding: 0,
                    },
                  }}
                />

                {isSecondaryCurrencyEnabled && (
                  <Typography variant="body3" display="block" pt={1}>
                    Equivalent Price: {secondaryCurrency} {secondaryValues.deliveryBoy}
                  </Typography>
                )}
              </Box>
            )}
          </Stack>
        )}

        {cancelData?.refundType === 'partial' && (
          <TitleWithToolTip
            title={`Total Admin Vat: ${baseCurrency} ${(cancelData?.partialPayment?.adminVat || 0)?.toFixed(2)} 
          ${isSecondaryCurrencyEnabled ? ` ~ ${secondaryCurrency} ${Math.round(secondaryValues.adminVat)}` : ''}
          `}
          />
        )}

        <TitleWithToolTip
          title={`Total Refund Amount: ${baseCurrency} ${totalRefundBase?.toFixed(2)}
          ${isSecondaryCurrencyEnabled ? ` ~ ${secondaryCurrency} ${Math.round(totalRefundSecondary)}` : ''}
          `}
          tooltip="Lyxa Earning + Lyxa Vat + Shop Earning + Shop VAT + Delivery Boy Earning"
        />

        <Box sx={{ textAlign: 'right', pt: 8 }}>
          <Button
            color="primary"
            variant="contained"
            sx={{ width: '200px' }}
            onClick={submitCancel}
            disabled={butlerMutation?.isLoading || normalMutation?.isLoading}
          >
            Confirm
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
