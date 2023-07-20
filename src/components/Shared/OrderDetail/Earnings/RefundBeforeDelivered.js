/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function RefundBeforeDelivered({ order = {} }) {
  const currency = order?.baseCurrency?.symbol;
  const secondaryCurrency = order?.secondaryCurrency?.code;
  const shopExchangeRate = order?.shopExchangeRate;

  return (
    <StyledOrderDetailBox title="Refund Before Delivered">
      <Box pt={2}>
        <Box borderBottom="1px solid #EEEEEE">
          <SummaryItem label="Refund Type" value={order?.userCancelTnx?.[0]?.isPartialRefund ? 'Partial' : 'Full'} />
        </Box>
        <Box pt={3.5}>
          <SummaryItem
            label="Lyxa Cut"
            value={order?.userCancelTnx?.[0]?.adminCut + order?.userCancelTnx?.[0]?.adminVatCut}
            tooltip="Lyxa Profit + Lyxa Vat"
            isNegative
            showIfZero
          />
          <SummaryItem label="Rider Cut" value={order?.userCancelTnx?.[0]?.deliveryBoyCut} isNegative showIfZero />
          <SummaryItem label="Shop Cut" value={order?.userCancelTnx?.[0]?.shopCut} isNegative />
          <SummaryItem
            label="Total Refund"
            value={`${secondaryCurrency} ${order?.userCancelTnx?.[0]?.amount} ~ ${currency} ${(
              order?.userCancelTnx?.[0]?.amount / shopExchangeRate || 0
            )?.toFixed(2)}`}
            total
            isNegative
            isCurrency={false}
          />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
