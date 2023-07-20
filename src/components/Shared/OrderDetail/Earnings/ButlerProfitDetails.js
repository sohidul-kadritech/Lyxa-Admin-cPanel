/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import React from 'react';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function ButlerProfitDetails({ order = {} }) {
  const totalPayment = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;
  const currency = order?.baseCurrency?.symbol;
  const secondaryCurrency = order?.secondaryCurrency?.code;
  const shopExchangeRate = order?.shopExchangeRate;

  return (
    <StyledOrderDetailBox title="Order Profit Details">
      <Box pt={2}>
        <SummaryItem label="Total Order Amount" value={totalPayment} showIfZero />
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          <SummaryItem
            label="Rider Profit"
            value={order?.shop?.haveOwnDeliveryBoy ? 'Self' : order?.deliveryBoyFee}
            showIfZero
          />
        </Box>
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          {!order?.shop?.haveOwnDeliveryBoy && (
            <SummaryItem label="Lyxa Delivery Profit" value={order?.dropCharge} showIfZero />
          )}
        </Box>
        <Box borderTop="1px solid #EEEEEE" pt={3.5}>
          <SummaryItem
            label="Total Lyxa Profit"
            value={`${secondaryCurrency} ${order?.dropCharge} ~ ${currency} ${(
              order?.dropCharge / shopExchangeRate || 0
            ).toFixed(2)}`}
            isTotal
          />
          <SummaryItem label="Lyxa VAT" value={order?.vatAmount?.vatForAdmin} pb={0} showIfZero />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
