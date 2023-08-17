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

  const [maxAmounts] = useState(getRefundMaxAmounts(order));
  const [refundData, setRefundData] = useState({ ...refundDataInit, orderId: order._id });

  const updateRefundAmount = (e) => {
    const { name, value } = e.target;

    if (value > maxAmounts[name]) {
      setRefundData((prev) => ({ ...prev, partialPayment: { ...prev.partialPayment, [name]: maxAmounts[name] } }));
    } else {
      setRefundData((prev) => ({ ...prev, partialPayment: { ...prev.partialPayment, [name]: value } }));
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
    shop: Number(refundData?.partialPayment?.shop) * shopExchangeRate,
    adminOrderProfit: Number(refundData?.partialPayment?.adminOrderProfit) * shopExchangeRate,
    adminRiderProfit: Number(refundData?.partialPayment?.adminRiderProfit) * adminExchangeRate,
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
      Number(refundData.partialPayment.adminOrderProfit) + Number(refundData.partialPayment.adminRiderProfit),
      vatPercentage
    );

    setRefundData((prev) => ({
      ...prev,
      partialPayment: {
        ...prev.partialPayment,
        adminVat,
      },
    }));
  }, [refundData.partialPayment.adminOrderProfit, refundData.partialPayment.adminRiderProfit]);

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
      successMsg('Sever error!', 'error');
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
      return;
    }

    mutation.mutate(data);
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
          {maxAmounts?.adminOrderProfit > 0 && (
            <Box>
              <StyledFormField
                intputType="text"
                labelComponent={
                  <TitleWithToolTip
                    title={`Lyxa Order Refund: ${(maxAmounts?.adminOrderProfit || 0)?.toFixed(2)}`}
                    tooltip="Lyxa Order Profit"
                  />
                }
                inputProps={{
                  value: refundData?.partialPayment?.adminOrderProfit,
                  type: 'number',
                  name: 'adminOrderProfit',
                  placeholder: 'Enter Amount',
                  onChange: updateRefundAmount,
                }}
              />

              {isSecondaryCurrencyEnabled && (
                <Typography mt="-8px" variant="body3" display="block">
                  Equivalent Price: {secondaryCurrency}{' '}
                  {Number(refundData?.partialPayment?.adminOrderProfit) * shopExchangeRate}
                </Typography>
              )}
            </Box>
          )}

          {/* Delivery Refund */}
          {maxAmounts?.adminRiderProfit > 0 && (
            <Box>
              <StyledFormField
                labelComponent={
                  <TitleWithToolTip
                    title={`Lyxa Delivery Refund: ${(maxAmounts?.adminRiderProfit || 0)?.toFixed(2)}`}
                    tooltip="Lyxa Delivery Profit"
                  />
                }
                intputType="text"
                inputProps={{
                  value: refundData?.partialPayment?.adminRiderProfit,
                  type: 'number',
                  name: 'adminRiderProfit',
                  placeholder: 'Enter Amount',
                  onChange: updateRefundAmount,
                }}
              />
              {isSecondaryCurrencyEnabled && (
                <Typography mt="-8px" variant="body3" display="block">
                  Equivalent Price: {secondaryCurrency}{' '}
                  {Number(refundData?.partialPayment?.adminRiderProfit) * adminExchangeRate}
                </Typography>
              )}
            </Box>
          )}

          {/* Shop Profit */}
          {maxAmounts?.shop > 0 && (
            <Box>
              <StyledFormField
                labelComponent={
                  <TitleWithToolTip
                    title={`Shop Refund: ${(maxAmounts?.shop || 0)?.toFixed(2)}`}
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
          title={`Total Admin Vat: ${baseCurrency} ${(refundData?.partialPayment?.adminVat || 0)?.toFixed(2)} 
          ${
            isSecondaryCurrencyEnabled
              ? ` ~ ${secondaryCurrency} ${Math.round(refundData?.partialPayment?.adminVat * shopExchangeRate)}`
              : ''
          }
          `}
        />
      )}

      <TitleWithToolTip
        title={`Total Refund Amount: ${(totalRefundAmount || 0)?.toFixed(2)}  ${
          isSecondaryCurrencyEnabled ? ` ~ ${secondaryCurrency} ${Math.round(totalRefundSecondary)}` : ''
        }`}
        tooltip="Lyxa Earning + Lyxa VAT + Shop Earning + Shop VAT+Rider Earning + Rider VAT"
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
