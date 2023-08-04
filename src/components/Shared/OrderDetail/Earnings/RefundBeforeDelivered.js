/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function RefundBeforeDelivered({ order = {} }) {
  const totalRefundAmount = order?.userCancelTnx?.reduce((a, b) => a + b?.amount, 0);

  return (
    <StyledOrderDetailBox title="Refund Before Delivered">
      <Box pt={2}>
        <Box borderBottom="1px solid #EEEEEE">
          <SummaryItem
            label="Refund Type"
            value={order?.userCancelTnx?.[0]?.isPartialRefund ? 'Partial' : 'Full'}
            showBaseOnly
          />
        </Box>
        <Box pt={3.5}>
          <SummaryItem
            label="Lyxa Cut"
            value={order?.userCancelTnx?.[0]?.adminCut + order?.userCancelTnx?.[0]?.adminVatCut}
            tooltip="Lyxa Profit + Lyxa Vat"
            isNegative
            showIfZero
            showBaseOnly
          />

          <SummaryItem
            label="Rider Cut"
            value={order?.userCancelTnx?.[0]?.deliveryBoyCut}
            isNegative
            showIfZero
            showBaseOnly
          />

          <SummaryItem label="Shop Cut" value={order?.userCancelTnx?.[0]?.shopCut} isNegative showBaseOnly />

          <SummaryItem label="Total Refund" value={totalRefundAmount} total isNegative isCurrency={false} />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
