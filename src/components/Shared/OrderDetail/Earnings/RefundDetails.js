/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { useGlobalContext } from '../../../../context';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function RefundDetails({ order = {} }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;
  const exchangeRate = general?.appSetting?.exchangeRate;

  return (
    <StyledOrderDetailBox title="Refund After Delivered">
      <Box pt={2} pb={1}>
        <Box borderBottom="1px solid #EEEEEE">
          <SummaryItem label="Refund Type" value={order?.userRefundTnx?.[0]?.isPartialRefund ? 'Partial' : 'Full'} />
        </Box>
        <Box pt={3.5}>
          <SummaryItem label="Admin Cut" value={order?.userRefundTnx?.[0]?.adminCut} isNegative showIfZero />
          <SummaryItem label="Admin VAT Cut" value={order?.userRefundTnx?.[0]?.adminVatCut} isNegative showIfZero />
          <SummaryItem label="Rider Cut" value={order?.userRefundTnx?.[0]?.deliveryBoyCut} isNegative showIfZero />
          <SummaryItem label="Shop Cut" value={order?.userRefundTnx?.[0]?.shopCut} isNegative showIfZero />
          <SummaryItem
            pt={3.5}
            label="Total Refund"
            value={`${secondaryCurrency} ${order?.userRefundTnx?.[0]?.amount} ~ ${currency} ${(
              order?.userRefundTnx?.[0]?.amount / exchangeRate || 0
            ).toFixed(2)}`}
            isTotal
          />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
