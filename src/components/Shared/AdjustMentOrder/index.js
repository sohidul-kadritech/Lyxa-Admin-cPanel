/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Button, Paper, Stack, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { successMsg } from '../../../helpers/successMsg';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import AdjusmentReason from './AdjusmentReason';
import AdjustMentOrderSummary from './AdjustmentOrderSummary';
import CustomerInfo from './CustomerInfo';
import AdjustmentPaymentSummary from './PaymentSummary';
import { checkAnyMarketing, generateAdjustOrdeJsonData } from './helpers';

const getInitialOrderData = (order) => ({
  ...order,
  productsDetails: [
    ...order?.productsDetails?.map((product) => {
      const updatedProduct = Array.isArray(product?.marketing)
        ? product
        : { ...product, marketing: product?.marketing ? [{ ...product?.marketing }] : [] };

      const skipDiscount = checkAnyMarketing(updatedProduct)
        ? !(checkAnyMarketing(updatedProduct)?.type === 'reward' && product?.finalReward?.baseCurrency_amount > 0)
        : false;

      return { ...updatedProduct, skipDiscount };
    }),
  ],
  adjustmentReason: '',
});

const getOrderSummary = (order) => ({ ...order?.summary });

function AdjustmentOrder({ onClose, order = {} }) {
  const [adjuestedOrder, setAdjustedOrder] = useState(getInitialOrderData({ ...order }));

  console.log({ adjuestedOrder });

  const oldOrderSummary = useMemo(() => getOrderSummary(order), []);

  const queryClient = useQueryClient();

  const adjustOrderQuery = useMutation((data) => AXIOS.post(API_URL.ADJUST_ORDER, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg(data?.message, 'success');
        onClose();
        queryClient.invalidateQueries(API_URL.ORDER_LIST);
      } else {
        successMsg(data?.message, 'success');
      }
    },
  });

  const onAdjustOrder = () => {
    const validate = generateAdjustOrdeJsonData(adjuestedOrder);

    // console.log('adjustedOrder', { adjuestedOrder, validate });

    if (validate?.status === true) {
      adjustOrderQuery.mutate(validate?.data);
    }
  };

  return (
    <Paper
      sx={{
        width: 'min(90vw, 1530px)',
        height: 'min(90vh, 1250px)',
        background: '#fff',
        position: 'relative',
        borderRadius: '8px',
        padding: '48px',
        overflow: 'auto',
        transition: 'all 0.3s linear',
      }}
    >
      {/* header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
        <Typography fontSize="18px" variant="h4">
          Adjust Order: #{adjuestedOrder?.orderId}
        </Typography>
        <CustomerInfo
          title={adjuestedOrder?.user?.name}
          image={adjuestedOrder?.user?.profile_photo}
          subtitle={adjuestedOrder?.user?.phone_number}
        />
      </Stack>

      <Stack>
        <AdjustMentOrderSummary
          order={adjuestedOrder}
          setAdjustedOrder={setAdjustedOrder}
          oldOrderSummary={oldOrderSummary}
        />

        <AdjustmentPaymentSummary order={adjuestedOrder} />

        <AdjusmentReason order={adjuestedOrder} setAdjustedOrder={setAdjustedOrder} />
      </Stack>

      <Stack direction="row" mt={4} justifyContent="flex-end" alignItems="center" gap={2.5}>
        <Button variant="outlined" color="primary" onClick={onClose} disabled={adjustOrderQuery?.isLoading}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={onAdjustOrder} disabled={adjustOrderQuery?.isLoading}>
          Adjust Order
        </Button>
      </Stack>
    </Paper>
  );
}

export default AdjustmentOrder;
