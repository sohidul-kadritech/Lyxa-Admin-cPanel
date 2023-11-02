/* eslint-disable no-unused-vars */
import { Button, Paper, Stack, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import AdjusmentReason from './AdjusmentReason';
import AdjustMentOrderSummary from './AdjustmentOrderSummary';
import CustomerInfo from './CustomerInfo';
import AdjustmentPaymentSummary from './PaymentSummary';
import { generateAdjustOrdeJsonData } from './helpers';

const getInitialOrderData = (order) => ({ ...order, adjustmentReason: '' });

const getOrderSummary = (order) => ({ ...order?.summary });

function AdjustmentOrder({ onClose, order = {} }) {
  const [adjuestedOrder, setAdjustedOrder] = useState(getInitialOrderData({ ...order }));

  // const [oldOrderSummary, setOldOrderSummary] = useState(getOrderSummary({ ...order }));

  const oldOrderSummary = useMemo(() => {
    console.log('call use memo');
    return getOrderSummary(order);
  }, []);

  console.log({ oldOrderSummary, adjuestedOrder });

  const onAdjustOrder = () => {
    const validate = generateAdjustOrdeJsonData(adjuestedOrder);

    console.log('adjustedOrder', { adjuestedOrder, validate });
  };

  return (
    <Paper
      sx={{
        width: 'min(90vw, 1440px)',
        height: 'min(90vh, 900px)',
        background: '#fff',
        position: 'relative',
        borderRadius: '8px',
        padding: '48px',
        overflow: 'auto',
      }}
    >
      {/* header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" pb={5}>
        <Typography fontSize="18px" variant="h4">
          Adjust Order
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
        <Button variant="outlined" color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={onAdjustOrder}>
          Adjust Order
        </Button>
      </Stack>
    </Paper>
  );
}

export default AdjustmentOrder;
