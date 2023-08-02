/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import React from 'react';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function ButlerProfitDetails({ order = {} }) {
  const totalPayment =
    order?.summary?.baseCurrency_cash + order?.summary?.baseCurrency_wallet + order?.summary?.baseCurrency_card || 0;

  const total_secondary =
    order?.summary?.secondaryCurrency_cash +
      order?.summary?.secondaryCurrency_wallet +
      order?.summary?.secondaryCurrency_card || 0;

  return (
    <StyledOrderDetailBox title="Order Profit Details">
      <Box pt={2}>
        <SummaryItem label="Total Order Amount" value={totalPayment} valueSecondary={total_secondary} showIfZero />
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          <SummaryItem
            label="Rider Profit"
            value={order?.shop?.haveOwnDeliveryBoy ? 'Self' : order?.baseCurrency_riderFee}
            valueSecondary={order?.secondaryCurrency_riderFee}
            showIfZero
          />
        </Box>
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          {!order?.shop?.haveOwnDeliveryBoy && (
            <SummaryItem
              label="Lyxa Delivery Profit"
              value={order?.adminCharge?.baseCurrency_adminChargeFromDelivery}
              valueSecondary={order?.adminCharge?.secondaryCurrency_adminChargeFromDelivery}
              showIfZero
            />
          )}
        </Box>
        <Box borderTop="1px solid #EEEEEE" pt={3.5}>
          <SummaryItem
            label="Total Lyxa Profit"
            value={order?.adminCharge?.baseCurrency_adminChargeFromDelivery}
            valueSecondary={order?.adminCharge?.secondaryCurrency_adminChargeFromDelivery}
            isTotal
            showIfZero
          />
          <SummaryItem
            label="Lyxa VAT"
            value={order?.vatAmount?.baseCurrency_vatForAdmin}
            valueSecondary={order?.vatAmount?.secondaryCurrency_vatForAdmin}
            pb={0}
            showIfZero
          />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
