/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function RefundDetails({ order = {} }) {
  const adminExchangeRate = order?.adminExchangeRate;

  return (
    <StyledOrderDetailBox title="Refund After Delivered">
      <Box pt={2} pb={1}>
        <Box borderBottom="1px solid #EEEEEE">
          <SummaryItem
            label="Refund Type"
            value={order?.userRefundTnx?.[0]?.isPartialRefund ? 'Partial' : 'Full'}
            useAdminRate
          />
        </Box>
        <Box pt={3.5}>
          <SummaryItem
            label="Admin Cut"
            value={order?.userRefundTnx?.[0]?.adminCut}
            isNegative
            showIfZero
            useAdminRate
          />
          <SummaryItem
            label="Admin VAT Cut"
            value={order?.userRefundTnx?.[0]?.adminVatCut}
            isNegative
            showIfZero
            useAdminRate
          />
          <SummaryItem
            label="Rider Cut"
            value={order?.userRefundTnx?.[0]?.deliveryBoyCut}
            isNegative
            showIfZero
            useAdminRate
          />
          <SummaryItem label="Shop Cut" value={order?.userRefundTnx?.[0]?.shopCut} isNegative showIfZero useAdminRate />
          <SummaryItem
            pt={3.5}
            label="Total Refund"
            value={order?.userRefundTnx?.[0]?.amount}
            exchangeRate={adminExchangeRate}
            useAdminRate
            isTotal
          />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
