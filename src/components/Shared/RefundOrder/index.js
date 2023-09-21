/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { TitleWithToolTip, getRefundedVatForAdmin } from '../../../pages/NewOrder/helpers';
import CloseButton from '../../Common/CloseButton';
import StyledFormField from '../../Form/StyledFormField';
import StyledRadioGroup from '../../Styled/StyledRadioGroup';
import {
  getNewRefundMaxAmounts,
  getRefundMaxAmounts,
  getTotalRefundAmount,
  refundDataInit,
  refundTypeOptions,
  validateRefundData,
} from './helpers';

export default function RefundOrder({ onClose, order, refetchApi = Api.ORDER_LIST }) {
  const queryClient = useQueryClient();

  const { general } = useGlobalContext();
  const vatPercentage = general?.appSetting?.vat;

  const [render, setRender] = useState(false);

  const [maxAmounts, setMaxAmounts] = useState(getRefundMaxAmounts(order));
  const [earning, setEarning] = useState(getRefundMaxAmounts(order));
  const [refundData, setRefundData] = useState({ ...refundDataInit, orderId: order._id });

  const updateRefundAmount = (e) => {
    const { name, value } = e.target;

    const adminOrderRefund =
      name === 'adminOrderRefund'
        ? value > maxAmounts[name]
          ? maxAmounts[name]
          : value || 0
        : refundData?.partialPayment?.adminOrderRefund;
    const adminDeliveryRefund =
      name === 'adminDeliveryRefund'
        ? value > maxAmounts[name]
          ? maxAmounts[name]
          : value || 0
        : refundData?.partialPayment?.adminDeliveryRefund;

    const adminVat = getRefundedVatForAdmin(
      maxAmounts.adminVat,
      Number(adminDeliveryRefund) + Number(adminOrderRefund),
      vatPercentage,
    );

    const tempMax = getNewRefundMaxAmounts(
      order,
      {
        ...refundData,
        vatPercentage,
        partialPayment: {
          ...refundData?.partialPayment,
          adminVat,
          [name]: value > maxAmounts[name] ? maxAmounts[name] : value || 0,
        },
      },
      maxAmounts,
      earning,
      name,
      value,
    );

    setMaxAmounts((prev) => {
      const data = tempMax;
      return data;
    });

    console.log('tempMax', tempMax);

    if (value > tempMax[name]) {
      setRefundData((prev) => ({ ...prev, partialPayment: { ...prev.partialPayment, [name]: tempMax[name] } }));
    } else {
      setRefundData((prev) => ({ ...prev, partialPayment: { ...prev.partialPayment, [name]: value > 0 ? value : 0 } }));
    }
  };

  // secondary currency
  const shopExchangeRate = order?.shopExchangeRate;
  const secondaryCurrency = order?.secondaryCurrency?.code;
  const baseCurrency = order?.baseCurrency?.symbol;
  const adminExchangeRate = order?.adminExchangeRate;
  const isSecondaryCurrencyEnabled = order?.shopExchangeRate > 0;

  // data will update every time react re-renders
  const secondaryValues = {
    shop: Number(refundData?.partialPayment?.shop) * shopExchangeRate,
    adminOrderProfit: Number(refundData?.partialPayment?.adminOrderRefund) * shopExchangeRate,
    adminRiderProfit: Number(refundData?.partialPayment?.adminDeliveryRefund) * adminExchangeRate,
    adminVat: Number(refundData?.partialPayment?.adminVat) * shopExchangeRate,
  };

  // total amount showed
  const { base: totalRefundAmount, secondary: totalRefundSecondary } = getTotalRefundAmount({
    refundData,
    maxAmounts,
    secondaryValues,
  });

  // updates vat amount when order or delivery cut changed

  useEffect(() => {
    const adminVat = getRefundedVatForAdmin(
      maxAmounts.adminVat,
      Number(refundData?.partialPayment?.adminOrderRefund) + Number(refundData?.partialPayment?.adminDeliveryRefund),
      vatPercentage,
    );

    if (refundData?.refundType === 'full') {
      setRefundData((prev) => ({
        ...prev,
        ...refundDataInit,
      }));
      setMaxAmounts(getRefundMaxAmounts(order));
    } else {
      if (!render) {
        setMaxAmounts(getNewRefundMaxAmounts(order, refundData, maxAmounts, earning));
        setRender(true);
      }
      setRefundData((prev) => ({
        ...prev,
        partialPayment: {
          ...prev.partialPayment,
          adminVat,
        },
      }));
    }

    // setMaxAmounts((prev)=>{})
  }, [
    refundData?.refundType,
    refundData?.partialPayment?.adminOrderRefund,
    refundData?.partialPayment?.adminDeliveryRefund,
    refundData?.partialPayment?.shop,
  ]);

  // update mutation
  const mutation = useMutation((data) => AXIOS.post(Api.REFUND_ORDER, data), {
    onSuccess: (data) => {
      successMsg(data.message, data.status ? 'success' : undefined);
      if (data.status) {
        queryClient.invalidateQueries(refetchApi);
        onClose();
      }
    },
    onError: (error) => {
      console.log(error);
      successMsg('Server error !', 'error');
    },
  });

  const submitRefund = () => {
    if (refundData?.refundType === 'full') {
      mutation.mutate({
        ...refundData,
        partialPayment: maxAmounts,
      });

      return;
    }

    const data = validateRefundData(refundData, maxAmounts);

    if (data.error) {
      successMsg(data.msg);
    }

    console.log('data refund', data);

    mutation.mutate({ ...data, orderId: order?._id });
  };

  return (
    <Box
      sx={{
        padding: '15px 20px 20px',
        minWidth: 'max(38vw, 600px)',
        background: '#fff',
        position: 'relative',
        borderRadius: '8px',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
        <Typography fontSize="18px" variant="h4">
          Refund Order
        </Typography>
        <CloseButton onClick={onClose} size="sm" />
      </Stack>

      <StyledRadioGroup
        items={refundTypeOptions(order)}
        value={refundData?.refundType}
        onChange={(e) => setRefundData((prev) => ({ ...prev, refundType: e.target.value }))}
        sx={{
          flexDirection: 'row',
          gap: '25px',
          pb: 7.5,
        }}
      />

      {refundData?.refundType === 'partial' && (
        <Box
          pb={7}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            '& >*:first-of-type': {
              paddingTop: 0,
            },
          }}
        >
          {/* Order Refund */}
          {earning?.adminOrderRefund > 0 && (
            <Box>
              <StyledFormField
                intputType="text"
                labelComponent={
                  <TitleWithToolTip
                    title={`Lyxa Order Refund: ${(earning?.adminOrderRefund || 0)?.toFixed(2)}`}
                    tooltip="Lyxa Order Profit"
                  />
                }
                inputProps={{
                  value: refundData?.partialPayment?.adminOrderRefund,
                  type: 'number',
                  name: 'adminOrderRefund',
                  placeholder: 'Enter Amount',
                  onChange: updateRefundAmount,
                }}
              />

              {isSecondaryCurrencyEnabled && (
                <Typography mt="-8px" variant="body3" display="block">
                  Equivalent Price: {secondaryCurrency}{' '}
                  {Number(refundData?.partialPayment?.adminOrderRefund) * shopExchangeRate}
                </Typography>
              )}
            </Box>
          )}

          {/* Delivery Refund */}
          {earning?.adminDeliveryRefund > 0 && (
            <Box>
              <StyledFormField
                labelComponent={
                  <TitleWithToolTip
                    title={`Lyxa Delivery Refund: ${(earning?.adminDeliveryRefund || 0)?.toFixed(2)}`}
                    tooltip="Lyxa Delivery Profit"
                  />
                }
                intputType="text"
                inputProps={{
                  value: refundData?.partialPayment?.adminDeliveryRefund,
                  type: 'number',
                  name: 'adminDeliveryRefund',
                  placeholder: 'Enter Amount',
                  onChange: updateRefundAmount,
                }}
              />
              {isSecondaryCurrencyEnabled && (
                <Typography mt="-8px" variant="body3" display="block">
                  Equivalent Price: {secondaryCurrency}{' '}
                  {Number(refundData?.partialPayment?.adminDeliveryRefund) * adminExchangeRate}
                </Typography>
              )}
            </Box>
          )}

          {/* Shop Profit */}
          {earning?.shop > 0 && (
            <Box>
              <StyledFormField
                labelComponent={
                  <TitleWithToolTip
                    title={`Shop Refund: ${(earning?.shop || 0)?.toFixed(2)}`}
                    tooltip="Shop Earning + Shop VAT"
                  />
                }
                intputType="text"
                inputProps={{
                  value: refundData?.partialPayment?.shop,
                  type: 'number',
                  name: 'shop',
                  placeholder: 'Enter Amount',
                  onChange: updateRefundAmount,
                }}
              />
              {isSecondaryCurrencyEnabled && (
                <Typography mt="-8px" variant="body3" display="block">
                  Equivalent Price: {secondaryCurrency} {Number(refundData?.partialPayment?.shop) * shopExchangeRate}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}

      {refundData?.refundType === 'partial' && (
        <TitleWithToolTip
          sx={{ pb: 4 }}
          title={`Total Admin Vat: ${
            isSecondaryCurrencyEnabled
              ? `${secondaryCurrency} ${Math.round(refundData?.partialPayment?.adminVat * shopExchangeRate)} ~ `
              : ''
          } ${baseCurrency} ${(refundData?.partialPayment?.adminVat || 0)?.toFixed(2)}
          `}
        />
      )}

      <TitleWithToolTip
        title={`Total Refund Amount: ${
          isSecondaryCurrencyEnabled ? `${secondaryCurrency} ${Math.round(totalRefundSecondary)} ~ ` : ''
        } ${baseCurrency} ${(totalRefundAmount || 0)?.toFixed(2)}`}
        tooltip="Lyxa Earning + Lyxa VAT + Shop Earning + Shop VAT + Rider Earning + Rider VAT"
      />

      <Box sx={{ textAlign: 'right', pt: 8 }}>
        <Button
          color="primary"
          variant="contained"
          sx={{ width: '200px' }}
          onClick={submitRefund}
          disabled={mutation.isLoading}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
}
