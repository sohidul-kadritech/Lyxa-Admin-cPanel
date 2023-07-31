/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import React from 'react';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function ButlerProfitDetails({ order = {} }) {
  const totalPayment =
    order?.summary?.baseCurrency_cash + order?.summary?.baseCurrency_wallet + order?.summary?.baseCurrency_card || 0;
  const adminExchangeRate = order?.adminExchangeRate;

  return (
    <StyledOrderDetailBox title="Order Profit Details">
      <Box pt={2}>
        <SummaryItem label="Total Order Amount" value={totalPayment} showIfZero useAdminRate />
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          <SummaryItem
            label="Rider Profit"
            value={order?.shop?.haveOwnDeliveryBoy ? 'Self' : order?.baseCurrency_riderFee}
            useAdminRate
            showIfZero
          />
        </Box>
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          {!order?.shop?.haveOwnDeliveryBoy && (
            <SummaryItem
              label="Lyxa Delivery Profit"
              value={order?.adminCharge?.baseCurrency_adminChargeFromDelivery}
              showIfZero
              useAdminRate
            />
          )}
        </Box>
        <Box borderTop="1px solid #EEEEEE" pt={3.5}>
          <SummaryItem
            label="Total Lyxa Profit"
            value={order?.adminCharge?.baseCurrency_adminChargeFromDelivery}
            exchangeRate={adminExchangeRate}
            isTotal
            useAdminRate
          />
          <SummaryItem
            label="Lyxa VAT"
            value={order?.vatAmount?.baseCurrency_vatForAdmin}
            pb={0}
            showIfZero
            useAdminRate
          />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
