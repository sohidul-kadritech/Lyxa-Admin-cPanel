/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function RefundDetails({ order = {} }) {
  const adminExchangeRate = order?.adminExchangeRate;
  console.log('best-shop', order?.userRefundTnx?.[0]);

  return (
    <StyledOrderDetailBox title="Refund After Delivered">
      <Box pt={2} pb={1}>
        <Box borderBottom="1px solid #EEEEEE">
          <SummaryItem label="Refund Type" value={order?.userRefundTnx?.[0]?.isPartialRefund ? 'Partial' : 'Full'} />
        </Box>
        <Box pt={3.5}>
          <SummaryItem
            label="Admin Cut"
            value={order?.userRefundTnx?.[0]?.baseCurrency_adminCut}
            valueSecondary={order?.userRefundTnx?.[0]?.secondaryCurrency_adminCut}
            isNegative
            showIfZero
          />

          <SummaryItem
            label="Admin VAT Cut"
            value={order?.userRefundTnx?.[0]?.baseCurrency_adminVatCut}
            valueSecondary={order?.userRefundTnx?.[0]?.secondaryCurrency_adminVatCut}
            isNegative
            showIfZero
          />

          <SummaryItem
            label="Shop Cut"
            value={order?.userRefundTnx?.[0]?.baseCurrency_shopCut}
            valueSecondary={order?.userRefundTnx?.[0]?.secondaryCurrency_shopCut}
            isNegative
            showIfZero
          />
          <SummaryItem
            pt={3.5}
            label="Total Refund"
            value={order?.userRefundTnx?.[0]?.amount}
            valueSecondary={order?.userRefundTnx?.[0]?.secondaryCurrency_amount}
            exchangeRate={adminExchangeRate}
            isTotal
          />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
