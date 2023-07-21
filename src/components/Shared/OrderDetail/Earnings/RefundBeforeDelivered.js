/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function RefundBeforeDelivered({ order = {} }) {
  const adminExchangeRate = order?.adminExchangeRate;

  return (
    <StyledOrderDetailBox title="Refund Before Delivered">
      <Box pt={2}>
        <Box borderBottom="1px solid #EEEEEE">
          <SummaryItem
            label="Refund Type"
            value={order?.userCancelTnx?.[0]?.isPartialRefund ? 'Partial' : 'Full'}
            useAdminRate
          />
        </Box>
        <Box pt={3.5}>
          <SummaryItem
            label="Lyxa Cut"
            value={order?.userCancelTnx?.[0]?.adminCut + order?.userCancelTnx?.[0]?.adminVatCut}
            useAdminRate
            tooltip="Lyxa Profit + Lyxa Vat"
            isNegative
            showIfZero
          />
          <SummaryItem
            label="Rider Cut"
            value={order?.userCancelTnx?.[0]?.deliveryBoyCut}
            isNegative
            showIfZero
            useAdminRate
          />
          <SummaryItem label="Shop Cut" value={order?.userCancelTnx?.[0]?.shopCut} isNegative useAdminRate />
          <SummaryItem
            label="Total Refund"
            value={order?.userCancelTnx?.[0]?.amount}
            useAdminRate
            exchangeRate={adminExchangeRate}
            total
            isNegative
            isCurrency={false}
          />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
