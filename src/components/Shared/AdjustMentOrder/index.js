/* eslint-disable no-unused-vars */
import { Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import AdjusmentReason from './AdjusmentReason';
import AdjustMentOrderSummary from './AdjustmentOrderSummary';
import CustomerInfo from './CustomerInfo';
import AdjustmentPaymentSummary from './PaymentSummary';

function AdjustmentOrder({ onClose, order }) {
  const [adjuestedOrder, setAdjustedOrder] = useState({ ...order });

  // useEffect(() => {
  //   setAdjustedOrder(order);
  // }, [order]);

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
        <AdjustMentOrderSummary order={adjuestedOrder} setAdjustedOrder={setAdjustedOrder} />
        <AdjustmentPaymentSummary order={adjuestedOrder} />
        <AdjusmentReason />
      </Stack>
    </Paper>
  );
}

export default AdjustmentOrder;
