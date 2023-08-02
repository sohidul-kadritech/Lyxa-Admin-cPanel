/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function RefundDetails({ order = {} }) {
  const adminExchangeRate = order?.adminExchangeRate;

  return (
    <StyledOrderDetailBox title="Refund After Delivered">
      <Box pt={2} pb={1}>
        <Box borderBottom="1px solid #EEEEEE">
          <SummaryItem label="Refund Type" value={order?.userRefundTnx?.[0]?.isPartialRefund ? 'Partial' : 'Full'} />
        </Box>
        <Box pt={3.5}>
          <SummaryItem
            label="Admin Cut"
            value={order?.userRefundTnx?.[0]?.adminCut}
            isNegative
            showIfZero
            showBaseOnly
          />

          <SummaryItem
            label="Admin VAT Cut"
            value={order?.userRefundTnx?.[0]?.adminVatCut}
            isNegative
            showIfZero
            showBaseOnly
          />

          <SummaryItem
            label="Rider Cut"
            value={order?.userRefundTnx?.[0]?.deliveryBoyCut}
            isNegative
            showIfZero
            showBaseOnly
          />

          <SummaryItem label="Shop Cut" value={order?.userRefundTnx?.[0]?.shopCut} isNegative showIfZero showBaseOnly />
          <SummaryItem
            pt={3.5}
            label="Total Refund"
            value={order?.userRefundTnx?.[0]?.amount}
            exchangeRate={adminExchangeRate}
            showBaseOnly
            isTotal
          />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
