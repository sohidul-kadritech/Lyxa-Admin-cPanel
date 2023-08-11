/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function RefundBeforeDelivered({ order = {} }) {
  const totalRefundAmount = order?.userCancelTnx?.reduce((a, b) => a + b?.amount, 0);
  const totalRefundAmountSecondary = order?.userCancelTnx?.reduce((a, b) => a + b?.secondaryCurrency_amount, 0);

  console.log('userCancelTnx', order?.userCancelTnx);

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
            value={
              order?.userCancelTnx?.[0]?.baseCurrency_adminCut + order?.userCancelTnx?.[0]?.baseCurrency_adminVatCut
            }
            valueSecondary={
              order?.userCancelTnx?.[0]?.secondaryCurrency_adminCut +
              order?.userCancelTnx?.[0]?.secondaryCurrency_adminVatCut
            }
            isNegative
            tooltip="Lyxa Profit + Lyxa Vat"
          />

          <SummaryItem
            label="Rider Cut"
            value={order?.userCancelTnx?.[0]?.baseCurrency_deliveryBoyCut}
            valueSecondary={order?.userCancelTnx?.[0]?.secondaryCurrency_deliveryBoyCut}
            isNegative
          />

          <SummaryItem
            label="Shop Cut"
            value={order?.userCancelTnx?.[0]?.baseCurrency_shopCut}
            valueSecondary={order?.userCancelTnx?.[0]?.secondaryCurrency_shopCut}
            isNegative
          />

          <SummaryItem
            label="Total Refund"
            value={totalRefundAmount}
            valueSecondary={totalRefundAmountSecondary}
            total
            isNegative
            isCurrency={false}
          />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
